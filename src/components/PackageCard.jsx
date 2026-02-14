import { useTranslation } from "react-i18next";
import poster from '../assets/bg-poster.webp';

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

    return "var(--color-primary)";
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

  const isMonthly = (pkg) => {
    return (Number(pkg.duration_package / 30)) > 1;
  }

  const packageColor = getPackageColor();

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
            <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl leading-none">
              {isMonthly(pkg) ? `${pkg.duration_package / 30}` : `${pkg.duration_package}`}
            </p>
            <p className="text-white font-bold text-xs sm:text-sm leading-none">
              {isMonthly(pkg) ? t('purchase.months') : t('purchase.days')}
            </p>
          </div>
        </div>

        {/* PRECIO - Grande y vistoso */}
        <div className="mb-4 p-4 text-center">
          <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-semibold mb-1">{t('purchase.price')}</p>
          <p className="text-3xl sm:text-4xl font-bold text-[var(--color-text-secondary)]">
            €{pkg.price_package}
          </p>
        </div>

        {/* BOTÓN COMPRAR */}
        <button
          onClick={() => onBuy(pkg)}
          className="w-full bg-[var(--color-primary)] hover:bg-[#ffb300] text-[var(--color-text)] font-bold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
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