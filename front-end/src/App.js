import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useMatch, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import SignUp from './pages/SignUp';
import SignIn from './pages/Signin';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ManageProduct from './pages/Manageproduct';
import SalesPoint from './pages/Salespoint';
import Payment from './pages/Payment';
import History from './pages/History';
import Inventory from './pages/inventory';

function Layout({ cart, setCart }) {
  const location = useLocation();
  const matchProductDetail = useMatch('/products/:id');
  const navigate = useNavigate(); // ✅ เพิ่ม

  const pageTitles = {
    '/dashboard': 'แดชบอร์ด',
    '/products': 'รายการสินค้า',
    '/product-detail': 'รายละเอียดสินค้า',
    '/product-manage': 'จัดการข้อมูลสินค้า',
    '/pos': 'หน้าขายสินค้า',
    '/confirm-payment': 'ยืนยันการชำระเงิน',
    '/history': 'ประวัติการขาย',
    '/inventory': 'จัดการสต็อกสินค้า',
  };

  const pageTitle = matchProductDetail
    ? 'รายละเอียดสินค้า'
    : pageTitles[location.pathname] || 'แดชบอร์ด';

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cartQty = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          pageTitle={pageTitle}
          userName={user.name || 'Angkhanawan'}
          userRole={user.role || 'Admin'}
          cartQty={cartQty}
          onCartClick={() => navigate('/confirm-payment')} // ✅ เพิ่ม: ไปที่หน้าชำระเงินเมื่อคลิกตะกร้า
        />
        <main className="flex-1 overflow-y-auto bg-gray-100 h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/product-manage" element={<ManageProduct />} />
            <Route path="/pos" element={<SalesPoint cart={cart} setCart={setCart} />} />
            <Route
              path="/confirm-payment"
              element={
                <Payment
                  cart={cart}
                  setCart={setCart}
                  onConfirm={(total) => {
                    alert(`✅ ชำระเงินสำเร็จ! รวม ${total.toFixed(2)} บาท`);
                    setCart([]);
                  }}
                />
              }
            />
            <Route path="/history" element={<History />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/*" element={<Layout cart={cart} setCart={setCart} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;