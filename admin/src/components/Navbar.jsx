import { assets } from "../assets/admin_assets/assets";

const Navbar = ({ setToken, setVisible }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-xl flex items-center justify-between px-6 sm:px-10 z-40 transition-all duration-300">
      
      {/* Left Section: Menu (Mobile) & Brand Title */}
      <div className="flex items-center gap-4">
        {setVisible && (
          <img
            onClick={() => setVisible(true)}
            src={assets.menu}
            className="w-6 h-6 cursor-pointer lg:hidden filter invert opacity-80 hover:opacity-100 transition-opacity"
            alt="Menu"
          />
        )}
        
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase font-serif">
            KHYOOT
          </h1>
          <span className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold -mt-1">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Right Section: Actions & Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setToken("")}
          className="px-5 py-2.5 rounded-full bg-white text-gray-950 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.02] flex items-center gap-2"
        >
          <span>Logout</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

    </header>
  );
};

export default Navbar;