import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// นำเข้า AuthProvider เพื่อใช้จัดการสถานะการล็อกอินทั่วทั้งแอป
import { AuthProvider } from './context/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* หุ้ม App ด้วย AuthProvider เพื่อให้ทุกหน้าดึงข้อมูล User และ Token ได้ */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();