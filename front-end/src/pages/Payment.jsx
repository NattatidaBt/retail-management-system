import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment({ cart = [], setCart, onConfirm }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod] = useState('เงินสด');
  const [received, setReceived] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // ✅ เพิ่ม

  const addQty = (id) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const removeQty = (id) => setCart((prev) => {
    const item = prev.find((i) => i.id === id);
    if (!item) return prev;
    if (item.qty === 1) return prev.filter((i) => i.id !== id);
    return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
  });
  const deleteItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal;
  const change = method === 'เงินสด' ? Math.max(0, Number(received) - total) : 0;

  const handleConfirmPayment = () => {
    setShowModal(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setCart([]);
    onConfirm && onConfirm(total);
    navigate('/pos');
  };

  const paymentMethods = [
    {
      id: 'เงินสด',
      label: 'เงินสด',
      icon: (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <rect x="4" y="12" width="40" height="24" rx="4" fill="#4CAF50" />
          <circle cx="24" cy="24" r="7" fill="#81C784" />
          <circle cx="24" cy="24" r="4" fill="#2E7D32" />
          <rect x="4" y="12" width="8" height="8" rx="2" fill="#388E3C" />
          <rect x="36" y="28" width="8" height="8" rx="2" fill="#388E3C" />
        </svg>
      ),
    },
    {
      id: 'พร้อมเพย์',
      label: 'พร้อมเพย์',
      icon: (
        <svg viewBox="0 0 48 48" className="w-9 h-9">
          <rect x="6" y="8" width="36" height="32" rx="4" fill="#1565C0" />
          <rect x="10" y="14" width="10" height="7" rx="1" fill="#fff" opacity="0.9" />
          <rect x="22" y="14" width="6" height="3" rx="1" fill="#fff" opacity="0.7" />
          <rect x="22" y="19" width="6" height="2" rx="1" fill="#fff" opacity="0.5" />
          <rect x="10" y="28" width="28" height="2" rx="1" fill="#fff" opacity="0.4" />
          <rect x="10" y="32" width="16" height="2" rx="1" fill="#fff" opacity="0.4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white p-8">
      <h2 className="font-bold text-black text-lg mb-6">ตรวจสอบรายการสั่งซื้อ</h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-base">ไม่มีสินค้าในตะกร้า</p>
          <p className="text-gray-400 text-sm">กรุณาเลือกสินค้าจากหน้าขายสินค้าก่อน</p>
          <button onClick={() => navigate('/pos')}
            className="mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-sm rounded-xl transition">
            ← กลับไปเลือกสินค้า
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="divide-y divide-gray-200 border-b border-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-6 py-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    : <span className="text-xs text-gray-400">รูป</span>}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-black text-base">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeQty(item.id)} className="w-6 h-6 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5">−</button>
                      <span className="font-bold text-black text-base w-4 text-center">{item.qty}</span>
                      <button onClick={() => addQty(item.id)} className="w-6 h-6 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5">+</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="font-bold text-black text-base w-24 text-right">{(item.price * item.qty).toFixed(2)} บาท</p>
                    {/* ✅ เปลี่ยนจาก deleteItem ตรงๆ มาเป็น setDeleteTarget */}
                    <button onClick={() => setDeleteTarget(item)} className="text-[#E74C3C] hover:text-red-700 transition">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-sm ml-auto mr-10 space-y-3">
            <div className="flex justify-between font-bold text-black text-base">
              <span>รวม</span>
              <div className="w-32 flex justify-between"><span>{subtotal.toFixed(2)}</span><span>บาท</span></div>
            </div>
            <div className="flex justify-between font-bold text-black text-base pt-2 border-t border-gray-200">
              <span>รวมทั้งหมด</span>
              <div className="w-32 flex justify-between"><span>{total.toFixed(2)}</span><span>บาท</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-auto pt-4">
        <button onClick={() => navigate('/pos')} className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">
          กลับไปเลือกสินค้า
        </button>
        <button
          onClick={() => { setReceived(''); setShowModal(true); }}
          disabled={cart.length === 0}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          ชำระเงิน
        </button>
      </div>

      {/* ── Modal ยืนยันลบสินค้า ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-8 flex flex-col items-center text-center">
            {/* ไอคอนตะกร้า */}
            <div className="w-20 h-20 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <svg className="w-11 h-11 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-700 text-base mb-1">
              ต้องการลบ <span className="text-amber-500 font-bold">{deleteTarget.name}</span>
            </p>
            <p className="text-gray-700 text-base mb-6">ออกจากคลังสินค้าหรือไม่</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => deleteItem(deleteTarget.id)}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-xl transition"
              >
                ยืนยันการลบ
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal เลือกช่องทางชำระเงิน ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-[420px] p-7 relative">
            <button onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
              ✕
            </button>
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h3 className="font-bold text-lg text-gray-900">ชำระเงิน</h3>
            </div>
            <div className="bg-amber-50 rounded-2xl py-5 text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">ยอดที่ต้องชำระ</p>
              <p className="text-4xl font-bold text-amber-600">฿{total.toFixed(0)}</p>
            </div>
            <p className="text-sm font-bold text-gray-700 mb-3">เลือกวิธีชำระเงิน</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {paymentMethods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center justify-center py-5 rounded-2xl border-2 transition
                    ${method === m.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'}`}>
                  {m.icon}
                  <span className="mt-2 font-bold text-sm text-gray-800">{m.label}</span>
                </button>
              ))}
            </div>
            {method === 'เงินสด' && (
              <div className="mb-4">
                <label className="text-sm font-bold text-gray-700 mb-2 block">รับเงินมา (฿)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-base outline-none focus:ring-2 focus:ring-amber-400 transition"
                  placeholder="0.00"
                  value={received}
                  onChange={(e) => setReceived(e.target.value)}
                  min="0"
                />
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="text-sm font-bold text-gray-700">เงินทอน</span>
                  <span className="text-base font-bold text-green-600">฿{change.toFixed(0)}</span>
                </div>
              </div>
            )}
            <button
              onClick={handleConfirmPayment}
              disabled={method === 'เงินสด' && Number(received) < total}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-white font-bold text-base rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed mt-1">
              ✓ ยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      )}

      {/* ── Modal ชำระเงินสำเร็จ ── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">ชำระเงินสำเร็จ</h3>
            <p className="text-gray-500 text-sm mb-1">ยอดชำระ <span className="font-bold text-amber-600">฿{total.toFixed(2)}</span></p>
            <p className="text-gray-400 text-xs mb-6">ช่องทาง: {method}</p>
            <button onClick={handleSuccessClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-2xl transition">
              เสร็จสิ้น
            </button>
          </div>
        </div>
      )}
    </div>
  );
}