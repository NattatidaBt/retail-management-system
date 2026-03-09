const supabase = require('../config/supabase');

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
    weight_g, cost_price, barcode   // ✅ field ใหม่
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
    weight_g, cost_price, barcode   // ✅ field ใหม่
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
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};