// src/user/UserSidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Inicio", path: "/", icon: "🏠" },
  { label: "Perfil", path: "/app/profile", icon: "👤" },
  { label: "Mis Clases", path: "/app/classes", icon: "🕺" },
];

export const UserSideBar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 m-3 text-gray-500 rounded-lg hover:bg-gray-200 focus:outline-none"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Panel de Usuario
          </h2>
        </div>

        <ul className="py-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition ${
                    isActive ? "bg-gray-100 dark:bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
