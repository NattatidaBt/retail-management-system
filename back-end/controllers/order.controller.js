const supabase = require('../config/supabase');

/* =========================
   GET /orders
   ดู Order History (staff + admin)
========================= */
exports.getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders_with_user')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET /orders/:id
   ดูรายละเอียด Order + Items (Modal)
========================= */
exports.getOrderById = async (req, res) => {
  try {
    // ดึง order header
    const { data: order, error: orderError } = await supabase
      .from('orders_with_user')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ดึง order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items_detail')
      .select('*')
      .eq('order_id', req.params.id);

    if (itemsError) throw itemsError;

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   POST /orders
   สร้าง Order ใหม่ (Checkout) — staff + admin
   Body: { items: [{ product_id, quantity, unit_price, product_name, image_url }] }
========================= */
exports.createOrder = async (req, res) => {
  const { items } = req.body;
  const userId = req.user.userId;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Items are required' });
  }

  try {
    // คำนวณยอดเงิน
    const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const vat_amount = parseFloat((subtotal * 0.07).toFixed(2));
    const total_price = parseFloat((subtotal + vat_amount).toFixed(2));

    // สร้าง order header
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: userId, subtotal, vat_amount, total_price }])
      .select()
      .single();

    if (orderError) throw orderError;

    // สร้าง order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      image_url: item.image_url || null,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // ลด stock ของแต่ละสินค้า
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', item.product_id);
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: { ...order, items: orderItems }
    });

  } catch (error) {
    console.error('createOrder error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET /orders/dashboard
   ข้อมูล Dashboard Stats (admin only)
========================= */
exports.getDashboard = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};