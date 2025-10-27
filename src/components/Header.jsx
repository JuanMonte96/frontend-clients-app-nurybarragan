import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header({ logo, links = [] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // 👈 para redirigir con el botón

  return (
    <header className="bg-header shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-1 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-start gap-2">
          {logo && <img src={logo} alt="Logo" className="h-20 w-auto" />}
        </Link>

        {/* Botón móvil */}
        <button
          className="lg:hidden text-[var(--color-primary)] hover:[var(--color-primary-hover)] focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menú */}
        <nav
          className={`${
            open ? "block" : "hidden"
          } lg:flex lg:items-center lg:gap-8 absolute lg:static top-full left-0 w-full lg:w-auto bg-[var(--color-header)] lg:bg-transparent shadow-md lg:shadow-none`}
        >
          <ul className="flex flex-col lg:flex-row gap-4 p-4 lg:p-0 text-[var(--color-primary)]">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition ${
                      isActive ? "font-bold text-[var(--color-accent)]" : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 👇 Botón de iniciar sesión */}
          <button
            onClick={() => navigate("/login")} // redirige al login
            className="bg-[var(--color-primary)] text-[var(--color-text-button)] font-bold px-4 py-2 rounded-3xl hover:bg-[var(--color-primary-hover)] transition ml-4 mb-4 lg:mb-0 flex justify-center items-center"
          >
            <span>INICIA SESIÓN</span>
          </button>
        </nav>
      </div>
    </header>
  );
}