import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  
  const { getCartCount, token, setToken, setCartItems, navigate } =
    useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "auto";
  }, [visible]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#003459]/95 backdrop-blur-md shadow-xl z-40 transition-all duration-300 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Icon */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setVisible(true)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Open Menu"
              >
                <img src={assets.menu} className="w-7 h-7 brightness-0 invert" alt="Menu" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink
                to="/"
                className="text-3xl sm:text-4xl font-black tracking-widest text-white hover:opacity-90 transition-opacity"
                style={{ fontFamily: "sans-serif" }}
              >
                KHYOOT
              </NavLink>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-10">
              <ul className="flex items-center gap-8 text-base font-semibold tracking-wide">
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `relative py-2 text-white transition-colors duration-200 hover:text-gray-200 group ${isActive ? "text-white font-bold" : "text-white/80"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>HOME</span>
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/collection"
                  className={({ isActive }) => 
                    `relative py-2 text-white transition-colors duration-200 hover:text-gray-200 group ${isActive ? "text-white font-bold" : "text-white/80"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>COLLECTION</span>
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) => 
                    `relative py-2 text-white transition-colors duration-200 hover:text-gray-200 group ${isActive ? "text-white font-bold" : "text-white/80"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>ABOUT</span>
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/contactus"
                  className={({ isActive }) => 
                    `relative py-2 text-white transition-colors duration-200 hover:text-gray-200 group ${isActive ? "text-white font-bold" : "text-white/80"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>CONTACT US</span>
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </>
                  )}
                </NavLink>
              </ul>
            </nav>

            {/* Right Icons (Profile & Cart) */}
            <div className="flex items-center space-x-5 sm:space-x-6">
              
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => (token ? null : navigate("/login"))}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none flex items-center"
                  aria-label="User Profile"
                >
                  <img src={assets.user} className="w-7 h-7 brightness-0 invert cursor-pointer" alt="User" />
                </button>
                
                {token && (
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="flex flex-col bg-white text-gray-900 rounded-xl shadow-2xl py-2 px-1 border border-gray-100 overflow-hidden">
                      <p className="cursor-pointer px-4 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors">
                        My Profile
                      </p>
                      <p
                        onClick={() => navigate("/orders")}
                        className="cursor-pointer px-4 py-2.5 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Orders
                      </p>
                      <div className="h-[1px] bg-gray-100 my-1" />
                      <p
                        onClick={logout}
                        className="cursor-pointer px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Icon */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors flex items-center">
                <img src={assets.bag} className="w-7 h-7 brightness-0 invert" alt="Cart" />
                {getCartCount() > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-white text-[#003459] text-[11px] font-black rounded-full shadow-md animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu (Moved OUTSIDE header to fix full-height layout) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setVisible(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-[#003459] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            visible ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header of Sidebar */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <h3 className="text-2xl font-black tracking-widest text-white">KHYOOT</h3>
            <button
              onClick={() => setVisible(false)}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links inside Sidebar */}
          <div className="flex flex-col py-6 px-4 space-y-2 flex-1 overflow-y-auto">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className={({ isActive }) => 
                `py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all ${
                  isActive ? "bg-white text-[#003459] shadow-md" : "text-white/90 hover:bg-white/10"
                }`
              }
            >
              HOME
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className={({ isActive }) => 
                `py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all ${
                  isActive ? "bg-white text-[#003459] shadow-md" : "text-white/90 hover:bg-white/10"
                }`
              }
            >
              COLLECTION
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className={({ isActive }) => 
                `py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all ${
                  isActive ? "bg-white text-[#003459] shadow-md" : "text-white/90 hover:bg-white/10"
                }`
              }
            >
              ABOUT
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
              to="/contactus"
              className={({ isActive }) => 
                `py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all ${
                  isActive ? "bg-white text-[#003459] shadow-md" : "text-white/90 hover:bg-white/10"
                }`
              }
            >
              CONTACT US
            </NavLink>
          </div>

          {/* Footer info inside mobile menu */}
          <div className="p-6 border-t border-white/10 text-center text-xs text-white/60">
            © 2026 KHYOOT. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;