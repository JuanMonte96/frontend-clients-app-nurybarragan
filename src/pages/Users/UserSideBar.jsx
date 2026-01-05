import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from '../../assets/logo_menu_nury_barragan.png';

const menuItems = [
  { label: "PERFIL", path: "/user/profile", icon: "👤" },
  { label: "CLASES", path: "/user/classes", icon: "🕺" },
  { label: "MIS INCRIPCIONES", path:"/user/my-enrollments", icon : "📚" },
];

export const UserSideBar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 m-3 shadow-md text-[var(--color-text)] rounded-lg hover:bg-[var(--color-header)] focus:outline-none"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[var(--color-header)] border-r border-[var(--color-primary)] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="pb-2 pl-0 pr-0 pt-2 border-b border-[var(--color-primary)]">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>

        <ul className="py-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2 t font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-header)] rounded-2xl transition ${
                    isActive ? "bg-[var(--color-header)] font-semibold" : ""
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
