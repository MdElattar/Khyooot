import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, setToken, token, navigate } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // حالة إظهار/إخفاء الباسورد الجديد
  const [loading, setLoading] = useState(false);

  // عداد تنازلي لمدة 60 ثانية للـ OTP
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer;
    if (currentState === "Reset Password" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentState, timeLeft]);

  // تنسيق الوقت (دقائق:ثواني)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // دالة إعادة إرسال الكود
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/send-reset-otp',
        { email }
      );
      if (response.data.success) {
        toast.success("New OTP code sent to your email!");
        setTimeLeft(60); // إعادة ضبط العداد لـ 60 ثانية
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(
          backendUrl + '/api/user/register',
          { name, email, password }
        );

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message);
        }

      } else if (currentState === 'Login') {
        const response = await axios.post(
          backendUrl + '/api/user/login',
          { email, password }
        );
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Welcome back to KHYOOT!");
        } else {
          toast.error(response.data.message);
        }

      } else if (currentState === 'Forgot Password') {
        const response = await axios.post(
          backendUrl + '/api/user/send-reset-otp',
          { email }
        );
        if (response.data.success) {
          toast.success("OTP sent to your email!");
          setTimeLeft(60); // تعيين العداد لـ 60 ثانية
          setCurrentState("Reset Password");
        } else {
          toast.error(response.data.message);
        }

      } else if (currentState === 'Reset Password') {
        const response = await axios.post(
          backendUrl + '/api/user/reset-password',
          { email, otp, newPassword }
        );
        if (response.data.success) {
          toast.success("Password reset successfully! Please Login.");
          setCurrentState("Login");
          setPassword("");
          setOtp("");
          setNewPassword("");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 mt-16 py-12">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white border border-gray-100 shadow-2xl shadow-black/5 rounded-3xl px-8 py-10 flex flex-col gap-5 transition-all duration-300"
      >
        {/* Title & Brand Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-gray-900 mb-1">
            {currentState === "Login" && "Welcome Back"}
            {currentState === "Sign Up" && "Create Account"}
            {currentState === "Forgot Password" && "Reset Password"}
            {currentState === "Reset Password" && "Enter OTP Code"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-medium">
            {currentState === "Login" && "Sign in to access your orders"}
            {currentState === "Sign Up" && "Join KHYOOT luxury community"}
            {currentState === "Forgot Password" && "Enter your email to receive OTP code"}
            {currentState === "Reset Password" && "Enter the OTP code and new password"}
          </p>
          <div className="w-12 h-[2px] bg-gray-900 mx-auto mt-3" />
        </div>

        {/* Name (Sign Up only) */}
        {currentState === "Sign Up" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm"
              required
            />
          </div>
        )}

        {/* Email Address */}
        {currentState !== "Reset Password" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm"
              required
            />
          </div>
        )}

        {/* Password Input (Login & Sign Up) */}
        {(currentState === "Login" || currentState === "Sign Up") && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-750 transition-colors text-xs font-medium uppercase"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Reset Password Inputs (OTP & New Password) */}
        {currentState === "Reset Password" && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">6-Digit OTP Code</label>
                <span className={`text-xs font-bold ${timeLeft > 0 ? "text-amber-600" : "text-red-500"}`}>
                  Expires in: {formatTime(timeLeft)}
                </span>
              </div>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white text-center text-lg tracking-widest font-bold"
                required
              />
              
              {/* زر إعادة الإرسال (يظهر فقط عند انتهاء الـ 60 ثانية) */}
              {timeLeft === 0 && (
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs font-bold text-[#003459] hover:underline"
                  >
                    Resend OTP Code
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:bg-white transition-all text-sm pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-750 transition-colors text-xs font-medium uppercase"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Login helpers & Switchers */}
        <div className="flex items-center justify-between text-sm mt-1">
          {currentState === "Login" && (
            <span
              onClick={() => setCurrentState("Forgot Password")}
              className="cursor-pointer text-gray-500 hover:text-black transition-colors"
            >
              Forgot your password?
            </span>
          )}

          {(currentState === "Forgot Password" || currentState === "Reset Password") && (
            <span
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer text-gray-500 hover:text-black transition-colors"
            >
              Back to Login
            </span>
          )}

          {currentState !== "Forgot Password" && currentState !== "Reset Password" && (
            <p
              onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
              className="cursor-pointer text-gray-900 font-semibold hover:underline"
            >
              {currentState === "Login" ? "Create account" : "Login here"}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || (currentState === "Reset Password" && timeLeft === 0)}
          className="mt-4 bg-[#003459] hover:bg-black text-white py-3.5 rounded-xl font-semibold tracking-wide uppercase text-xs transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {currentState === "Login" && "Sign In"}
              {currentState === "Sign Up" && "Sign Up"}
              {currentState === "Forgot Password" && "Send OTP"}
              {currentState === "Reset Password" && (timeLeft === 0 ? "OTP Expired" : "Reset Password")}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;