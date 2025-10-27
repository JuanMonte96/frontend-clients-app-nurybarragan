import { useEffect, useState } from "react";
import axios from "axios";
import PackageCard from "../../components/PackageCard";
import PurchaseModal from "../../components/PurchaseModal";

const API_PACKAGES = import.meta.env.VITE_API_GET_PACKAGES;
const API_PAYMENT = import.meta.env.VITE_API_POST_PAYMENT;

export default function PackagePage() {

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null); // paquete actual
  const [modalOpen, setModalOpen] = useState(false); // abrir/cerrar modal

  useEffect(() => {
    const controller = new AbortController();

    const fetchPackages = async () => {
      try {
        const { data } = await axios.get(API_PACKAGES, {
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
  const handleConfirmPurchase = async ({ name, email }) => {
    try {
      const payload = {
        name,
        email,
        id_package: selectedPackage.id_package,
        stripe_price_id: selectedPackage.stripe_price_id,
      };

      console.log("📦 Enviando datos a backend:", payload);

      const response = await axios.post(
        API_PAYMENT,
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

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-[#2c2c2c] p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#ffc107]">Paquetes disponibles</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id_package} pkg={pkg} onBuy={handleBuyClick} />
        ))}
      </div>

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
