import { useTranslation } from "react-i18next";
import poster from '../assets/bg-poster.webp';

export default function PackageCard({ pkg, onBuy }) {
  const { t, i18n } = useTranslation();

  // Función para obtener el color del paquete basado en su nombre o identificador
  const getPackageColor = () => {
    const name = pkg.name_package?.toLowerCase() || "";

    // Mapear nombres de paquetes a colores
    if (name.includes("starter")) return "var(--color-pack-5)";
    if (name.includes("booster")) return "var(--color-pack-10)";
    if (name.includes("power")) return "var(--color-pack-20)";
    if (name.includes("uni")) return "var(--color-pack-1)";
    if (name.includes("ultimate")) return "var(--color-pack-ulti)";
    if (name.includes("freedom")) return "var(--color-pack-free)";
    if (name.includes("discover")) return "var(--color-pack-discover)";

    return "var(--color-primary)";
  };

  const getPackageDescription = () => {

    const descriptionMap = {
      es: pkg.description_spanish,
      en: pkg.description_english,
      fr: pkg.description_french
    };
    return descriptionMap[i18n.language] || pkg.description_spanish;
  }

  const isMonthly = (pkg) => {
    const months = pkg.duration_package / 30;
    if (months > 12) return null;
    return months >= 1;
  }

  const packageColor = getPackageColor();
  const promotion = pkg.promotion;
  const nonMonetaryBenefits = (pkg.promotions || []).filter((item) => item.promotion_type === "NON_MONETARY");
  const promotionDescription = promotion
    ? ({ es: promotion.description_spanish, en: promotion.description_english, fr: promotion.description_french }[i18n.language] || promotion.description_spanish)
    : "";
  const discountedPrice = promotion?.promotion_type === "PERCENTAGE_DISCOUNT"
    ? Number(pkg.price_package) * (1 - Number(promotion.discount_percentage) / 100)
    : promotion?.promotion_type === "FIXED_AMOUNT_DISCOUNT"
      ? Number(pkg.price_package) - Number(promotion.discount_amount_minor || 0) / 100
      : Number(pkg.price_package);
  const hasMonetaryPromotion = promotion?.promotion_type === "PERCENTAGE_DISCOUNT" || promotion?.promotion_type === "FIXED_AMOUNT_DISCOUNT";

  return (
    <div
      className="shadow-md rounded-lg sm:rounded-lg p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-shadow transition-transform duration-500 ease-out h-full relative overflow-hidden transform hover:scale-[1.02]"
      style={{ border: `10px solid ${packageColor}`, backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* OVERLAY DIFUMINADO - Oscurece la imagen de fondo */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* CONTENIDO - Se superpone al overlay */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* TÍTULO - Parte superior */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 capitalize line-clamp-2">
            {pkg.name_package}
          </h2>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-xl sm:text-xl text-white line-clamp-3 mb-6">
          {getPackageDescription()}
        </p>

        {/* CLASS LIMIT Y DURACIÓN - Dos columnas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Class Limit */}
          <div className="flex flex-col items-start">
            <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl leading-none">
              {pkg.class_limit ? `${pkg.class_limit}` : t('purchase.limit_description')}
            </p>
            <p className="text-white font-bold text-xs sm:text-sm leading-none">
              {t('purchase.limit')}
            </p>
          </div>

          {/* Duración */}
          <div className="flex flex-col items-start">
            {isMonthly(pkg) !== null && (
              <>
                <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl leading-none">
                  {isMonthly(pkg) ? `${pkg.duration_package / 30}` : `${pkg.duration_package}`}
                </p>
                <p className="text-white font-bold text-xs sm:text-sm leading-none">
                  {isMonthly(pkg) ? (pkg.duration_package / 30 === 1 ? t('purchase.month') : t('purchase.months')) : t('purchase.days')}
                </p>
              </>
            )}
          </div>
        </div>

        {/* PRECIO - Grande y vistoso */}
        <div className="mb-4 p-4 text-center">
          <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-semibold mb-1">{t('purchase.price')}</p>
          {hasMonetaryPromotion ? <p className="text-sm font-semibold text-white/70 line-through">€{Number(pkg.price_package).toFixed(2)}</p> : null}
          <p className="text-3xl sm:text-4xl font-bold text-[var(--color-text-secondary)]">€{discountedPrice.toFixed(2)}</p>
          {hasMonetaryPromotion ? <span className="mt-2 inline-flex rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-black text-slate-900">{promotion.promotion_type === "PERCENTAGE_DISCOUNT" ? `${promotion.discount_percentage}% ${t("promotions.off")}` : t("promotions.specialPrice")}</span> : null}
          {promotionDescription ? <p className="mt-2 text-xs font-semibold text-white/80">{promotionDescription}</p> : null}
          {nonMonetaryBenefits.map((benefit) => <p key={benefit.id_promotion} className="mt-2 text-xs font-bold text-amber-200">{({ es: benefit.name_spanish, en: benefit.name_english, fr: benefit.name_french }[i18n.language] || benefit.name_spanish)}</p>)}
        </div>

        {/* BOTÓN COMPRAR */}
        <button
          onClick={() => onBuy(pkg)}
          className="w-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] text-[var(--color-text)] font-bold py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          {t('purchase.buy')}
        </button>

        <span className="text-center text-xs sm:text-sm text-[var(--color-text-secondary)] mt-4 block">
          ***{t('purchase.terms')}***
        </span>
      </div>
    </div>
  );
}