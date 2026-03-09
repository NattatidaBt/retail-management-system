import React, { useState, useEffect } from 'react';
import api from '../services/api'; // นำเข้า api service เพื่อเชื่อมต่อ backend

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลประวัติการขายจาก API เมื่อหน้าจอโหลด
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // เรียก API ไปที่ GET /orders เพื่อดึงรายการทั้งหมดจากฐานข้อมูล
        const response = await api.get('/orders');
        setHistory(response.data);
      } catch (err) {
        console.error('Fetch history error:', err);
        setError('ไม่สามารถดึงข้อมูลประวัติการขายได้');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f4f4f4]">
        <p className="text-gray-400 text-sm">กำลังโหลดประวัติการขาย...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4] p-6 lg:p-8">
      
      {/* Header ของหน้า */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">รายการประวัติการขาย</h2>
        <p className="text-gray-500 text-sm mt-1">ดูประวัติการขายทั้งหมดที่บันทึกลงฐานข้อมูล</p>
      </div>

      {/* พื้นที่สำหรับเลื่อนดูการ์ด */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
        
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-400">ยังไม่มีประวัติการขายในระบบ</div>
        ) : (
          history.map((order) => (
            <div key={order.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              
              {/* หัวข้อการ์ด: ข้อมูลเลขออร์เดอร์และวันที่ */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h3 className="text-lg font-bold text-black">ออร์เดอร์ #{order.id}</h3>
                </div>
                <div className="w-[125px] h-[3px] bg-[#F5B544] mt-1.5 rounded-full"></div>
                
                {/* แสดงวันที่และเวลาที่ดึงมาจาก created_at ใน DB */}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(order.created_at).toLocaleString('th-TH')}
                </p>
              </div>

              {/* ส่วนรายละเอียด: แสดงผลสรุปยอดเงินและวิธีชำระเงิน */}
              <div className="flex gap-5">
                
                {/* ด้านซ้าย: รูปไอคอนแทนสินค้า */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shrink-0">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>

                {/* ด้านขวา: ข้อมูลสรุปออร์เดอร์ */}
                <div className="flex flex-col justify-center flex-1">
                  
                  <div className="flex justify-between items-start w-full">
                    <span className="font-bold text-black text-base">ชำระด้วย: {order.payment_method || 'เงินสด'}</span>
                    <span className="text-gray-500 font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                      สำเร็จ
                    </span>
                  </div>
                  
                  <div className="mt-1">
                    <span className="text-[#E87523] font-bold text-lg">
                      {/* เปลี่ยนจาก total_amount เป็น total_price ตามตาราง orders */}
                      {Number(order.total_price || 0).toFixed(2)} บาท
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 border-dashed">
                    <span className="text-sm font-bold text-gray-600">
                      {/* เปลี่ยนจาก vat เป็น vat_amount ตามตาราง orders */}
                      ภาษีมูลค่าเพิ่ม (7%): {Number(order.vat_amount || 0).toFixed(2)} บาท
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}