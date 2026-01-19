import { useTranslation } from "react-i18next";

export default function PackageCard({ pkg, onBuy }) {
  const { t } = useTranslation();
  return (
    <div className="bg-[#fff8e1] shadow-md rounded-lg sm:rounded-lg p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
      {/* Nombre */}
      <h2 className="text-lg sm:text-xl font-bold text-[#333333] mb-2 capitalize line-clamp-2">
        {pkg.name_package}
      </h2>

      {/* Descripción */}
      <p className="text-xs sm:text-sm text-[#333333] mb-4 line-clamp-3">
        {pkg.description_package || "Sin descripción disponible."}
      </p>

      {/* Precio */}
      <div className="mb-4">
        <span className="text-xl sm:text-2xl font-semibold text-[#ffc107]">
          ${pkg.price_package}
        </span>
        <span className="text-[#ffc107] text-xs sm:text-sm ml-1">EUR</span>
      </div>

      {/* Detalles */}
      <ul className="text-xs sm:text-sm text-[#333333] mb-4 space-y-1">
        <li className="truncate">{t('purchase.duration')}: {pkg.duration_package} {t('purchase.days')}</li>
        <li className="truncate">{t('purchase.limit')}: {pkg.class_limit}</li>
      </ul>

      {/* Botón */}
      <button
        onClick={() => onBuy(pkg)}
        className="mt-auto w-full bg-[#ffc107] hover:bg-[#ffb300] text-[#333333] font-bold py-2 px-4 rounded-3xl transition-colors text-sm sm:text-base"
      >
        {t('purchase.buy')}
      </button>
    </div>
  );
}