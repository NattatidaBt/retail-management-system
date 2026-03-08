import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialProducts = [
  { id: 1, name: 'น้ำแร่ Evian', price: 189.00, image: null },
  { id: 2, name: 'น้ำยาปรับผ้านุ่ม', price: 169.00, image: null },
  { id: 3, name: 'ยาสีฟัน Colgate', price: 155.00, image: null },
  { id: 4, name: 'กระดาษชำระ Scott', price: 129.00, image: null },
  { id: 5, name: 'ผงซักฟอก บรีส', price: 278.00, image: null },
  { id: 6, name: 'แชมพู แพนทีน', price: 289.00, image: null },
];

export default function Salespoint({ cart, setCart }) {
  const navigate = useNavigate();
  const [products] = useState(initialProducts);

  // เช็คจำนวนสินค้าชิ้นนั้นๆ ในตะกร้า
  const getQty = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  // ฟังก์ชันเพิ่มสินค้า
  const handleAdd = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ฟังก์ชันลดสินค้า (ถ้าเหลือ 0 ให้ลบออก)
  const handleRemove = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.id !== id); // ลบออกเมื่อเหลือ 0
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  // คำนวณยอดรวม Real-time
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4]">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => {
            const qty = getQty(product.id);
            
            return (
              <div key={product.id} className="bg-[#FCFBF8] rounded-2xl p-4 flex flex-col items-center shadow-sm border border-gray-100 hover:shadow-md transition">
                
                {/* รูปสินค้า */}
                <div className="w-full h-32 flex items-center justify-center mb-2 bg-white rounded-xl">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300">
                    รูปสินค้า
                  </div>
                </div>

                {/* ชื่อสินค้า */}
                <div className="w-full text-left mb-3">
                  <p className="font-bold text-gray-800">{product.name}</p>
                </div>

                {/* ราคา และ ปุ่มจัดการจำนวน */}
                <div className="w-full flex justify-between items-center mt-auto">
                  <p className="text-[#E87523] font-bold text-base">฿ {product.price.toFixed(2)}</p>
                  
                  <div>
                    {qty === 0 ? (
                      // ยังไม่มีในตะกร้า -> แสดงปุ่ม [+ เพิ่ม]
                      <button 
                        onClick={() => handleAdd(product)}
                        className="px-4 py-1.5 bg-amber-100 text-[#E87523] text-sm font-bold rounded-full hover:bg-amber-200 transition"
                      >
                        + เพิ่ม
                      </button>
                    ) : (
                      // มีในตะกร้าแล้ว -> แสดงปุ่ม [-] จำนวน [+]
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleRemove(product.id)} 
                          className="w-7 h-7 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5 hover:bg-[#e67e00] transition"
                        >
                          −
                        </button>
                        <span className="font-bold text-black text-base w-4 text-center">{qty}</span>
                        <button 
                          onClick={() => handleAdd(product)} 
                          className="w-7 h-7 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5 hover:bg-[#e67e00] transition"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="bg-[#F5B544] px-6 py-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        
        {/* Cart Icon */}
        <div className="bg-[#FCFBF8] rounded-[20px] px-3 py-1.5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <span className="font-bold text-lg text-black pr-2">{totalQty}</span>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => totalQty > 0 && navigate('/confirm-payment')}
          className={`border-2 border-dashed border-[#007BFF] bg-white/50 px-6 py-1.5 text-black font-bold text-lg rounded-xl ${totalQty > 0 ? 'hover:bg-white hover:border-solid transition-all cursor-pointer shadow-sm' : 'opacity-50 cursor-not-allowed'}`}
        >
          ดูตะกร้าสินค้า
        </button>

        {/* Total Price */}
        <div className="flex items-baseline gap-2 text-black font-bold bg-white/40 px-4 py-1.5 rounded-xl">
            <span className="text-xl">{totalPrice.toFixed(2)}</span>
            <span className="text-lg">บาท</span>
        </div>

      </div>
    </div>
  );
}