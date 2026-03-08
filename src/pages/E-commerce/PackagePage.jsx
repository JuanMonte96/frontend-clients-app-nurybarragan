import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PackageCard from "../../components/PackageCard";
import PurchaseModal from "../../components/PurchaseModal";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";

export default function PackagePage() {

  const { t } = useTranslation();
  const { showToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null); // paquete actual
  const [modalOpen, setModalOpen] = useState(false); // abrir/cerrar modal
  const [isRedirecting, setIsRedirecting] = useState(false); // pantalla de carga mientras redirige a Stripe
  const skeletonItems = Array.from({ length: 6 });

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
    // Activamos la pantalla de carga — el modal permanece abierto mostrando el spinner
    setIsRedirecting(true);
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

      const payment_url = response.data.url;
      console.log(response.data.url);
      if (payment_url) {
        // La navegación a Stripe destruye esta página completa,
        // por eso el loader desaparece solo — no necesitamos código extra.
        window.location.href = payment_url;
      } else {
        showToast(t('common.error'), 'error');
        setIsRedirecting(false);
        setModalOpen(false);
      }
    } catch (error) {
      console.error('❌ Error al iniciar pago:', error);
      showToast(t('common.error'), 'error');
      // En caso de error, quitamos el loader y dejamos el modal abierto para reintentar
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <main id="packages" className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] scroll-mt-24 p-3 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 sm:h-12 w-56 sm:w-72 bg-[var(--color-border)]/60 rounded mx-auto mb-6 sm:mb-8 animate-pulse" />
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full">
            {skeletonItems.map((_, index) => (
              <div
                key={`package-skeleton-${index}`}
                className="w-full max-w-sm rounded-lg p-4 sm:p-6 bg-[var(--color-header)] border border-[var(--color-border)] shadow-md animate-pulse"
              >
                <div className="h-7 w-3/4 bg-[var(--color-primary)]/60 rounded mb-3" />
                <div className="h-4 w-full bg-[var(--color-primary)]/60 rounded mb-2" />
                <div className="h-4 w-5/6 bg-[var(--color-primary)]/60 rounded mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="h-8 w-14 bg-[var(--color-primary)]/60 rounded" />
                    <div className="h-3 w-16 bg-[var(--color-primary)]/60 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-14 bg-[var(--color-primary)]/60 rounded" />
                    <div className="h-3 w-16 bg-[var(--color-primary)]/60 rounded" />
                  </div>
                </div>
                <div className="h-10 w-24 bg-[var(--color-primary)]/60 rounded mx-auto mb-4" />
                <div className="h-10 w-full bg-[var(--color-primary)]/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  if (error) return <div className="p-6 sm:p-8 md:p-10 text-center text-red-600 text-xs sm:text-sm md:text-base">{t("common.error")} : {error}</div>;

  // 👉 Organizar paquetes en 3 grupos
  const premiumPackages = packages.filter((pkg) => pkg.category === 'premium');
  const standardPackages = packages.filter((pkg) => pkg.category=='standard') ;
  const basicPackages = packages.filter((pkg) => pkg.category == 'basics');

  return (
    <main id="packages" className="min-h-screen bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] scroll-mt-24 p-3 sm:p-6 md:p-8">
      <motion.h1
        className="text-5xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-[var(--color-text)]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {t("packages.title")}
      </motion.h1>

      {basicPackages.length > 0 && (
        <motion.section
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-center sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.other") || "Other"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center w-full max-w-7xl mx-auto">
            {basicPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id_package}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
              >
                <PackageCard pkg={pkg} onBuy={handleBuyClick} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

     
      {standardPackages.length > 0 && (
        <motion.section
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-center sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.popular") || "Popular"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full max-w-7xl mx-auto">
              {standardPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id_package}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
                >
                  <PackageCard pkg={pkg} onBuy={handleBuyClick} />
                </motion.div>
              ))}
            </div>
        </motion.section>
      )}
      
      {premiumPackages.length > 0 && (
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-center sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">{t("packages.premium") || "Premium"}</h2>
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-items-center w-full max-w-7xl mx-auto">
            {premiumPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id_package}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
              >
                <PackageCard pkg={pkg} onBuy={handleBuyClick} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}


      {/* MODAL */}
      <PurchaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={selectedPackage}
        onConfirm={handleConfirmPurchase}
        isLoading={isRedirecting}
      />
    </main>
  );
}
