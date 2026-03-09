import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // นำเข้า api service

const adjustTypes = [
  '+ เพิ่มสต็อก (รับสินค้าเข้า)',
  '- ลดสต็อก (จ่ายสินค้าออก)',
];

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [adjustTarget, setAdjustTarget] = useState(null); // สินค้าที่กำลังปรับ
  const [adjustType, setAdjustType] = useState(adjustTypes[0]);
  const [adjustQty, setAdjustQty] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  // ปรับปรุง fetchProducts ให้ดึงข้อมูลทั้งหมดจาก API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // ตรวจสอบให้มั่นใจว่า API คืนค่าสินค้าครบทั้ง 51 รายการ
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (err) {
      showToast('ไม่สามารถดึงข้อมูลสินค้าได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      alert('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงส่วนจัดการสต็อกได้');
      window.location.href = '/dashboard';
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (msg) => { 
    setToast(msg); 
    setTimeout(() => setToast(''), 2500); 
  };

  const filtered = products.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.id || "").toString().includes(search) ||
    (p.product_code || "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdjust = (product) => {
    setAdjustTarget(product);
    setAdjustType(adjustTypes[0]);
    setAdjustQty('');
  };

  // ✅ แก้ไขฟังก์ชันปรับสต็อกให้รองรับการ "ลดสต็อก" และส่งค่าไป Backend ได้ถูกต้อง
  const handleAdjustSave = async () => {
    if (!adjustQty || Number(adjustQty) <= 0) { 
      showToast('กรุณากรอกจำนวน'); 
      return; 
    }
    
    const qty = Number(adjustQty);
    const isAdd = adjustType.startsWith('+');
    
    // ✅ จุดสำคัญ: Backend ต้องการค่า 'adjustment' เป็นส่วนต่าง (บวกเมื่อเพิ่ม, ลบเมื่อลด)
    // ตัวอย่าง: ถ้าต้องการลด 5 ต้องส่งค่า -5 ไปให้ Backend คำนวณ
    const adjustmentValue = isAdd ? qty : -qty;

    try {
      // ✅ 1. เรียกไปที่ Endpoint /products/:id/stock
      // ✅ 2. ส่งชื่อคีย์เป็น "adjustment" ตามที่ Controller รอรับ
      await api.patch(`/products/${adjustTarget.id}/stock`, { 
        adjustment: adjustmentValue 
      });
      
      showToast('ปรับสต็อกเรียบร้อย');
      setAdjustTarget(null);
      fetchProducts(); // รีโหลดข้อมูลเพื่อแสดงผลยอดใหม่
    } catch (err) {
      // หากปรับแล้วสต็อกจะติดลบ Backend จะส่ง Error กลับมา
      const errMsg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการปรับสต็อก';
      showToast(errMsg);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      showToast('ลบสินค้าเรียบร้อย');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      showToast('ไม่สามารถลบสินค้าได้');
      console.error(err);
    }
  };

  const previewStock = () => {
    if (!adjustTarget || !adjustQty || Number(adjustQty) <= 0) return null;
    const qty = Number(adjustQty);
    const isAdd = adjustType.startsWith('+');
    const currentStock = Number(adjustTarget.stock || 0);
    return isAdd ? currentStock + qty : Math.max(0, currentStock - qty);
  };

  if (loading) return <div className="p-6 text-center text-amber-900">กำลังโหลดข้อมูลสต็อก...</div>;

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6 flex flex-col gap-5">

      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-amber-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-amber-900">จัดการสต็อกและสินค้า</h1>
          <p className="text-xs text-amber-500 font-bold mt-1">จำนวนสินค้าทั้งหมด: {products.length} รายการ</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-100 rounded-xl shadow-sm focus-within:border-amber-400 transition-all w-64">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="flex-1 outline-none text-sm text-amber-900 placeholder-amber-300"
            placeholder="ค้นหาชื่อหรือ ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-100 bg-white sticky top-0 z-10">
                {['ID','สินค้า','หมวดหมู่','สต็อกปัจจุบัน','สถานะ','จัดการ'].map(h => (
                  <th key={h} className="px-4 py-4 text-left text-xs font-bold text-amber-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isLowStock = Number(p.stock) <= (Number(p.min_stock) || 0);
                return (
                  <tr key={p.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-amber-500">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-amber-900">{p.name}</div>
                      <div className="text-xs text-amber-400">บาร์โค้ด: {p.barcode || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{p.category_name || 'ทั่วไป'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                        {p.stock} <span className="text-[10px] text-gray-400 font-normal">/ {p.min_stock || 0}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isLowStock
                        ? <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-500">สินค้าใกล้หมด</span>
                        : <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">ปกติ</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openAdjust(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border-2 border-amber-200 text-amber-700 hover:border-amber-400 transition-all">
                          ปรับสต็อก
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
            <div className="flex flex-col items-center justify-center py-16 text-amber-300 bg-white">
              <p className="text-sm font-bold">ไม่พบข้อมูลสินค้าที่ค้นหา</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal ปรับปรุงสต็อก */}
      {adjustTarget && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 relative">
            <button onClick={() => setAdjustTarget(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>

            <h2 className="text-base font-extrabold text-gray-900 mb-5">ปรับปรุงจำนวนสต็อก</h2>

            <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-3 mb-6 border border-amber-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{adjustTarget.name}</p>
                <p className="text-amber-600 text-xs font-semibold uppercase">จำนวนปัจจุบัน: {adjustTarget.stock}</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2 font-black uppercase">การดำเนินการ</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition cursor-pointer font-bold"
                  value={adjustType} onChange={e => setAdjustType(e.target.value)}
                >
                  {adjustTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2 font-black uppercase">จำนวน</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition font-bold"
                  placeholder="0"
                  value={adjustQty}
                  onChange={e => setAdjustQty(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            {previewStock() !== null && (
              <div className="mb-5 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-bold uppercase">
                ยอดคงเหลือใหม่: <span className="text-green-800 font-black">{previewStock()}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setAdjustTarget(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                ยกเลิก
              </button>
              <button onClick={handleAdjustSave}
                className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-white font-bold text-sm transition shadow-lg shadow-amber-200">
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการลบสินค้า */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-7 text-center">
            <h3 className="font-extrabold text-gray-900 mb-2">ยืนยันการลบสินค้า?</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">ข้อมูลนี้จะหายไปจากระบบทันที</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
                ยกเลิก
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition">
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}