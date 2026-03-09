import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api"; // นำเข้าฟังก์ชันดึงข้อมูลจริง

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทุกหมวดหมู่");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // สำหรับจัดการข้อผิดพลาด

  // ดึงข้อมูลสินค้าจาก API เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // เรียก API ที่จัดการ Bearer Token และการเข้าถึงฐานข้อมูลอัตโนมัติ
        const data = await getProducts();
        
        // ข้อมูลที่ได้จะเป็น Array ของสินค้าจากตาราง products
        setProducts(data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่ภายหลัง");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // กำหนดหมวดหมู่สินค้าให้ตรงตามชื่อที่เก็บในตาราง categories ของฐานข้อมูล
  const categories = ['ทุกหมวดหมู่', 'เครื่องดื่ม', 'ขนมกินเล่น', 'ของใช้', 'อาหารสด', 'ยาและเวชภัณฑ์'];

  // ส่วนของการกรองข้อมูลสินค้าตามคำค้นหาและหมวดหมู่
  const filtered = products.filter((p) => {
    // แปลงข้อมูลเป็นตัวพิมพ์เล็กและจัดการค่าว่างเพื่อป้องกันการ Error
    const searchTerm = search.toLowerCase().trim();
    const productName = (p.name || "").toLowerCase();
    
    // ตรวจสอบข้อมูลรหัสสินค้า (id) และรหัสสากล (product_code) ตามโครงสร้างฐานข้อมูล
    const productId = p.id?.toString() || "";
    const productCode = (p.product_code || "").toLowerCase();

    // ตรวจสอบความสอดคล้องของคำค้นหากับชื่อสินค้าและรหัสสินค้าต่างๆ
    const matchSearch = productName.includes(searchTerm) || 
                        productId.includes(searchTerm) || 
                        productCode.includes(searchTerm);
    
    // ตรวจสอบการเลือกหมวดหมู่โดยอ้างอิงจากคอลัมน์ category_name ที่ได้จากการ JOIN หรือ View
    // ปรับให้การเปรียบเทียบชื่อหมวดหมู่ไม่มีช่องว่างเกินจำเป็น
    const itemCategoryName = (p.category_name || "ไม่มีหมวดหมู่").trim();
    const matchCategory = category === "ทุกหมวดหมู่" || itemCategoryName === category;

    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f4f4] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f4f4f4] min-h-full">

      {/* ปุ่มจัดการสินค้า */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/product-manage")} 
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-200 text-sm shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มสินค้า
        </button>
      </div>

      {/* ส่วนค้นหาและกรองข้อมูล */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัสสินค้า"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-600 outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ตารางแสดงผลข้อมูลสินค้า */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 bg-amber-800 text-white text-sm font-semibold px-6 py-3">
          <span>รหัสสินค้า</span>
          <span>รายการสินค้า</span>
          <span>หมวดหมู่สินค้า</span>
          <span>ราคาขาย</span>
          <span>จำนวนสินค้าคงเหลือ</span>
        </div>

        {error ? (
          <div className="bg-white px-6 py-8 text-center text-sm text-red-400">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white px-6 py-8 text-center text-sm text-gray-400">
            ไม่พบสินค้าในระบบ
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/products/${item.id}`)}
              className={`grid grid-cols-5 px-6 py-3.5 text-sm text-gray-700 cursor-pointer transition-colors duration-150 ${
                i % 2 === 0 ? "bg-amber-100 hover:bg-amber-200" : "bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <span className="text-gray-500">{item.id}</span>  
              <span className="font-medium">{item.name}</span>
              <span>{item.category_name || "ไม่มีหมวดหมู่"}</span>
              <span>฿ {Number(item.price || 0).toFixed(2)}</span>
              <span className={Number(item.stock) < 10 ? "text-red-500 font-bold" : ""}>
                {item.stock}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}