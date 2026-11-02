import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

const SideBar = () => {
  return (
    <aside className="h-screen bg-white border-r border-gray-100
      w-[70px] md:w-[260px] transition-all duration-300 shadow-xs">
      
      <div className="flex flex-col gap-2 pt-10 px-3 md:px-5 text-[14px] mt-20">

        {/* Add Items */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
            ${
              isActive
                ? "bg-gray-950 text-white shadow-md shadow-black/10 font-semibold"
                : "hover:bg-gray-100 text-gray-600 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={assets.add_icon}
                className={`w-3 h-3 mx-auto md:mx-0 transition group-hover:scale-110 ${
                  isActive ? "filter invert" : ""
                }`}
                alt=""
              />
              <span className="hidden md:block tracking-wide uppercase text-xs">
                Add Items
              </span>
            </>
          )}
        </NavLink>

        {/* List Items */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
            ${
              isActive
                ? "bg-gray-950 text-white shadow-md shadow-black/10 font-semibold"
                : "hover:bg-gray-100 text-gray-600 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={assets.order_icon}
                className={`w-5 h-5 mx-auto md:mx-0 transition group-hover:scale-110 ${
                  isActive ? "filter invert" : ""
                }`}
                alt=""
              />
              <span className="hidden md:block tracking-wide uppercase text-xs">
                List Items
              </span>
            </>
          )}
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
            ${
              isActive
                ? "bg-gray-950 text-white shadow-md shadow-black/10 font-semibold"
                : "hover:bg-gray-100 text-gray-600 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={assets.order_icon}
                className={`w-5 h-5 mx-auto md:mx-0 transition group-hover:scale-110 ${
                  isActive ? "filter invert" : ""
                }`}
                alt=""
              />
              <span className="hidden md:block tracking-wide uppercase text-xs">
                Orders
              </span>
            </>
          )}
        </NavLink>

      </div>
    </aside>
  );
};

export default SideBar;