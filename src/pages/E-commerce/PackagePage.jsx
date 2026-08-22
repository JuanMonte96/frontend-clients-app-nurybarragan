import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PackageCard from "../../components/PackageCard";
import PurchaseModal from "../../components/PurchaseModal";
import api from "../../services/api";
import { getPublicPackageCatalog } from "../../services/packageCatalogService";
import { getPublicPromotions } from "../../services/promotionCatalogService";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";
import { getCategoryName } from "../../utils/catalogI18n";

export default function PackagePage() {

  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null); // paquete actual
  const [modalOpen, setModalOpen] = useState(false); // abrir/cerrar modal
  const [isRedirecting, setIsRedirecting] = useState(false); // pantalla de carga mientras redirige a Stripe
  const skeletonItems = Array.from({ length: 6 });

  useEffect(() => {
    let mounted = true;

    const fetchPackages = async () => {
      try {
        const [catalogData, promotionsData] = await Promise.all([
          getPublicPackageCatalog(),
          // Las promociones no monetarias son independientes de los paquetes,
          // por eso se consultan por separado en lugar de derivarlas del catálogo.
          getPublicPromotions().catch(() => ({ promotions: [] })),
        ]);
        if (mounted && catalogData.status === "success") {
          setCategories(Array.isArray(catalogData.categories) ? catalogData.categories : []);
        }
        if (mounted) {
          setPromotions(Array.isArray(promotionsData.promotions) ? promotionsData.promotions : []);
        }

      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPackages();
    return () => {
      mounted = false;
    };
  }, []);

  // 👉 Se ejecuta cuando el usuario hace clic en "Comprar" en una card
  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  // 👉 Se ejecuta cuando el usuario confirma el modal
  const handleConfirmPurchase = async ({ name, email, telephone, payment_method = 'card', installment_count }) => {
    // Activamos la pantalla de carga — el modal permanece abierto mostrando el spinner
    setIsRedirecting(true);
    try {
      const safeInstallmentCount = Number(installment_count) > 1 ? Number(installment_count) : null;
      const payload = {
        name,
        email,
        telephone,
        id_package: selectedPackage.id_package,
        payment_method,
        ...(safeInstallmentCount ? { installment_count: safeInstallmentCount } : {}),
      };

      console.log("📦 Enviando datos a backend:", payload);

      const response = await api.post(
        safeInstallmentCount ? "/api/payments/start-payment-plan" : "/api/payments/start-payment",
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

  const allPackages = categories.flatMap((category) => category.packages || []);

  // El backend ya filtra por is_active/archived_at/starts_at/ends_at y solo
  // adjunta la promoción monetaria vigente a cada paquete (una a la vez).
  const promotedPackages = allPackages.filter((pkg) => pkg.promotion);

  // Las promociones no monetarias nunca quedan ancladas a un paquete, por eso
  // se muestran tal cual llegan del endpoint público de promociones.
  const nonMonetaryPromotions = promotions.filter((promotion) => promotion.promotion_type === "NON_MONETARY");

  const hasPromotions = promotedPackages.length > 0 || nonMonetaryPromotions.length > 0;
  const promotedPackagesGridColumns = promotedPackages.length <= 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

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

      {hasPromotions ? (
        <motion.section
          id="promotions"
          className="mb-10 sm:mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mx-auto mb-4 max-w-7xl text-center sm:mb-6">
            <h2 className="mt-2 text-2xl font-black text-[var(--color-text)] sm:text-3xl md:text-4xl">{t("promotions.specialTitle")}</h2>
          </div>

          {nonMonetaryPromotions.length > 0 ? (
            // A diferencia de los paquetes, estas ocupan todo el ancho disponible en vez de quedar centradas.
            <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nonMonetaryPromotions.map((promotion) => {
                const name = { es: promotion.name_spanish, en: promotion.name_english, fr: promotion.name_french }[i18n.language] || promotion.name_spanish;
                const description = { es: promotion.description_spanish, en: promotion.description_english, fr: promotion.description_french }[i18n.language] || promotion.description_spanish;

                return (
                  <article key={promotion.id_promotion} className="h-full rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-bg-secondary)] p-5 shadow-md">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-header)]">{t("promotions.nonMonetary")}</p>
                    <h3 className="mt-2 text-3xl font-black text-[var(--color-text)]">{name}</h3>
                    <p className="mt-2 text-xl leading-6 text-[var(--color-text)]">{description}</p>
                  </article>
                );
              })}
            </div>
          ) : null}

          {promotedPackages.length > 0 ? (
            <div className={`mx-auto grid w-full max-w-7xl grid-cols-1 justify-items-center gap-2 sm:grid-cols-1 sm:gap-3 md:grid-cols-2 md:gap-4 ${promotedPackagesGridColumns}`}>
              {promotedPackages.map((pkg) => (
                <PackageCard key={pkg.id_package} pkg={pkg} onBuy={handleBuyClick} />
              ))}
            </div>
          ) : null}
        </motion.section>
      ) : null}

      {categories.length === 0 ? (
        <div className="text-center text-sm sm:text-base text-[var(--color-text)] mt-8">
          {t("common.noData") || "No hay paquetes disponibles por el momento."}
        </div>
      ) : (
        categories.map((category, categoryIndex) => {
          const packages = Array.isArray(category.packages) ? category.packages : [];
          const gridColumns = packages.length <= 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

          return (
            <motion.section
              key={category.id_category}
              className="mb-10 sm:mb-12 md:mb-14"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: categoryIndex * 0.05 }}
            >
              <h2 className="text-center sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-[var(--color-text)]">
                {getCategoryName(category, i18n.language)}
              </h2>
              <div className={`grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ${gridColumns} justify-items-center w-full max-w-7xl mx-auto`}>
                {packages.map((pkg, index) => (
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
          );
        })
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

