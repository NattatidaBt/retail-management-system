import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // นำเข้า api service เพื่อเชื่อมต่อ backend

export default function Dashboard() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState({
    totalSales: "0.00",
    totalStock: 0,
    lowStock: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลสรุปจาก Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // เรียก API เพื่อดึงข้อมูลออร์เดอร์และสต็อกสินค้า
        // ใช้ Promise.all เพื่อดึงข้อมูลหลายแหล่งพร้อมกันช่วยให้แอปโหลดเร็วขึ้น
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products")
        ]);

        const orders = ordersRes.data || [];
        const products = productsRes.data || [];

        // คำนวณยอดขายเฉพาะของวันนี้ (เปรียบเทียบจากวันที่สร้างรายการ)
        const todayStr = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => order.created_at.startsWith(todayStr));
        
        // แก้ไข: ใช้ total_price ตามชื่อคอลัมน์ในฐานข้อมูลจริง
        const dailyTotal = todayOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

        // ประมวลผลข้อมูลสรุปสต็อกสินค้า
        const totalStockCount = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
        const lowStockList = products.filter(item => Number(item.stock) <= (Number(item.min_stock) || 5));

        setSummaryData({
          totalSales: dailyTotal.toFixed(2),
          totalStock: totalStockCount,
          lowStock: lowStockList.length,
        });

        // รายการขายล่าสุด (แสดง 5 รายการล่าสุดที่มีสถานะสำเร็จ)
        setRecentSales(orders.slice(0, 5));

        // รายการสินค้าที่สต็อกต่ำกว่าเกณฑ์
        setLowStockItems(lowStockList.slice(0, 5));

      } catch (error) {
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f4f4] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลดข้อมูลระบบ...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f4f4f4] overflow-auto">
      {/* ส่วนวันที่ปัจจุบัน */}
      <p className="text-sm text-gray-600 mb-6">
        การขายและสินค้าคงคลัง – วันนี้ {today}
      </p>

      {/* บัตรข้อมูลสรุป (Summary Cards) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* ยอดขายรวมวันนี้ */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-amber-500 mb-1">
            ฿ {Number(summaryData.totalSales).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500">ยอดขายสินค้าวันนี้</p>
        </div>

        {/* จำนวนสินค้าคงคลังทั้งหมด */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {summaryData.totalStock.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">สินค้าคงคลังทั้งหมด</p>
        </div>

        {/* จำนวนรายการที่สต็อกต่ำกว่าเกณฑ์ */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-red-500 mb-1">{summaryData.lowStock}</p>
          <p className="text-sm text-gray-500">รายการที่ต้องสั่งเพิ่ม</p>
        </div>
      </div>

      {/* ส่วนแสดงรายการล่าสุด */}
      <div className="grid grid-cols-2 gap-4">
        {/* รายการขายล่าสุดจากฐานข้อมูล */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-700">รายการขายล่าสุด</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-100">
                <th className="text-left pb-2 font-medium">รหัสรายการ</th>
                <th className="text-left pb-2 font-medium">เวลา</th>
                <th className="text-left pb-2 font-medium">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length > 0 ? (
                recentSales.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 text-gray-600 hover:bg-gray-50">
                    <td className="py-2.5 text-xs">#{item.id}</td>
                    <td className="py-2.5 text-xs">
                      {new Date(item.created_at).toLocaleTimeString("th-TH")}
                    </td>
                    <td className="py-2.5 text-xs font-bold text-gray-800">
                      ฿{Number(item.total_price || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-400 text-xs">
                    ไม่มีรายการขายในวันนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* รายชื่อสินค้าที่สต็อกต่ำกว่ากำหนด */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">สินค้าใกล้หมด</h3>
            </div>
            <button
              onClick={() => navigate("/inventory")}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition"
            >
              ดูทั้งหมด
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 text-xs text-gray-400 border-b border-gray-100 pb-2 mb-1">
            <span>รายการสินค้า</span>
            <span className="text-right">เหลือ</span>
          </div>

          {lowStockItems.length > 0 ? (
            lowStockItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.name}</p>
                    <p className="text-[10px] text-amber-500">#{item.product_code || item.id}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-500">{item.stock}</span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-400 text-xs">
              สต็อกสินค้าเพียงพอ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}