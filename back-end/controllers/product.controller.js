const supabase = require('../config/supabase');
const logActivity = require('./logActivity'); // ✅ เพิ่ม

/* =========================
   GET /products
========================= */
exports.getProducts = async (req, res) => {
  try {
    const { search, category_id } = req.query;

    let query = supabase
      .from('products_with_category')
      .select('*')
      .order('id');

    if (search) query = query.ilike('name', `%${search}%`);
    if (category_id) query = query.eq('category_id', category_id);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET /products/:id
========================= */
exports.getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products_with_category')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   POST /products  (admin only)
========================= */
exports.createProduct = async (req, res) => {
  const {
    name, category_id, price,
    stock, min_stock, image_url,
    weight_g, cost_price, barcode
  } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        category_id,
        price,
        stock:      stock      ?? 0,
        min_stock:  min_stock  ?? 5,
        image_url:  image_url  || null,
        weight_g:   weight_g   || null,
        cost_price: cost_price ?? null,
        barcode:    barcode    || null,
      }])
      .select()
      .single();

    if (error) throw error;

    // ✅ บันทึก log
    await logActivity(
      req.user,
      'เพิ่มสินค้า',
      'product',
      data.id,
      `เพิ่มสินค้า "${name}" ราคา ${price} บาท สต็อก ${stock ?? 0} ชิ้น`
    );

    res.status(201).json({ message: 'Product created', product: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   PUT /products/:id  (admin only)
========================= */
exports.updateProduct = async (req, res) => {
  const {
    name, category_id, price, min_stock, image_url,
    weight_g, cost_price, barcode
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name, category_id, price, min_stock, image_url,
        weight_g, cost_price, barcode,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ บันทึก log
    await logActivity(
      req.user,
      'แก้ไขสินค้า',
      'product',
      req.params.id,
      `แก้ไขข้อมูลสินค้า "${name}" ราคา ${price} บาท`
    );

    res.json({ message: 'Product updated', product: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   PATCH /products/:id/stock  (admin only)
========================= */
exports.adjustStock = async (req, res) => {
  const { adjustment } = req.body;

  if (adjustment === undefined) {
    return res.status(400).json({ message: 'adjustment is required (e.g. 10 or -5)' });
  }

  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock, name')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newStock = product.stock + Number(adjustment);
    if (newStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // ✅ บันทึก log
    const actionType = Number(adjustment) >= 0 ? 'เพิ่มสต็อก' : 'ลดสต็อก';
    await logActivity(
      req.user,
      actionType,
      'stock',
      req.params.id,
      `ปรับสต็อก "${product.name}" จาก ${product.stock} → ${newStock} (${Number(adjustment) >= 0 ? '+' : ''}${adjustment})`
    );

    res.json({
      message: `Stock updated: ${product.stock} → ${newStock}`,
      product: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE /products/:id  (admin only)
========================= */
exports.deleteProduct = async (req, res) => {
  try {
    // ✅ ดึงชื่อก่อนลบ เพื่อบันทึก log
    const { data: product } = await supabase
      .from('products')
      .select('name')
      .eq('id', req.params.id)
      .single();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // ✅ บันทึก log
    await logActivity(
      req.user,
      'ลบสินค้า',
      'product',
      req.params.id,
      `ลบสินค้า "${product?.name || req.params.id}" ออกจากระบบ`
    );

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};