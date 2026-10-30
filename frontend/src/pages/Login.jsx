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
  
  // حالة التحكم في إظهار أو إخفاء الباسورد
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
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

      } else {
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
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
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
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-medium">
            {currentState === "Login" ? "Sign in to access your orders" : "Join KHYOOT luxury community"}
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

        {/* Email */}
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

        {/* Password with Show/Hide Toggle */}
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
            {/* Toggle Button to see password */}
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

        {/* Login helpers (Forgot password & Switch state) */}
        <div className="flex items-center justify-between text-sm mt-1">
          {currentState === "Login" ? (
            <span className="cursor-pointer text-gray-500 hover:text-black transition-colors">
              Forgot your password?
            </span>
          ) : <span />}

          <p
            onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
            className="cursor-pointer text-gray-900 font-semibold hover:underline"
          >
            {currentState === "Login" ? "Create account" : "Login here"}
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="mt-4 bg-[#003459] hover:bg-black text-white py-3.5 rounded-xl font-semibold tracking-wide uppercase text-xs transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;