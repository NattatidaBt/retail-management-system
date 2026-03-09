import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import bgImage from "../assets/backsign.jpg";
import { register } from "../services/api"; // นำเข้าฟังก์ชัน register จาก api service

export default function SignUp() {
    const navigate = useNavigate();
    // เพิ่มฟิลด์ role ในโครงสร้างข้อมูลเริ่มต้น (กำหนด default เป็น staff)
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); // สำหรับแสดงข้อความผิดพลาด
    const [loading, setLoading] = useState(false); // สำหรับแสดงสถานะการโหลด

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าจอ
        setLoading(true);
        setError("");

        try {
            // เรียกใช้ API Register ไปที่ Port 5000 พร้อมส่งค่า role ไปยังฐานข้อมูล
            const data = await register(form);
            
            console.log("Registration successful:", data);
            alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
            
            // เมื่อสมัครสมาชิกสำเร็จ นำทางไปหน้า Sign In เพื่อให้ผู้ใช้ล็อกอิน
            navigate("/signin");
        } catch (err) {
            // จัดการกรณีเกิดข้อผิดพลาด เช่น Email ซ้ำ หรือชื่อซ้ำในระบบ
            const errorMsg = err.response?.data?.message || "การลงทะเบียนล้มเหลว กรุณาลองใหม่";
            setError(errorMsg);
            console.error("Sign up error:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-sans">

            {/* ฝั่งซ้าย */}
            <div
                className="hidden md:flex w-5/12 flex-col justify-center px-14 relative overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Decorative wave */}
                <svg
                    className="absolute bottom-0 left-0 w-full opacity-25 pointer-events-none"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="none"
                >
                    <path d="M0,200 Q80,120 160,180 T320,160 T400,180 L400,300 L0,300 Z" fill="white" />
                    <path d="M0,240 Q100,170 200,220 T400,210 L400,300 L0,300 Z" fill="white" opacity="0.6" />
                </svg>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-gray-800 leading-snug mb-4">
                        Welcome<br />to Retail Manager
                    </h1>
                    <p className="text-gray-700 text-sm leading-relaxed mb-10">
                        ระบบบริหารจัดการร้านค้าปลีก สำหรับ<br />
                        จัดการสินค้า การขาย และสต็อกในที่เดียว
                    </p>

                    <button
                        onClick={() => navigate("/signin")}
                        className="flex items-center gap-3 border-2 border-gray-700 rounded-full px-6 py-2.5 text-gray-800 font-semibold text-sm hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                        Get Start
                        <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-current">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* ฝั่งขวา */}
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-8">

                {/* โลโก้ */}
                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="logo" className="h-24 object-contain" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm">

                    {/* แสดง Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg mb-4 text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="flex items-center border border-amber-400 rounded-lg px-3 py-2.5 mb-4 gap-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center border border-amber-400 rounded-lg px-3 py-2.5 mb-4 gap-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center border border-amber-400 rounded-lg px-3 py-2.5 mb-4 gap-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Role Selection (เพิ่มส่วนนี้เข้าไปเพื่อระบุฐานะที่สมัคร) */}
                    <div className="flex items-center border border-amber-400 rounded-lg px-3 py-2.5 mb-6 gap-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="flex-1 outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
                        >
                            <option value="staff">พนักงาน (Staff)</option>
                            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                        </select>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? "bg-gray-400" : "bg-amber-400 hover:bg-amber-500"} text-white font-bold py-2.5 rounded-lg transition-colors duration-200 text-sm tracking-wide`}
                    >
                        {loading ? "Registering..." : "Sign up"}
                    </button>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have account?{" "}
                        <span
                            onClick={() => navigate("/signin")}
                            className="text-amber-500 font-semibold hover:underline cursor-pointer"
                        >
                            Sign in
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
}