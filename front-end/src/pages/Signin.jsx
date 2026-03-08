import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import shopImage from "../assets/shope.png";
import bgLeft from "../assets/signin.png";

export default function SignIn() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Sign in:", form);
        navigate("/dashboard");
    };

    return (
        <div
            className="relative flex min-h-screen overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #7a5c2e 0%, #c8973a 30%, #e8c97a 60%, #f5e6c8 100%)",
            }}
        >
            {/* ===== วงกลมขาวลายผ้า ===== */}
            <div
                className="absolute rounded-full"
                style={{
                    width: "90vw",
                    height: "90vw",
                    maxWidth: "750px",
                    maxHeight: "750px",
                    top: "50%",
                    left: "-20%",
                    transform: "translateY(-50%)",
                    backgroundImage: `url(${bgLeft})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                }}
            />

            {/* ===== ภาพร้านค้า + เงา ===== */}
            <div
                className="absolute z-10 flex flex-col items-center"
                style={{ bottom: "8%", left: "10%" }}
            >
                <img
                    src={shopImage}
                    alt="shop"
                    className="object-contain"
                    style={{ width: "530px" }}
                />
                <div className="w-72 h-4 bg-black opacity-30 rounded-full blur-md -mt-1" />
            </div>

            {/* ===== Card กลาง-ขวา ===== */}
            <div className="flex flex-1 items-center justify-end pr-72 relative z-10">
                <div className="relative" style={{ paddingTop: "12px" }}>

                    {/* กรอบเหลืองยื่นขึ้นบน */}
                    <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            backgroundColor: "#d4900a",
                            transform: "translateY(-12px)",
                            zIndex: 0,
                            borderRadius: "24px",
                        }}
                    />

                    {/* Card ขาว */}
                    <div
                        className="relative bg-white rounded-3xl w-96 pt-20 pb-10 px-10"
                        style={{ zIndex: 1 }}
                    >
                        {/* โลโก้ลอยบน */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                            <div
                                className="bg-white rounded-2xl shadow-lg flex items-center justify-center px-4 py-3"
                                style={{ minWidth: "100px" }}
                            >
                                <img src={logo} alt="logo" className="h-14 object-contain" />
                            </div>
                        </div>

                        {/* หัวข้อ */}
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 leading-snug">
                                Welcome<br />to Retail Manager
                            </h2>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">

                            {/* Email */}
                            <div className="flex items-center bg-gray-50 border border-amber-300 rounded-lg px-4 py-3 gap-3">
                                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex items-center bg-gray-50 border border-amber-300 rounded-lg px-4 py-3 gap-3">
                                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-base"
                            >
                                Login
                            </button>
                        </div>

                        {/* Sign up link */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            don't have an account?{" "}
                            <span
                                onClick={() => navigate("/signup")}
                                className="text-amber-500 font-semibold hover:underline cursor-pointer"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}