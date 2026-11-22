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

// Client-side guard only: the server is the authority for admin authorization.
// This prevents an arbitrary localStorage string from unlocking the admin UI.
const readStoredAdminToken = () => {
  const stored = localStorage.getItem("token");
  if (!stored) return "";
  try {
    let encoded = stored.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) encoded += "=";
    const payload = JSON.parse(atob(encoded));
    if (payload.role !== "admin" || (payload.exp && payload.exp * 1000 <= Date.now())) {
      localStorage.removeItem("token");
      return "";
    }
    return stored;
  } catch {
    localStorage.removeItem("token");
    return "";
  }
};

const App = () => {
  const [token, setToken] = useState(readStoredAdminToken);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
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