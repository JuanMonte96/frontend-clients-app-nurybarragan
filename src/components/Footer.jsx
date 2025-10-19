import React from "react";
import logo from '../assets/logo_menu_nury_barragan.png'

export default function Footer() {
    return (
        <footer className="p-6 bg-[#333333] text-[#fff8e1]">
            <div className="mx-auto max-w-screen-xl">
                {/* Sección principal */}
                <div className="md:flex md:justify-between">
                    {/* Logo + Marca */}
                    <div className="mb-6 md:mb-0">
                        <a href="#" className="flex items-center">
                            <img
                                src={logo} // coloca tu logo local o URL
                                className="mr-2 h-20"
                                alt="Logo"
                            />
                        </a>
                    </div>

                    {/* Enlaces */}
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        {/* Recursos */}
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-[#ffc107] uppercase">
                                Recursos
                            </h2>
                            <ul className="text-[#fff8e1]">
                                <li className="mb-4">
                                    <a href="#" className="hover:text-[#ffb300] transition-colors">
                                        Documentación
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#ffb300] transition-colors">
                                        Soporte
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Redes sociales */}
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-[#ffc107] uppercase">
                                Síguenos
                            </h2>
                            <ul className="text-[#fff8e1]">
                                <li className="mb-4">
                                    <a
                                        href="#"
                                        className="hover:text-[#ffb300] transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[#ffb300] transition-colors"
                                    >
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-[#ffc107] uppercase">
                                Legal
                            </h2>
                            <ul className="text-[#fff8e1]">
                                <li className="mb-4">
                                    <a href="#" className="hover:text-[#ffb300] transition-colors">
                                        Política de privacidad
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[#ffb300] transition-colors">
                                        Términos y condiciones
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <hr className="my-6 border-[#ffc107]/30 sm:mx-auto lg:my-8" />

                {/* Parte inferior */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-[#fff8e1]/80">
                        © {new Date().getFullYear()}{" "}
                        <a href="#" className="hover:text-[#ffc107]">
                            Nury Barragán
                        </a>{" "}
                        — Todos los derechos reservados.
                    </span>

                    {/* Íconos sociales */}
                    <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
                        {/* Facebook */}
                        <a
                            href="#"
                            className="text-[#fff8e1]/70 hover:text-[#ffc107] transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 
                  2 12c0 4.991 3.657 9.128 8.438 
                  9.878v-6.987h-2.54V12h2.54V9.797
                  c0-2.506 1.492-3.89 3.777-3.89
                  1.094 0 2.238.195 2.238.195v2.46h-1.26
                  c-1.243 0-1.63.771-1.63 1.562V12h2.773
                  l-.443 2.89h-2.33v6.988C18.343 21.128 
                  22 16.991 22 12z"
                                />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href="#"
                            className="text-[#fff8e1]/70 hover:text-[#ffc107] transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 
                  3.808.06 1.064.049 1.791.218 
                  2.427.465a4.902 4.902 0 011.772 
                  1.153 4.902 4.902 0 011.153 
                  1.772c.247.636.416 1.363.465 
                  2.427.048 1.067.06 1.407.06 
                  4.123v.08c0 2.643-.012 2.987-.06 
                  4.043-.049 1.064-.218 1.791-.465 
                  2.427a4.902 4.902 0 01-1.153 
                  1.772 4.902 4.902 0 01-1.772 
                  1.153c-.636.247-1.363.416-2.427.465
                  -1.067.048-1.407.06-4.123.06h-.08
                  c-2.643 0-2.987-.012-4.043-.06
                  -1.064-.049-1.791-.218-2.427-.465
                  a4.902 4.902 0 01-1.772-1.153 
                  4.902 4.902 0 01-1.153-1.772
                  c-.247-.636-.416-1.363-.465-2.427
                  -.047-1.024-.06-1.379-.06-3.808v-.63
                  c0-2.43.013-2.784.06-3.808
                  .049-1.064.218-1.791.465-2.427
                  a4.902 4.902 0 011.153-1.772
                  A4.902 4.902 0 015.45 2.525
                  c.636-.247 1.363-.416 2.427-.465
                  C8.901 2.013 9.256 2 11.685 2h.63zM12 
                  6.865a5.135 5.135 0 110 10.27 
                  5.135 5.135 0 010-10.27zm0 
                  1.802a3.333 3.333 0 100 
                  6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 
                  1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
