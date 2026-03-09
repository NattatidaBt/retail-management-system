const supabase = require('../config/supabase');

/* =========================
   GET /logs
   ดู activity log ทั้งหมด (admin only)
========================= */
exports.getLogs = async (req, res) => {
  try {
    const { limit = 100, action, user_id } = req.query;

    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (action)  query = query.eq('action', action);
    if (user_id) query = query.eq('user_id', user_id);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};