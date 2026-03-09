import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // นำเข้า useAuth เพื่อเช็คสิทธิ์ผู้ใช้
import logo from '../assets/logo.png';

const menuItems = [
    {
        path: '/dashboard',
        label: 'แดชบอร์ด',
        roles: ['admin', 'staff'], // กำหนดสิทธิ์ที่เข้าถึงได้
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="13" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
            </svg>
        ),
    },
    {
        path: '/products',
        label: 'รายการสินค้า',
        roles: ['admin', 'staff'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
            </svg>
        ),
    },
    {
        path: '/product-manage',
        label: 'จัดการข้อมูลสินค้า',
        roles: ['admin'], // เฉพาะ Admin เท่านั้น
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
    },
    {
        path: '/pos',
        label: 'หน้าขายสินค้า',
        roles: ['admin', 'staff'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        path: '/history',
        label: 'ประวัติการขาย',
        roles: ['admin', 'staff'],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        path: '/inventory',
        label: 'จัดการสต็อกสินค้า',
        roles: ['admin'], // เฉพาะ Admin เท่านั้น
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth(); // ดึงข้อมูลผู้ใช้และฟังก์ชัน logout จาก Context
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout(); // เรียกใช้ฟังก์ชัน logout ที่ล้างค่าใน localStorage
        navigate('/signin');
    };

    return (
        <aside
            className="w-[220px] min-h-screen flex flex-col shadow-lg"
            style={{ background: 'linear-gradient(175deg, #F5A623 0%, #E09418 100%)' }}
        >

            {/* โลโก้ */}
            <div className="flex items-center justify-center py-6 px-4 border-b border-white/25 mb-2">
                <img src={logo} alt="EZ Central Retail" className="w-32 object-contain" />
            </div>

            {/* เมนูที่กรองตามบทบาท (Role-based Navigation) */}
            <nav className="flex flex-col gap-0.5 px-2 pt-2">
                {menuItems
                    .filter((item) => item.roles.includes(user?.role)) // แสดงเฉพาะเมนูที่ Role ของผู้ใช้มีสิทธิ์
                    .map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`
                                    flex items-center gap-3 px-4 py-[11px] rounded-xl
                                    w-full text-left text-[13.5px] font-semibold
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-white text-amber-700 shadow-md'
                                        : 'text-amber-950/80 hover:bg-white/30 hover:text-amber-950'
                                    }
                                `}
                            >
                                <span className={`flex-shrink-0 ${isActive ? 'text-amber-700' : 'text-amber-950/70'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
            </nav>

            <div className="flex-1" />

            {/* ข้อมูลผู้ใช้เบื้องต้น (แสดงชื่อและบทบาท) */}
            <div className="px-4 py-2 text-center">
                <p className="text-[11px] font-bold text-amber-950/60 uppercase tracking-wider">
                    เข้าใช้งานในฐานะ: {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
                </p>
            </div>

            {/* ปุ่มออกจากระบบ */}
            <div className="px-2 pb-5 pt-3 border-t border-white/25">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-3 px-4 py-[11px] rounded-xl
                               w-full text-left text-[13.5px] font-semibold
                               text-black hover:bg-white/20 transition-all duration-200"
                >
                    <span className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-800 text-white">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="18"
                            height="18"
                        >
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </span>
                    <span>ออกจากระบบ</span>
                </button>
            </div>

            {/* Modal ยืนยันการออกจากระบบ */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-72 shadow-xl text-center">
                        <p className="text-base font-bold text-gray-700 mb-2">ออกจากระบบ</p>
                        <p className="text-sm text-gray-400 mb-6">คุณต้องการออกจากระบบใช่หรือไม่?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold">
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;