import React from 'react';

export default function Navbar({ pageTitle = "แดชบอร์ด", userName = "Angkhanawan", userRole = "Admin", cartQty = 0, onCartClick }) {
  const dateStr = new Date().toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <nav className="flex items-center justify-between px-6 h-14 bg-yellow-50 border-b border-yellow-200">
      <span className="font-bold text-gray-800 text-sm">{pageTitle}</span>
      <div className="flex items-center gap-2">
        {/* วันที่ */}
        <div className="flex items-center gap-2 rounded-md px-3 py-1.5 border border-yellow-300 bg-gray-50 text-sm text-gray-700">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateStr}</span>
        </div>
        <div className="w-px h-7 bg-gray-300 mx-1" />

        {/* ตะกร้า */}
        <div
          className="relative flex items-center justify-center w-9 h-9 cursor-pointer hover:bg-amber-100 rounded-full transition"
          onClick={onCartClick}
          title="ไปที่ตะกร้าสินค้า"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartQty > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-white text-xs font-bold bg-amber-400 rounded-full">
              {cartQty}
            </span>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 border border-gray-200">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-gray-800 mb-0.5">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}