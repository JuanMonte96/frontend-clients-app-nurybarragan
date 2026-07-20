import { NavLink } from "react-router-dom";
import { Users, ClipboardCheck } from "lucide-react";
import logo from "../../assets/final-logo-nb.webp";

export const AdminSideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { label: "USUARIOS", path: "/admin/users", icon: <Users size={20} /> },
    { label: "ASISTENCIAS", path: "/admin/attendance", icon: <ClipboardCheck size={20} /> },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="sm:hidden fixed top-16 left-0 right-0 bottom-0 backdrop-blur-md z-30"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-56 bg-[var(--color-header)] border-r border-[var(--color-primary)] transform transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:sticky sm:top-0 sm:translate-x-0 sm:h-screen sm:z-auto flex flex-col`}
      >
        <div className="pb-3 sm:pb-2 pt-2 border-b border-[var(--color-primary)] px-2">
          <img src={logo} alt="Logo" className="h-12 sm:h-16 md:h-20 lg:h-28 w-auto object-contain max-w-[320px]" />
        </div>

        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white font-semibold"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:bg-opacity-20 font-medium"
                    }`
                  }
                >
                  <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="h-4 sm:hidden" />
      </aside>
    </>
  );
};
