import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Mock data — เปลี่ยนเป็น API จริงทีหลัง
    // fetch("/api/dashboard").then(res => res.json()).then(data => { ... })

    setSummaryData({
      totalSales: "48,500",
      totalStock: 1050,
      lowStock: 15,
    });

    setRecentSales([
      { id: "I102", name: "นมจืด", qty: "32 ขวด", total: "320.00" },
      { id: "I102", name: "ทิชชู", qty: "18 ถุง", total: "480.00" },
      { id: "I102", name: "ทิชชู", qty: "5 แพ็ค", total: "150.00" },
      { id: "I102", name: "ทิชชู", qty: "42", total: "568.00" },
    ]);

    setLowStockItems([
      { id: "I102", name: "นมจืด", qty: "32 ขวด" },
      { id: "I103", name: "น้ำดื่ม", qty: "10 ขวด" },
      { id: "I104", name: "ขนมปัง", qty: "5 ชิ้น" },
      { id: "I105", name: "นมถั่วเหลือง", qty: "8 ขวด" },
      { id: "I106", name: "โยเกิร์ต", qty: "6 ถ้วย" },
    ]);

    setLoading(false);
  }, []);

  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric", month: "long", year: "numeric"
  });

  if (loading) {
    return (
      <div className="p-6 bg-[#f4f4f4] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f4f4f4] overflow-auto">

      {/* วันที่ */}
      <p className="text-sm text-gray-600 mb-6">
        การขายและสินค้าคงคลัง – วันนี้ {today}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* ยอดขายสินค้า */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-amber-500 mb-1">฿ {summaryData.totalSales}</p>
          <p className="text-sm text-gray-500">ยอดขายสินค้า</p>
        </div>

        {/* สินค้าคงคลัง */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{summaryData.totalStock}</p>
          <p className="text-sm text-gray-500">สินค้าคงคลัง</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-3">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-red-500 mb-1">{summaryData.lowStock}</p>
          <p className="text-sm text-gray-500">Low Stock</p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">

        {/* รายการขายล่าสุด */}
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
                <th className="text-left pb-2 font-medium">รหัสสินค้า</th>
                <th className="text-left pb-2 font-medium">รายการ</th>
                <th className="text-left pb-2 font-medium">จำนวน</th>
                <th className="text-left pb-2 font-medium">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 text-gray-600">
                  <td className="py-2.5 text-xs">{item.id}</td>
                  <td className="py-2.5 text-xs">{item.name}</td>
                  <td className="py-2.5 text-xs">{item.qty}</td>
                  <td className="py-2.5 text-xs">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock List */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">Low Stock</h3>
            </div>
            <button 
               onClick={() => navigate("/inventory")} 
               className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500">
              See all
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Header */}
          <div className="grid grid-cols-2 text-xs text-gray-400 border-b border-gray-100 pb-2 mb-1">
            <span>รายการ</span>
            <span className="text-right">จำนวนสินค้าคงคลัง</span>
          </div>

          {/* Items */}
          {lowStockItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">{item.name}</p>
                  <p className="text-xs text-amber-500">{item.id}</p>
                </div>
              </div>
              <span className="text-xs text-gray-600">{item.qty}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}