import React, { useState } from 'react';

const mockProducts = [
  { id: 'P001', name: 'น้ำส้มคั้นสด 1L',     sku: 'DRK-001', category: 'เครื่องดื่ม', price: 90,  cost: 65,  stock: 3,  reorder: 10, emoji: '🥤', unit: 'ขวด' },
  { id: 'P002', name: 'บะหมี่กึ่งสำเร็จรูป', sku: 'FD-042',  category: 'ของกินเล่น',      price: 45,  cost: 28,  stock: 8,  reorder: 20, emoji: '🍜', unit: 'ซอง' },
  { id: 'P003', name: 'แชมพูซันซิลก์ 400ml',  sku: 'HCC-015', category: 'ของใช้',     price: 140, cost: 95,  stock: 2,  reorder: 15, emoji: '🧴', unit: 'ขวด' },
  { id: 'P004', name: 'คุกกี้เนยอบกรอบ',      sku: 'SNK-088', category: 'อาหารสด',        price: 100, cost: 65,  stock: 52, reorder: 10, emoji: '🍪', unit: 'กล่อง' },
  { id: 'P005', name: 'กระดาษทิชชู 12 ม้วน', sku: 'HME-033', category: 'ยาและเวชภัณฑ์', price: 170, cost: 120, stock: 4,  reorder: 12, emoji: '🧻', unit: 'แพ็ก' },
  { id: 'P006', name: 'นมสดโฟร์โมสต์ 1L',    sku: 'DRK-008', category: 'เครื่องดื่ม', price: 55, cost: 38,  stock: 88, reorder: 20, emoji: '🥛', unit: 'แพ็ก' },
];

const adjustTypes = [
  '+ เพิ่มสต็อก (รับสินค้าเข้า)',
  '- ลดสต็อก (จ่ายสินค้าออก)',
];


export default function ProductManage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [adjustTarget, setAdjustTarget] = useState(null); // product ที่กำลังปรับ
  const [adjustType, setAdjustType] = useState(adjustTypes[0]);
  const [adjustQty, setAdjustQty] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const openAdjust = (product) => {
    setAdjustTarget(product);
    setAdjustType(adjustTypes[0]);
    setAdjustQty('');
  };

  const handleAdjustSave = () => {
    if (!adjustQty || Number(adjustQty) <= 0) { showToast('⚠ กรุณากรอกจำนวน'); return; }
    const qty = Number(adjustQty);
    setProducts(prev => prev.map(p => {
      if (p.id !== adjustTarget.id) return p;
      const isAdd = adjustType.startsWith('+');
      const isSet = adjustType.startsWith('=');
      const newStock = isSet ? qty : isAdd ? p.stock + qty : Math.max(0, p.stock - qty);
      return { ...p, stock: newStock };
    }));
    showToast('✓ ปรับสต็อกเรียบร้อย');
    setAdjustTarget(null);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    showToast('🗑 ลบสินค้าเรียบร้อย');
  };

  // preview จำนวนใหม่
  const previewStock = () => {
    if (!adjustTarget || !adjustQty || Number(adjustQty) <= 0) return null;
    const qty = Number(adjustQty);
    const isAdd = adjustType.startsWith('+');
    const isSet = adjustType.startsWith('=');
    return isSet ? qty : isAdd ? adjustTarget.stock + qty : Math.max(0, adjustTarget.stock - qty);
  };

  return (
    <div className="p-6 flex flex-col gap-5 h-full overflow-y-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-amber-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

      {/* หัว + ค้นหา */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-extrabold text-amber-900">สินค้าทั้งหมด</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-100 rounded-xl shadow-sm focus-within:border-amber-400 transition-all w-64">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="flex-1 outline-none text-sm text-amber-900 placeholder-amber-300"
            placeholder="ค้นหา..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ตาราง */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-100">
                {['ID สินค้า','สินค้า','หมวดหมู่','สต็อก','สถานะ','จัดการ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-amber-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                return (
                  <tr key={p.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                    {/* ID สินค้า */}
                    <td className="px-4 py-3 text-sm font-bold text-amber-500">{p.id}</td>
                    {/* ชื่อสินค้า */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-amber-900">{p.name}</div>
                      <div className="text-xs text-amber-400">฿{p.price}/{p.unit}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${p.stock <= p.reorder ? 'text-orange-500' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.stock <= p.reorder
                        ? <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-500">สินค้าใกล้หมด</span>
                        : <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">ปกติ</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openAdjust(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border-2 border-amber-200 text-amber-700 hover:border-amber-400 transition-all">
                          ปรับ
                        </button>
                        <button onClick={() => setDeleteId(p.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-all">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-amber-300">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-sm">ไม่พบสินค้าที่ค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ปรับสต็อก ── */}
      {adjustTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 relative">

            {/* ปิด */}
            <button onClick={() => setAdjustTarget(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>

            {/* หัว */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">📦</span>
              <h2 className="text-base font-extrabold text-gray-900">ปรับสต็อกสินค้า</h2>
            </div>

            {/* ข้อมูลสินค้า */}
            <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3 mb-6">
              <span className="text-3xl">{adjustTarget.emoji}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{adjustTarget.name}</p>
                <p className="text-amber-600 text-xs font-semibold">สต็อกปัจจุบัน: {adjustTarget.stock} ชิ้น</p>
              </div>
            </div>

            {/* ประเภท + จำนวน */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทการปรับ</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition cursor-pointer"
                  value={adjustType} onChange={e => setAdjustType(e.target.value)}
                >
                  {adjustTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">จำนวน</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition"
                  placeholder="0"
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* preview สต็อกใหม่ */}
            {previewStock() !== null && (
              <div className="mb-5 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">
                สต็อกหลังปรับ: <span className="text-green-800 font-extrabold">{previewStock()} ชิ้น</span>
              </div>
            )}

            {/* ปุ่ม */}
            <div className="flex gap-3">
              <button onClick={() => setAdjustTarget(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                ยกเลิก
              </button>
              <button onClick={handleAdjustSave}
                className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-white font-bold text-sm transition">
                ✓ บันทึกการปรับสต็อก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ยืนยันลบ ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-7 text-center">
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="font-extrabold text-gray-900 mb-2">ยืนยันการลบ?</h3>
            <p className="text-sm text-gray-500 mb-6">การลบไม่สามารถย้อนกลับได้</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                ยกเลิก
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition">
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}