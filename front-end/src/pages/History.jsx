import React from 'react';

// สร้างข้อมูลจำลอง (Mock Data) 3 รายการตามที่ขอครับ
const mockHistory = [
  {
    id: 1,
    name: 'กระดาษชำระสก็อต 110 แผ่น',
    price: 169.00,
    qty: 1,
    date: '26 ต.ค. 2023 14:30'
  },
  {
    id: 2,
    name: 'น้ำแร่ Evian 500 ml',
    price: 189.00,
    qty: 2,
    date: '26 ต.ค. 2023 10:15'
  },
  {
    id: 3,
    name: 'ผงซักฟอก บรีส เอกเซล',
    price: 278.00,
    qty: 1,
    date: '25 ต.ค. 2023 16:45'
  }
];

export default function History() {
  return (
    <div className="flex flex-col h-full bg-[#f4f4f4] p-6 lg:p-8">
      
      {/* Header ของหน้า */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">รายการประวัติการขาย</h2>
        <p className="text-gray-500 text-sm mt-1">ดูประวัติการขายทั้งหมดของคุณได้ที่นี่</p>
      </div>

      {/* พื้นที่สำหรับเลื่อนดูการ์ด (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
        
        {mockHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            
            {/* หัวข้อการ์ด: ไอคอนนาฬิกา + ประวัติการขาย + เส้นสีเหลือง */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {/* ไอคอนนาฬิกา */}
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 className="text-lg font-bold text-black">ประวัติการขาย</h3>
              </div>
              {/* เส้นสีเหลืองขีดเน้นใต้ข้อความ */}
              <div className="w-[125px] h-[3px] bg-[#F5B544] mt-1.5 rounded-full"></div>
              
              {/* แถมวันที่ให้ดูสมจริงขึ้นนิดนึงครับ */}
              <p className="text-xs text-gray-400 mt-2">{item.date}</p>
            </div>

            {/* ส่วนรายละเอียดสินค้า: รูปซ้าย - ข้อมูลขวา */}
            <div className="flex gap-5">
              
              {/* ด้านซ้าย: รูปสินค้า */}
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 shrink-0">
                <span className="text-gray-400 text-xs font-medium">รูปสินค้า</span>
              </div>

              {/* ด้านขวา: ข้อมูล */}
              <div className="flex flex-col justify-center flex-1">
                
                {/* ชื่อสินค้า และ จำนวน */}
                <div className="flex justify-between items-start w-full">
                  <span className="font-bold text-black text-base">{item.name}</span>
                  <span className="text-gray-500 font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded-md">x{item.qty}</span>
                </div>
                
                {/* ราคา */}
                <div className="mt-1">
                  <span className="text-[#E87523] font-bold text-lg">{item.price.toFixed(2)} บาท</span>
                </div>

                {/* สรุปรายการ */}
                <div className="mt-3 pt-3 border-t border-gray-100 border-dashed">
                  <span className="text-sm font-bold text-gray-600">
                    สินค้ารวมทั้งหมด {item.qty} รายการ
                  </span>
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}