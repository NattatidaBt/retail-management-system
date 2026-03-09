import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useMatch, useNavigate, Navigate } from 'react-router-dom';
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

// --- ส่วนที่เพิ่มใหม่: Component สำหรับป้องกัน Route ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function Layout({ cart, setCart }) {
  const location = useLocation();
  const matchProductDetail = useMatch('/products/:id');
  const navigate = useNavigate();

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

  // ดึงข้อมูลผู้ใช้จริงจาก LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const cartQty = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={user.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          pageTitle={pageTitle}
          userName={user.name || 'Guest'}
          userRole={user.role || 'User'}
          cartQty={cartQty}
          onCartClick={() => navigate('/confirm-payment')}
        />
        <main className="flex-1 overflow-y-auto bg-gray-100 h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/pos" element={<SalesPoint cart={cart} setCart={setCart} />} />
            <Route
              path="/confirm-payment"
              element={<Payment cart={cart} setCart={setCart} onConfirm={(t) => { alert(`สำเร็จ! ${t}`); setCart([]); }} />}
            />
            <Route path="/history" element={<History />} />
            
            {/* ป้องกันเฉพาะหน้าที่ต้องเป็น Admin เท่านั้น */}
            <Route 
              path="/product-manage" 
              element={<ProtectedRoute allowedRoles={['admin']}><ManageProduct /></ProtectedRoute>} 
            />
            <Route 
              path="/inventory" 
              element={<ProtectedRoute allowedRoles={['admin']}><Inventory /></ProtectedRoute>} 
            />
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
        
        {/* หุ้ม Layout ทั้งหมดด้วย ProtectedRoute เพื่อเช็ค Token ก่อนเข้าถึงหน้าบ้าน */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout cart={cart} setCart={setCart} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;