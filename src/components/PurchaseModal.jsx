import  { useState } from "react";
import { useTranslation } from "react-i18next";
import bgPoster from "../assets/bg-poster.webp";
import { getAvailableInstallmentOptions } from "../utils/packageInstallments";

export default function PurchaseModal({ isOpen, onClose, pkg, onConfirm, isLoading = false }) {

  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [selectedInstallments, setSelectedInstallments] = useState(0);

  if (!isOpen && !isClosing) return null;

  const installmentChoices = getAvailableInstallmentOptions(pkg);
  const promotion = pkg?.promotion;
  const effectivePrice = promotion?.promotion_type === "PERCENTAGE_DISCOUNT"
    ? Number(pkg.price_package) * (1 - Number(promotion.discount_percentage) / 100)
    : promotion?.promotion_type === "FIXED_AMOUNT_DISCOUNT"
      ? Number(pkg.price_package) - Number(promotion.discount_amount_minor || 0) / 100
      : Number(pkg?.price_package || 0);

  // Mismo reparto que el backend: el resto por redondeo cae en la ultima cuota.
  const installmentBreakdown = (count) => {
    const totalMinor = Math.round(effectivePrice * 100);
    const base = Math.floor(totalMinor / count);
    const amounts = new Array(count).fill(base);
    amounts[count - 1] += totalMinor - base * count;
    return amounts.map((minor) => minor / 100);
  };

  const handleBackdropClick = (e) => {
    // Bloqueamos el cierre si estamos redirigiendo a Stripe
    if (isLoading) return;
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    }
  };

  const handleCloseAnimation = () => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const applyPaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
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
      <div className={`modal-content relative bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-bg-secondary)] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden transition-all duration-300 transform ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}>

        {/* Overlay de carga mientras se redirige a Stripe */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[var(--color-primary)] border-t-transparent mb-5"></div>
            <p className="text-white font-bold text-lg sm:text-xl mb-1">{t('common.stripe')}</p>
            <p className="text-white/60 text-sm">{t('common.noClose')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] max-h-[92vh]">
          {/* Sección de Imagen */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[var(--color-text-button)] to-[var(--color-header)] p-6 sm:p-8">
            <img 
              src={bgPoster} 
              alt="Package Poster" 
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Sección de Contenido */}
          <div className="flex flex-col min-h-0 max-h-[92vh]">
            <div className="overflow-y-auto p-6 sm:p-8 pt-6">
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
                <div className="flex items-baseline gap-2">
                  {effectivePrice !== Number(pkg.price_package) && (
                    <span className="text-lg font-semibold text-[var(--color-header)] line-through">€{Number(pkg.price_package).toFixed(2)}</span>
                  )}
                  <p className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
                    €{effectivePrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="block text-[var(--color-text)] text-xs sm:text-sm font-semibold mb-2">
                  {t("purchase.paymentMode")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPaymentSelection("card")}
                    className={`text-left rounded-lg border-2 p-3 text-sm transition-all ${
                      selectedPaymentMethod === "card"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-[#e0e0e0] bg-white"
                    }`}
                  >
                    <span className="block font-semibold text-[var(--color-text)]">{t("purchase.payFull")}</span>
                    <span className="block text-xs text-[var(--color-header)]">€{effectivePrice.toFixed(2)} {t("purchase.payFullHint")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPaymentSelection("sepa_debit")}
                    className={`text-left rounded-lg border-2 p-3 text-sm transition-all ${
                      selectedPaymentMethod === "sepa_debit"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-[#e0e0e0] bg-white"
                    }`}
                  >
                    <span className="block font-semibold text-[var(--color-text)]">SEPA Direct Debit</span>
                    <span className="block text-xs text-[var(--color-header)]">{installmentChoices.length > 0 ? `${t("purchase.payInstallments", { count: installmentChoices[0] })}` : t("purchase.payFull")}</span>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInstallments(0)}
                    className={`text-left rounded-lg border-2 p-3 text-sm transition-all ${
                      selectedInstallments === 0
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-[#e0e0e0] bg-white"
                    }`}
                  >
                    <span className="block font-semibold text-[var(--color-text)]">{t("purchase.payFull")}</span>
                    <span className="block text-xs text-[var(--color-header)]">€{effectivePrice.toFixed(2)}</span>
                  </button>

                  {installmentChoices.map((count) => {
                    const amounts = installmentBreakdown(count);
                    const allEqual = amounts.every((amount) => amount === amounts[0]);
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSelectedInstallments(count)}
                        className={`text-left rounded-lg border-2 p-3 text-sm transition-all ${
                          selectedInstallments === count
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                            : "border-[#e0e0e0] bg-white"
                        }`}
                      >
                        <span className="block font-semibold text-[var(--color-text)]">
                          {t("purchase.payInstallments", { count })}
                        </span>
                        <span className="block text-xs text-[var(--color-header)]">
                          {allEqual
                            ? `${count} x €${amounts[0].toFixed(2)}`
                            : `${count - 1} x €${amounts[0].toFixed(2)} + €${amounts[count - 1].toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedInstallments > 0 && (
                  <p className="mt-2 text-xs text-[var(--color-header)]">
                    {t("purchase.sepaHint")}
                  </p>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const safeInstallments = selectedInstallments > 1 ? selectedInstallments : 0;
                  setSelectedInstallments(safeInstallments);
                  onConfirm({
                    name,
                    email,
                    telephone,
                    payment_method: selectedPaymentMethod,
                    installment_count: safeInstallments || null,
                  });
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
                    placeholder={t("purchase.name_placeholder")}
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
            <div className="sticky bottom-0 border-t border-[var(--color-primary)]/10 bg-[var(--color-bg-secondary)]/95 px-6 py-4 backdrop-blur-sm">
              <button
                type="button"
                onClick={handleCloseAnimation}
                className="w-full rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-bg)] text-[var(--color-text)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-primary)]/5"
              >
                {t("common.close") || "Cerrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}