import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sideBar";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "L.E";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token")?localStorage.getItem('token'):'');

  useEffect(() => {
      localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Toast Container الفاخر */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        toastClassName="custom-luxury-toast"
        style={{ zIndex: 99999, top: '24px' }}
      />

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar setToken={setToken} />
          <div className="flex flex-1 w-full">
            <Sidebar />
            <div className="flex-1 min-h-[calc(100vh-70px)] overflow-y-auto bg-white">
              <Routes>
                <Route path="/" element={<Navigate to="/add" />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="*" element={<Navigate to="/add" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;