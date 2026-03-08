import React, { useState } from 'react';

const categories = ['ทุกหมวดหมู่', 'เครื่องดื่ม', 'ขนมกินเล่น', 'ของใช้', 'อาหารสด', 'ยาและเวชภัณฑ์'];
const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-[#D9D9D9] text-gray-700 text-sm outline-none focus:ring-2 focus:ring-amber-700 transition placeholder-gray-400 font-medium';

export default function ManageProduct() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('ทุกหมวดหมู่');
  const [barcode, setBarcode] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [addQty, setAddQty] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!productName.trim()) { alert('กรุณากรอกชื่อสินค้า'); return; }
    alert(`✅ บันทึกสินค้า "${productName}" สำเร็จ`);
  };

  const handleCancel = () => {
    setProductName('');
    setCategory('ทุกหมวดหมู่');
    setBarcode('');
    setSellPrice('');
    setCostPrice('');
    setAddQty('');
    setWeight('');
    setImage(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4] p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white border-2 border-[#8B5A2B] rounded-[24px] p-8 shadow-sm">

        {/* รูปภาพสินค้า */}
        <div className="mb-6">
          <label className="block text-base font-bold text-black mb-2">รูปภาพสินค้า</label>
          <div className="flex gap-5">
            {/* Preview ใหญ่ด้านซ้าย */}
            <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-[#D9D9D9] flex items-center justify-center overflow-hidden flex-shrink-0">
              {image ? (
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">ยังไม่มีรูปภาพ</span>
                </div>
              )}
            </div>
            {/* ปุ่มด้านขวา */}
            <div className="flex flex-col justify-center gap-3">
              <label className="cursor-pointer px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition text-center">
                📷 เลือกรูปภาพ
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {image && (
                <button onClick={() => setImage(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 text-red-400 hover:text-red-600 text-sm font-bold rounded-xl transition">
                  🗑 ลบรูป
                </button>
              )}
              <p className="text-xs text-gray-400 leading-relaxed">รองรับ JPG, PNG<br />ขนาดไม่เกิน 5MB</p>
            </div>
          </div>
        </div>

        {/* ชื่อสินค้า */}
        <div className="mb-6">
          <label className="block text-base font-bold text-black mb-2">ชื่อสินค้า</label>
          <input type="text" className={inputClass} placeholder="กรอกชื่อสินค้า"
            value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>

        {/* หมวดหมู่ */}
        <div className="mb-6">
          <label className="block text-base font-bold text-black mb-2">หมวดหมู่</label>
          <div className="relative">
            <select className={`${inputClass} appearance-none cursor-pointer`}
              value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* บาร์โค้ด */}
        <div className="mb-6">
          <label className="block text-base font-bold text-black mb-2">บาร์โค้ด</label>
          <input type="text" className={inputClass} placeholder="กรอกบาร์โค้ด"
            value={barcode} onChange={(e) => setBarcode(e.target.value)} />
        </div>

        {/* ราคาขาย + ราคาต้นทุน */}
        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-base font-bold text-black mb-2">ราคาขาย</label>
            <div className="relative">
              <span className="absolute left-4 inset-y-0 flex items-center text-gray-500 text-sm font-medium">฿</span>
              <input type="number" className={`${inputClass} pl-8`} placeholder="0.00"
                value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} min="0" step="0.01" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-base font-bold text-black mb-2">ราคาต้นทุน</label>
            <div className="relative">
              <span className="absolute left-4 inset-y-0 flex items-center text-gray-500 text-sm font-medium">฿</span>
              <input type="number" className={`${inputClass} pl-8`} placeholder="0.00"
                value={costPrice} onChange={(e) => setCostPrice(e.target.value)} min="0" step="0.01" />
            </div>
          </div>
        </div>

        {/* น้ำหนักสินค้า */}
        <div className="mb-6">
          <label className="block text-base font-bold text-black mb-2">น้ำหนักสินค้า</label>
          <div className="flex items-center gap-3">
            <input type="number" className={`${inputClass}`} placeholder="0.00"
              value={weight} onChange={(e) => setWeight(e.target.value)} min="0" step="0.01" />
            <span className="text-sm font-bold text-gray-500 whitespace-nowrap">กรัม</span>
          </div>
        </div>

        {/* จำนวนที่เพิ่มเข้าใหม่ */}
        <div className="mb-8 w-1/2">
          <label className="block text-base font-bold text-black mb-2">จำนวนที่เพิ่มเข้าใหม่</label>
          <div className="relative">
            <input type="number" className={`${inputClass} pr-10`} placeholder="0"
              value={addQty} onChange={(e) => setAddQty(e.target.value)} min="0" />
            {addQty && Number(addQty) > 0 && (
              <span className="absolute right-3 inset-y-0 flex items-center text-green-600 text-xs font-bold">
                +{addQty}
              </span>
            )}
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-end items-center gap-4">
          <button onClick={handleSave}
            className="text-black font-bold text-base hover:text-amber-700 transition">
            บันทึก
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={handleCancel}
            className="text-black font-bold text-base hover:text-red-600 transition">
            ยกเลิก
          </button>
        </div>

      </div>
    </div>
  );
}