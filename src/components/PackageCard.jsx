export default function PackageCard({ pkg, onBuy }) {
  return (
    <div className="bg-[#fff8e1] shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
      {/* Nombre */}
      <h2 className="text-xl font-bold text-[#333333] mb-2 capitalize">
        {pkg.name_package}
      </h2>

      {/* Descripción */}
      <p className="text-[#333333] mb-4">
        {pkg.description_package || "Sin descripción disponible."}      
      </p>

      {/* Precio */}
      <div className="mb-4">
        <span className="text-2xl font-semibold text-[#ffc107]">
          ${pkg.price_package}
        </span>
        <span className="text-[#ffc107] text-sm ml-1">EUR</span>
      </div>

      {/* Detalles */}
      <ul className="text-sm text-[#333333] mb-4">
        <li>Duración: {pkg.duration_package} días</li>
        <li>Límite de clases: {pkg.class_limit}</li>
      </ul>

      {/* Botón */}
      <button
        onClick={() => onBuy(pkg)}
        className="mt-auto w-full bg-[#ffc107] hover:bg-[#ffb300] text-[#333333] font-bold py-2 px-4 rounded-3xl transition-colors"
      >
        COMPRAR
      </button>
    </div>
  );
}