import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Welcome back, Admin!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/[0.04] p-8 sm:p-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-950 tracking-wider uppercase">
            KHYOOT
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">
            Admin Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@khyoot.com"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all outline-none focus:border-gray-900 focus:bg-white shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm transition-all outline-none focus:border-gray-900 focus:bg-white shadow-sm"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mt-2 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gray-950 text-white hover:bg-black shadow-black/15 hover:scale-[1.01]"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 font-medium tracking-wider uppercase mt-8">
          © {new Date().getFullYear()} KHYOOT. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;