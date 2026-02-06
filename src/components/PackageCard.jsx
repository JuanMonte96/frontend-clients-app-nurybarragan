import { useTranslation } from "react-i18next";

export default function PackageCard({ pkg, onBuy }) {
  const { t } = useTranslation();
  
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
    
    return "var(--color-pack-default)";
  };
  
  const packageColor = getPackageColor();
  
  return (
    <div 
      className="shadow-md rounded-lg sm:rounded-lg p-4 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
      style={{ backgroundColor: packageColor }}
    >
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
        <span className="text-xl sm:text-2xl font-semibold text-[var(--color-table-header)]">
          ${pkg.price_package}
        </span>
        <span className="text-[var(--color-table-header)] text-xs sm:text-sm ml-1">EUR</span>
      </div>

      {/* Detalles */}
      <ul className="text-xs sm:text-sm text-[#333333] mb-4 space-y-1">
        <li className="truncate">{t('purchase.duration')}: {pkg.duration_package} {t('purchase.days')}</li>
        <li className="truncate">{t('purchase.limit')}: {pkg.class_limit?pkg.class_limit:t('purchase.limit_description')}</li>
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