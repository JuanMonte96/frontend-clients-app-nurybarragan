import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, User, Settings, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export const HeaderUser = ({ sidebarOpen, setSidebarOpen }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const userName = profile?.user?.name_user || "Usuario";
  const userEmail = profile?.user?.email_user || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="min-h-16 sm:h-20 bg-[var(--color-header)] text-[var(--color-text-secondary)] shadow-md flex items-center justify-between px-3 sm:px-6 relative z-20 sticky top-0">
      {/* Botón Sidebar - Solo visible en móvil */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden flex-shrink-0 p-2 text-[var(--color-primary)] hover:bg-[var(--color-bg)] rounded-lg transition"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Título - Centered/End en mobile, end en desktop */}
      <h1 className="flex-1 text-center sm:text-right text-sm sm:text-base md:text-lg font-bold tracking-wide text-[var(--color-text-secondary)]">
        {t('userPanel.title')}
      </h1>

      {/* Selector de idiomas - Solo en desktop */}
      <div className="hidden sm:block ml-3 sm:ml-4">
        <LanguageSwitcher />
      </div>

      {/* Perfil del usuario */}
      <div className="relative ml-3 sm:ml-4">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-3 bg-[var(--color-bg)] hover:bg-[var(--color-bg-secondary)] transition-all duration-200 border border-[var(--color-primary)] rounded-full px-2 sm:px-3 py-1 shadow-sm flex-shrink-0"
        >
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-header)] font-bold text-xs sm:text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-xs sm:text-sm font-semibold text-[var(--color-text)] line-clamp-1">
            {userName}
          </span>
        </button>

        {/* Menú desplegable */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-[var(--color-bg)] border border-[var(--color-primary)] rounded-lg shadow-lg p-2 z-50">
            <p className="text-xs sm:text-sm text-[var(--color-text)] px-2 sm:px-3 py-2 border-b border-[var(--color-primary)] truncate">
              {userEmail}
            </p>
            <button
              onClick={() => {
                navigate("/user/profile");
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm transition"
            >
              <User size={14} />
              {t('userPanel.profile')}
            </button>
            <button
              onClick={() => {
                navigate("/changePassword");
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm transition"
            >
              <Settings size={14} />
              {t('changePassword.title')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm transition"
            >
              <LogOut size={14} />
              {t('userPanel.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
