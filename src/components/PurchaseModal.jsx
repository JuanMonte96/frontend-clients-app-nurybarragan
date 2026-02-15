import  { useState } from "react";
import { useTranslation } from "react-i18next";
import bgPoster from "../assets/bg-poster.webp";

export default function PurchaseModal({ isOpen, onClose, pkg, onConfirm }) {

  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    }
  };

  const handleCloseAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const getPackageDescription = () => {
    const name = pkg.name_package?.toLowerCase() || "";

    // Mapear nombres de paquetes a colores
    if (name.includes("starter")) return t('purchase.starter_description');
    if (name.includes("booster")) return t('purchase.booster_description');
    if (name.includes("power")) return t('purchase.power_description');
    if (name.includes("uni")) return t('purchase.uni_description');
    if (name.includes("ultimate")) return t('purchase.ultimate_description');
    if (name.includes("freedom")) return t('purchase.freedom_description');

    return pkg.description_package
  }


  return (
    <div 
      className={`modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`modal-content bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-bg-secondary)] rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transition-all duration-300 transform ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
          {/* Sección de Imagen */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[var(--color-text-button)] to-[var(--color-header)] p-6 sm:p-8">
            <img 
              src={bgPoster} 
              alt="Package Poster" 
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Sección de Contenido */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text)]">
                {pkg.name_package}
              </h2>
              <div className="h-1 w-16 bg-[var(--color-primary)] rounded-full"></div>
            </div>

            <div className="mb-6">
              <p className="text-sm sm:text-base text-[var(--color-header)] mb-4">
                {t("purchase.description")}: <span className="font-semibold text-[var(--color-text)]">{getPackageDescription()}</span>
              </p>
            </div>

            <div className="mb-8 p-4 bg-gradient-to-r from-[var(--color-primary)]/70 to-[var(--color-gradient-button)]/70 rounded-xl border border-[var(--color-primary)]/20">
              <p className="text-xs sm:text-sm text-[var(--color-header)] mb-1">{t("purchase.price")}</p>
              <p className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                €{pkg.price_package}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onConfirm({ name, email, telephone });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[var(--color-text)] text-xs sm:text-sm font-semibold mb-2">
                  {t("purchase.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white text-[var(--color-text)] border-2 border-[#e0e0e0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-[var(--color-text)] text-xs sm:text-sm font-semibold mb-2">
                  {t("purchase.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white text-[var(--color-text)] border-2 border-[#e0e0e0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-[var(--color-text)] text-xs sm:text-sm font-semibold mb-2">
                  {t("purchase.phone")}
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                  className="w-full bg-white text-[var(--color-text)] border-2 border-[#e0e0e0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  placeholder="+34 612345678"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] text-[var(--color-text)] rounded-lg hover:shadow-lg font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {t("purchase.buy")}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              {t("purchase.close_hint") || "Haz clic fuera para cerrar"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}