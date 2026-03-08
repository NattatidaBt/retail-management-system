import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProduct({
      id: "I101",
      name: "นมจืด",
      category: "เครื่องดื่ม",
      weight: "200 ml",
      barcode: "8851234567890",
      lastRestocked: "01/03/2569",
      price: 15.00,
      cost: 10.00,
      stock: 32,
      status: "ปกติ",
      image: null,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f4f4] min-h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 pt-2 bg-[#f4f4f4] min-h-full">

      {/* Card */}
      <div
        className="bg-white rounded-3xl p-8 max-w-2xl mx-auto"
        style={{ border: "2px solid #92642a" }}
      >

        {/* ปุ่มย้อนกลับ + ปุ่มแก้ไข */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/products')}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => navigate("/product-manage")}
            className="w-10 h-10 flex items-center justify-center bg-amber-400 hover:bg-amber-500 rounded-xl shadow-sm transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-8">

          {/* รูปสินค้า */}
          <div
            className="w-48 h-48 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#fdf6e3", border: "1px solid #e5d5b0" }}
          >
            {product.image ? (
              <img src={product.image} alt="product" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <svg className="w-16 h-16 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="flex-1 space-y-3">

            {/* ชื่อสินค้า */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">ชื่อสินค้า</p>
              <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">{product.name}</div>
            </div>

            {/* หมวดหมู่ + น้ำหนัก */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">หมวดหมู่</p>
                <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">{product.category}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">น้ำหนัก</p>
                <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">{product.weight}</div>
              </div>
            </div>

            {/* บาร์โค้ด */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">บาร์โค้ด</p>
              <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">{product.barcode}</div>
            </div>

            {/* วันที่เติมสต็อกล่าสุด */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">วันที่เติมสต็อกสินค้าล่าสุด</p>
              <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">{product.lastRestocked}</div>
            </div>

            {/* ราคาขาย + ราคาต้นทุน */}
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">ราคาขาย</p>
                <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">฿ {product.price.toFixed(2)}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">ราคาต้นทุน</p>
                <div className="bg-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500">฿ {product.cost.toFixed(2)}</div>
              </div>
            </div>

            {/* จำนวนสินค้า + สถานะ */}
            <div className="flex items-end gap-4">
              <div className="w-36">
                <p className="text-sm font-semibold text-gray-700 mb-1">จำนวนสินค้า</p>
                <div className="bg-white rounded-xl px-4 py-2.5 text-sm text-gray-500 border-2 border-blue-400">
                  {product.stock}
                </div>
              </div>
              <div className="pb-2.5 flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">สถานะ</p>
                <p className="text-sm font-semibold text-green-500">{product.status}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}