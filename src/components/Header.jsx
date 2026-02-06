import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ logo, links = [] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="bg-header shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-1 md:py-3 lg:py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="h-12 sm:h-16 md:h-20 lg:h-28 w-auto object-contain max-w-[320px]"
            />
          )}
        </Link>

        {/* Botón móvil */}
        <button
          className="md:hidden text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus:outline-none p-1"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menú */}
        <nav
          className={`transform transition-all duration-300 ${open ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'} md:max-h-full md:opacity-100 md:translate-y-0 md:flex md:items-center md:gap-2 lg:gap-4 absolute md:static top-full left-0 w-full md:w-auto bg-[var(--color-header)] md:bg-transparent shadow-md md:shadow-none ${open ? 'overflow-visible' : 'overflow-hidden'} md:overflow-visible`}>
          <ul className="flex flex-col md:flex-row gap-2 md:gap-2 lg:gap-4 p-3 sm:p-4 md:p-0 text-[var(--color-primary)]">
            {links.map((link) => (
              <li key={link.to}>
                {link.to && link.to.startsWith("#") ? (
                  <a
                    href={link.to}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link.to.replace('#', '');
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setOpen(false);
                      } else {
                        // fallback: navigate to root then try scroll after short delay
                        navigate('/');
                        setOpen(false);
                        setTimeout(() => {
                          const el2 = document.getElementById(id);
                          if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 200);
                      }
                    }}
                    className={"block px-3 py-2 rounded-md text-xs sm:text-sm md:text-base text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition"}
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-xs sm:text-sm md:text-base text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition ${
                        isActive ? "font-bold text-[var(--color-accent)]" : ""
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Selector de idiomas */}
          <div className="px-3 sm:px-4 md:px-0 md:ml-2 mb-3 md:mb-0 flex justify-start items-center">
            <LanguageSwitcher />
          </div>

          {/* Botón de iniciar sesión */}
          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="w-1/3 md:w-auto bg-[var(--color-primary)] text-[var(--color-text-button)] font-bold px-3 sm:px-4 py-2 rounded-2xl sm:rounded-3xl hover:bg-[var(--color-primary-hover)] transition mx-3 sm:mx-4 md:mx-0 md:ml-2 mb-3 md:mb-0 flex justify-center items-end text-xs sm:text-sm md:text-base"
          >
            <span>{t('header.login')}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}