import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header({ logo, links = [] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // 👈 para redirigir con el botón

  return (
    <header className="bg-header shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-start gap-2 flex-shrink-0">
          {logo && <img src={logo} alt="Logo" className="h-12 sm:h-16 lg:h-20 w-auto" />}
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
          className={`${
            open ? "block" : "hidden"
          } md:flex md:items-center md:gap-6 lg:gap-8 absolute md:static top-full left-0 w-full md:w-auto bg-[var(--color-header)] md:bg-transparent shadow-md md:shadow-none transition-all duration-300`}
        >
          <ul className="flex flex-col md:flex-row gap-2 md:gap-4 lg:gap-6 p-3 sm:p-4 md:p-0 text-[var(--color-primary)]">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm sm:text-base text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition ${
                      isActive ? "font-bold text-[var(--color-accent)]" : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 👇 Botón de iniciar sesión */}
          <button
            onClick={() => {
              navigate("/login");
              setOpen(false);
            }}
            className="w-full md:w-auto bg-[var(--color-primary)] text-[var(--color-text-button)] font-bold px-4 py-2 rounded-3xl hover:bg-[var(--color-primary-hover)] transition mx-3 sm:mx-4 md:mx-0 md:ml-4 mb-3 md:mb-0 flex justify-center items-center text-sm sm:text-base"
          >
            <span>INICIA SESIÓN</span>
          </button>
        </nav>
      </div>
    </header>
  );
}