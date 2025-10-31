import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, User, Settings } from "lucide-react";

export const HeaderUser = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userName = profile?.user?.name_user || "Usuario";
  const userEmail = profile?.user?.email_user || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-20 bg-[var(--color-header)] text-[var(--color-text-secondary)] shadow-md flex items-center justify-between px-6 relative z-50 sticky top-0">
      {/* Título */}
      <h1 className="text-lg font-bold tracking-wide text-[var(--color-text-secondary)]">
        PANEL DE USUARIO
      </h1>

      {/* Perfil del usuario */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-3 bg-[var(--color-bg)] hover:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-primary)] rounded-full px-3 py-1 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-header)] font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-semibold text-[var(--color-text)]">
            {userName}
          </span>
        </button>

        {/* Menú desplegable */}
        {menuOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-[var(--color-bg)] border border-[var(--color-primary)] rounded-lg shadow-lg p-2">
            <p className="text-sm text-[var(--color-text)] px-3 py-2 border-b border-[var(--color-primary)]">
              {userEmail}
            </p>
            <button
              onClick={() => navigate("/user/profile")}
              className="w-full flex items-center gap-2 text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] px-3 py-2 rounded-md text-sm transition"
            >
              <User size={16} />
              Mi perfil
            </button>
            <button
              onClick={() => navigate("/changePassword")}
              className="w-full flex items-center gap-2 text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] px-3 py-2 rounded-md text-sm transition"
            >
              <Settings size={16} />
              Cambiar contraseña
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm transition"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
