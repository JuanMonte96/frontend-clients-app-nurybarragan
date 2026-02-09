import { useEffect, useState } from "react";
import PackageCard from "../../components/PackageCard";
import PurchaseModal from "../../components/PurchaseModal";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

export default function PackagePage() {

  const { t } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null); // paquete actual
  const [modalOpen, setModalOpen] = useState(false); // abrir/cerrar modal

  useEffect(() => {
    const controller = new AbortController();

    const fetchPackages = async () => {
      try {
        const { data } = await api.get("/api/packages/all", {
          signal: controller.signal,
        });
        console.log(data)
        if (data.status === "success") {
          setPackages(data.packages);
        }

      } catch (err) {
        if (err.name !== "CanceledError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
    return () => controller.abort();
  }, []);

  // 👉 Se ejecuta cuando el usuario hace clic en "Comprar" en una card
  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  // 👉 Se ejecuta cuando el usuario confirma el modal
  const handleConfirmPurchase = async ({ name, email, telephone }) => {
    try {
      const payload = {
        name,
        email,
        telephone,
        id_package: selectedPackage.id_package,
        stripe_price_id: selectedPackage.stripe_price_id,
      };

      console.log("📦 Enviando datos a backend:", payload);

      const response = await api.post(
        "/api/payments/start-payment",
        payload
      );

      const payment_url = response.data.url; // tu backend debería devolver algo así
      console.log(response.data.url)
      if (payment_url) {
        window.location.href = payment_url; // redirige a Stripe
      } else {
        alert("No se pudo obtener la URL de pago.");
      }
    } catch (error) {
      console.error("❌ Error al iniciar pago:", error);
      alert("Error al iniciar el pago. Intenta nuevamente.");
    } finally {
      setModalOpen(false);
    }
  };

  if (loading) return <div className="p-6 sm:p-8 md:p-10 text-center text-xs sm:text-sm md:text-base">{t("common.loading")}</div>; // Cambiar cuando ya se vaya a producción crear un componente Loading
  if (error) return <div className="p-6 sm:p-8 md:p-10 text-center text-red-600 text-xs sm:text-sm md:text-base">{t("common.error")} : {error}</div>;

  // 👉 Organizar paquetes en 3 grupos
  const premiumPackages = packages.filter((pkg) => pkg.class_limit === null);
  const midPackages = packages.filter((pkg) => pkg.class_limit > 1);
  const otherPackages = packages.filter((pkg) => pkg.class_limit !== null && pkg.class_limit <= 1);

  return (
    <main id="packages" className="min-h-screen bg-[var(--color-bg)] scroll-mt-24 p-3 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-[var(--color-text)]">{t("packages.title")}</h1>

    
      {premiumPackages.length > 0 && (
        <section className="mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-center sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.premium") || "Premium"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center w-full max-w-7xl mx-auto">
            {premiumPackages.map((pkg) => (
              <PackageCard key={pkg.id_package} pkg={pkg} onBuy={handleBuyClick} />
            ))}
          </div>
        </section>

      )}

     
      {midPackages.length > 0 && (
        <section className="mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-center sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.popular") || "Popular"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full max-w-7xl mx-auto">
              {midPackages.map((pkg) => (
                <PackageCard key={pkg.id_package} pkg={pkg} onBuy={handleBuyClick} />
              ))}
            </div>
        </section>
      )}

      {otherPackages.length > 0 && (
        <section className="mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-center sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.other") || "Other"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center w-full max-w-7xl mx-auto">
            {otherPackages.map((pkg) => (
              <PackageCard key={pkg.id_package} pkg={pkg} onBuy={handleBuyClick} />
            ))}
          </div>
        </section>
      )}

      {/* MODAL */}
      <PurchaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={selectedPackage}
        onConfirm={handleConfirmPurchase}
      />
    </main>
  );
}
