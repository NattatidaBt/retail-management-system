import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทุกหมวดหมู่");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Mock data — เปลี่ยนเป็น API จริงทีหลัง
    setProducts([
      { id: "I101", name: "นมจืด", category: "เครื่องดื่ม", price: 15.00, stock: 32 },
      { id: "I102", name: "ทิชชู", category: "ของใช้", price: 25.00, stock: 18 },
      { id: "I103", name: "น้ำดื่ม", category: "เครื่องดื่ม", price: 10.00, stock: 50 },
      { id: "I104", name: "ขนมปัง", category: "อาหาร", price: 35.00, stock: 5 },
      { id: "I105", name: "นมถั่วเหลือง", category: "เครื่องดื่ม", price: 12.00, stock: 8 },
    ]);
    setLoading(false);
  }, []);

  const categories = ['ทุกหมวดหมู่', 'เครื่องดื่ม', 'ขนมกินเล่น', 'ของใช้', 'อาหารสด', 'ยาและเวชภัณฑ์'];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.includes(search) || p.id.includes(search);
    const matchCategory = category === "ทุกหมวดหมู่" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f4f4] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f4f4f4] min-h-full">

      {/* ปุ่มเพิ่มสินค้า */}
      <div className="flex justify-end mb-4">
        <button
        onClick={() => navigate("/product-manage")} 
        className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-200 text-sm shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มสินค้า
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-5">

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-600 outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="grid grid-cols-5 bg-amber-800 text-white text-sm font-semibold px-6 py-3">
          <span>รหัสสินค้า</span>
          <span>รายการสินค้า</span>
          <span>หมวดหมู่สินค้า</span>
          <span>ราคาขาย</span>
          <span>จำนวนสินค้าคงเหลือ</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="bg-white px-6 py-8 text-center text-sm text-gray-400">
            ไม่พบสินค้า
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/products/${item.id}`)}
              className={`grid grid-cols-5 px-6 py-3.5 text-sm text-gray-700 ${
                i % 2 === 0 ? "bg-amber-100" : "bg-amber-50"
              }`}
            >
              <span className="text-gray-500">{item.id}</span>  
              <span className="font-medium">{item.name}</span>
              <span>{item.category}</span>
              <span>฿ {item.price.toFixed(2)}</span>
              <span>{item.stock}</span>
            </div>
          ))
        )}

      </div>
    </div>
  );
}