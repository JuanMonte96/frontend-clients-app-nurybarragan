import logo from '../assets/final-logo-nb.webp'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleScrollTo = (hash) => (e) => {
        e.preventDefault();
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            navigate('/');
            setTimeout(() => {
                const el2 = document.getElementById(id);
                if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    };
    return (
        <footer className="p-3 sm:p-6 bg-[var(--color-header)] text-[var(--color-primary)]">
            <div className="mx-auto max-w-screen-xl">
                {/* Sección principal */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4 sm:gap-6">
                    {/* Logo + Marca */}
                    <div className="mb-4 sm:mb-6 md:mb-0">
                        <a href="#hero" onClick={handleScrollTo('#hero')} className="flex items-center">
                            <img
                                src={logo} // coloca tu logo local o URL
                                className="h-12 sm:h-16 md:h-20 lg:h-28 w-auto object-contain max-w-[320px]"
                                alt="Logo"
                            />
                        </a>
                    </div>

                    {/* Enlaces */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3">
                        {/* Recursos */}
                        <div>
                            <h2 className="mb-3 sm:mb-6 text-xs sm:text-sm font-semibold text-[var(--color-primary)] uppercase">
                                {t('footer.resources')}
                            </h2>
                            <ul className="text-[var(--color-primary)] text-xs sm:text-sm">
                                <li>
                                    <a href="#contact" onClick={handleScrollTo('#contact')} className="hover:text-[var(--color-primary-hover)] transition-colors">
                                        {t('footer.support')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-3 sm:mb-6 text-xs sm:text-sm font-semibold text-[var(--color-primary)] uppercase">
                                {t('footer.followUs')}
                            </h2>
                            <ul className="text-[var(--color-primary)] text-xs sm:text-sm">
                                <li className="mb-2 sm:mb-4">
                                    <a
                                        href="#"
                                        className="hover:text-[var(--color-primary-hover)] transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-[var(--color-primary-hover)] transition-colors"
                                    >
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h2 className="mb-3 sm:mb-6 text-xs sm:text-sm font-semibold text-[var(--color-primary)] uppercase">
                                {t('footer.legal')}
                            </h2>
                            <ul className="text-[var(--color-primary)] text-xs sm:text-sm">
                                <li className="mb-2 sm:mb-4">
                                    <a href="#" className="hover:text-[var(--color-primary-hover)] transition-colors">
                                        {t('footer.privacy')}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-[var(--color-primary-hover)] transition-colors">
                                        {t('footer.terms')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <hr className="my-4 sm:my-6 md:my-8 border-[var(--color-primary)]/30" />

                {/* Parte inferior */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <span className="text-xs sm:text-sm text-[var(--color-primary)]">
                        © {new Date().getFullYear()} {" "}
                        <Link to="/" className="hover:text-[var(--color-primary-hover)] transition-colors font-semibold">
                            NB Dance & Fitness
                        </Link>{" "}
                        — {t('footer.copyright')}
                    </span>

                    {/* Íconos sociales */}
                    <div className="flex gap-4 sm:gap-6">
                        {/* Facebook */}
                        <a
                            href="#"
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
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
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
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
