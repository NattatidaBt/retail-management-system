import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from "../services/api"; // นำเข้าฟังก์ชันดึงข้อมูลจริง

export default function Salespoint({ cart, setCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // เปลี่ยนจาก initialProducts เป็น state ว่าง
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- ส่วนที่แก้ไข: ดึงข้อมูลสินค้าจริงจาก Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // เรียก API ที่มีการแนบ Token อัตโนมัติ
        const data = await getProducts();
        setProducts(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("โหลดข้อมูลสินค้าไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // เช็คจำนวนสินค้าชิ้นนั้นๆ ในตะกร้า
  const getQty = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  // ฟังก์ชันเพิ่มสินค้า (ปรับให้รองรับโครงสร้างข้อมูลจาก Database)
  const handleAdd = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ฟังก์ชันลดสินค้า
  const handleRemove = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  // คำนวณยอดรวม (ใช้ Number เพื่อป้องกันปัญหาข้อมูลจาก DB เป็น String)
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + (Number(i.price) * i.qty), 0);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f4f4f4]">
        <p className="text-gray-500">กำลังเชื่อมต่อฐานข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4]">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => {
            const qty = getQty(product.id);
            
            return (
              <div key={product.id} className="bg-[#FCFBF8] rounded-2xl p-4 flex flex-col items-center shadow-sm border border-gray-100 hover:shadow-md transition">
                
                {/* รูปสินค้า (ดึงจาก image_url ถ้ามี) */}
                <div className="w-full h-32 flex items-center justify-center mb-2 bg-white rounded-xl">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-24 h-24 object-contain" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300">
                      ไม่มีรูป
                    </div>
                  )}
                </div>

                <div className="w-full text-left mb-3">
                  <p className="font-bold text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-400">คงเหลือ: {product.stock}</p>
                </div>

                <div className="w-full flex justify-between items-center mt-auto">
                  <p className="text-[#E87523] font-bold text-base">฿ {Number(product.price).toFixed(2)}</p>
                  
                  <div>
                    {qty === 0 ? (
                      <button 
                        onClick={() => handleAdd(product)}
                        disabled={product.stock <= 0}
                        className={`px-4 py-1.5 text-sm font-bold rounded-full transition ${
                          product.stock > 0 
                          ? 'bg-amber-100 text-[#E87523] hover:bg-amber-200' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.stock > 0 ? '+ เพิ่ม' : 'หมด'}
                      </button>
                    ) : (
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
                          disabled={qty >= product.stock}
                          className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-lg leading-none pb-0.5 transition ${
                            qty < product.stock ? 'bg-[#FF8C00] hover:bg-[#e67e00]' : 'bg-gray-300 cursor-not-allowed'
                          }`}
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
        <div className="bg-[#FCFBF8] rounded-[20px] px-3 py-1.5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <span className="font-bold text-lg text-black pr-2">{totalQty}</span>
        </div>

        <button 
          onClick={() => totalQty > 0 && navigate('/confirm-payment')}
          className={`border-2 border-dashed border-[#007BFF] bg-white/50 px-6 py-1.5 text-black font-bold text-lg rounded-xl ${totalQty > 0 ? 'hover:bg-white hover:border-solid transition-all cursor-pointer shadow-sm' : 'opacity-50 cursor-not-allowed'}`}
        >
          ดูตะกร้าสินค้า
        </button>

        <div className="flex items-baseline gap-2 text-black font-bold bg-white/40 px-4 py-1.5 rounded-xl">
            <span className="text-xl">{totalPrice.toFixed(2)}</span>
            <span className="text-lg">บาท</span>
        </div>
      </div>
    </div>
  );
}