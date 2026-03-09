const supabase = require('../config/supabase');

/**
 * บันทึก Activity Log
 * @param {object} user  - req.user (มี userId, role)
 * @param {string} action       - ชื่อ action เช่น 'เพิ่มสินค้า'
 * @param {string} target_type  - ประเภท เช่น 'product' | 'order' | 'stock' | 'user'
 * @param {string} target_id    - id ของ target
 * @param {string} detail       - รายละเอียดเพิ่มเติม
 */
const logActivity = async (user, action, target_type, target_id, detail) => {
  try {
    // ดึงชื่อ user จาก DB
    const { data: userData } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.userId)
      .single();

    await supabase.from('activity_logs').insert({
      user_id:     user.userId,
      user_name:   userData?.name || 'Unknown',
      action,
      target_type,
      target_id:   String(target_id),
      detail,
    });
  } catch (err) {
    // ไม่ให้ log error ทำให้ request หลักพัง
    console.error('logActivity error:', err.message);
  }
};

module.exports = logActivity;