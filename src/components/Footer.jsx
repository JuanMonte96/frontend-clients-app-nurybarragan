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
                                        href="https://www.instagram.com/nb_dance_and_fitness?igsh=cjhubmU4bnk5MTQ4&igsi=cjhubmU4bnk5MTQ4"
                                        className="hover:text-[var(--color-primary-hover)] transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li className="mb-2 sm:mb-4">
                                    <a
                                        href="https://web.facebook.com/people/NB-DANCE-Fitness/61593441149740/?mibextid=wwXIfr&rdid=AnvCaQBK5nl5wMdc&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F19BaGYqJ3K%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr"
                                        className="hover:text-[var(--color-primary-hover)] transition-colors"
                                    >
                                        Facebook
                                    </a>
                                </li>
                                <li className="mb-2 sm:mb-4">
                                    <a
                                        href="https://www.tiktok.com/@nb.dance.fitness?_r=1&_t=ZN-98wAPGNjmCI"
                                        className="hover:text-[var(--color-primary-hover)] transition-colors"
                                    >
                                        TikTok
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
                                    <Link to="/privacy-policy" className="hover:text-[var(--color-primary-hover)] transition-colors">
                                        {t('footer.privacy')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms-and-conditions" className="hover:text-[var(--color-primary-hover)] transition-colors">
                                        {t('footer.terms')}
                                    </Link>
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
                            href="https://web.facebook.com/people/NB-DANCE-Fitness/61593441149740/?mibextid=wwXIfr&rdid=AnvCaQBK5nl5wMdc&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F19BaGYqJ3K%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr"
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
                            href="https://www.tiktok.com/@nb.dance.fitness?_r=1&_t=ZN-98wAPGNjmCI"
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
                                    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.93-3.58 3.2-5.91 3.22-1.43.08-2.86-.31-4.09-1.03-2.04-1.2-3.49-3.42-3.72-5.79-.02-.5-.03-1-.01-1.5.18-1.9 1.13-3.75 2.61-4.95 1.68-1.46 4.12-2.15 6.33-1.68.02 1.48-.04 2.96-.04 4.44-.99-.32-2.13-.23-2.99.35-.62.4-1.09 1.03-1.29 1.75-.17.41-.12.86-.11 1.3.32 2.2 2.56 3.84 4.72 3.44 1.44-.17 2.68-1.17 3.06-2.56.13-.24.08-.51.1-.77.02-2.74.01-5.47.02-8.21-.01-1.24.02-2.48-.01-3.72z"
                                />
                            </svg>
                        </a>
                        <a
                            href="https://www.instagram.com/nb_dance_and_fitness?igsh=cjhubmU4bnk5MTQ4&igsi=cjhubmU4bnk5MTQ4"
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
