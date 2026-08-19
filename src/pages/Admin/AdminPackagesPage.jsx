import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import {
  createAdminPackage,
  getAdminPackages,
  reorderAdminPackages,
  retryAdminPackageStripeSync,
  updateAdminPackage,
  updateAdminPackageAvailability,
} from "../../services/adminPackagesService";
import { getAdminPackageCategories } from "../../services/adminPackageCategoriesService";
import { getCategoryName } from "../../utils/catalogI18n";
import { useTranslation } from "react-i18next";

const EmptyState = ({ text }) => (
  <div className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-4 py-6 text-center text-sm text-[var(--color-text)]">
    {text}
  </div>
);

const DataError = ({ message }) => (
  <div className="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
    {message}
  </div>
);

const primaryButtonClass = "rounded-lg border border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const outlineButtonClass = "rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-text)] transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-[var(--color-primary)] hover:to-[var(--color-gradient-button)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";

const initialForm = {
  name_package: "",
  description_spanish: "",
  description_english: "",
  description_french: "",
  price_package: "",
  duration_package: "",
  class_limit: "",
  is_recurrent: false,
  availabilty: true,
  id_category: "",
  order_visualization: 0,
  category: "standard",
};

export default function AdminPackagesPage() {
  const { i18n } = useTranslation();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [packagesResponse, setPackagesResponse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [filters, setFilters] = useState({
    name: "",
    id_category: "",
    availabilty: "all",
    is_recurrent: "all",
    stripe_status: "all",
  });

  const loadCategories = useCallback(async () => {
    try {
      const data = await getAdminPackageCategories({
        limit: 200,
        sort_by: "order_visualization",
        sort_order: "ASC",
      });
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: 30,
        sort_by: "created_at",
        sort_order: "DESC",
      };

      if (filters.name.trim()) params.name = filters.name.trim();
      if (filters.id_category) params.id_category = filters.id_category;
      if (filters.availabilty !== "all") params.availabilty = filters.availabilty;
      if (filters.is_recurrent !== "all") params.is_recurrent = filters.is_recurrent;
      if (filters.stripe_status !== "all") params.stripe_status = filters.stripe_status;

      const data = await getAdminPackages(params);
      setPackagesResponse(data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "No fue posible cargar los paquetes.");
    } finally {
      setLoading(false);
    }
  }, [filters.availabilty, filters.id_category, filters.is_recurrent, filters.name, filters.stripe_status, page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const packages = packagesResponse?.packages || [];
  const totalPages = packagesResponse?.pages || 1;

  const indicators = useMemo(() => {
    const total = packages.length;
    const available = packages.filter((item) => item.availabilty).length;
    const recurrent = packages.filter((item) => item.is_recurrent).length;
    const stripeErrors = packages.filter((item) => item.stripe_sync_status !== "synced").length;
    return { total, available, recurrent, stripeErrors };
  }, [packages]);

  const openCreateForm = () => {
    setSelectedPackage(null);
    setFormData({ ...initialForm, id_category: categories[0]?.id_category || "" });
    setShowForm(true);
  };

  const openEditForm = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      name_package: pkg.name_package || "",
      description_spanish: pkg.description_spanish || "",
      description_english: pkg.description_english || "",
      description_french: pkg.description_french || "",
      price_package: pkg.price_package,
      duration_package: pkg.duration_package,
      class_limit: pkg.class_limit ?? "",
      is_recurrent: Boolean(pkg.is_recurrent),
      availabilty: Boolean(pkg.availabilty),
      id_category: pkg.id_category || "",
      order_visualization: pkg.order_visualization ?? 0,
      category: pkg.category || "standard",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedPackage(null);
    setFormData(initialForm);
  };

  const savePackage = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price_package: Number(formData.price_package),
        duration_package: Number(formData.duration_package),
        class_limit: formData.class_limit === "" ? null : Number(formData.class_limit),
        order_visualization: Number(formData.order_visualization),
      };

      if (selectedPackage) {
        const data = await updateAdminPackage(selectedPackage.id_package, payload);
        showToast(data.stripe_message || "El paquete se actualizo correctamente", "success");
      } else {
        await createAdminPackage(payload);
        showToast("El paquete se creo correctamente", "success");
      }

      closeForm();
      await loadPackages();
    } catch (apiError) {
      const message = apiError.response?.data?.message || "No fue posible guardar el paquete.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (pkg) => {
    try {
      await updateAdminPackageAvailability(pkg.id_package, !pkg.availabilty);
      showToast(pkg.availabilty ? "Paquete desactivado" : "Paquete activado", "success");
      await loadPackages();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible actualizar disponibilidad", "error");
    }
  };

  const retryStripe = async (pkg) => {
    try {
      const data = await retryAdminPackageStripeSync(pkg.id_package);
      showToast(data.message || "Sincronizacion ejecutada", "success");
      await loadPackages();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible sincronizar con Stripe", "error");
    }
  };

  const movePackage = async (pkg, direction) => {
    const sameCategory = packages
      .filter((item) => item.id_category === pkg.id_category)
      .sort((a, b) => a.order_visualization - b.order_visualization);

    const index = sameCategory.findIndex((item) => item.id_package === pkg.id_package);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sameCategory.length) return;

    const reordered = [...sameCategory];
    const [row] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, row);

    const items = reordered.map((item, order) => ({
      id_package: item.id_package,
      order_visualization: order,
    }));

    try {
      await reorderAdminPackages(pkg.id_category, items);
      await loadPackages();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible reordenar paquetes", "error");
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">Paquetes</h1>
            <p className="mt-2 text-sm text-[var(--color-text)]">
              Gestiona catalogo, categoria, orden, disponibilidad y sincronizacion con Stripe.
            </p>
          </div>
          <div className="flex gap-2">
            <button className={primaryButtonClass} onClick={openCreateForm}>Crear paquete</button>
            <button className={outlineButtonClass} onClick={loadPackages}>Actualizar</button>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 text-sm">
          <p className="font-semibold">Total</p>
          <p className="text-2xl font-bold">{indicators.total}</p>
        </article>
        <article className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 text-sm">
          <p className="font-semibold">Disponibles</p>
          <p className="text-2xl font-bold">{indicators.available}</p>
        </article>
        <article className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 text-sm">
          <p className="font-semibold">Recurrentes</p>
          <p className="text-2xl font-bold">{indicators.recurrent}</p>
        </article>
        <article className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 text-sm">
          <p className="font-semibold">Con alerta Stripe</p>
          <p className="text-2xl font-bold">{indicators.stripeErrors}</p>
        </article>
      </section>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Filtros</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Nombre
            <input
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.name}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, name: e.target.value }));
                setPage(1);
              }}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Categoria
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.id_category}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, id_category: e.target.value }));
                setPage(1);
              }}
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {getCategoryName(category, i18n.language)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Disponibilidad
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.availabilty}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, availabilty: e.target.value }));
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="true">Disponible</option>
              <option value="false">No disponible</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Recurrente
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.is_recurrent}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, is_recurrent: e.target.value }));
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado Stripe
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.stripe_status}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, stripe_status: e.target.value }));
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="synced">Sincronizado</option>
              <option value="unsynced">Con alerta</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Listado de paquetes</h2>

        {loading ? (
          <LoadingSpinner message="Cargando paquetes..." />
        ) : error ? (
          <DataError message={error} />
        ) : packages.length === 0 ? (
          <EmptyState text="No hay paquetes para los filtros seleccionados." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)]">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-table-header)] text-[var(--color-text)]">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Categoria</th>
                    <th className="px-3 py-2 text-left">Precio</th>
                    <th className="px-3 py-2 text-left">Duracion</th>
                    <th className="px-3 py-2 text-left">Limite</th>
                    <th className="px-3 py-2 text-left">Recurrente</th>
                    <th className="px-3 py-2 text-left">Disponibilidad</th>
                    <th className="px-3 py-2 text-left">Orden</th>
                    <th className="px-3 py-2 text-left">Stripe</th>
                    <th className="px-3 py-2 text-left">Creacion</th>
                    <th className="px-3 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id_package} className="border-t border-[var(--color-primary)]/30">
                      <td className="px-3 py-2 font-semibold">{pkg.name_package}</td>
                      <td className="px-3 py-2 font-semibold">
                        {pkg.category_data ? getCategoryName(pkg.category_data, i18n.language) : "Sin categoria"}
                      </td>
                      <td className="px-3 py-2 font-semibold">EUR {pkg.price_package}</td>
                      <td className="px-3 py-2 font-semibold">{pkg.duration_package}</td>
                      <td className="px-3 py-2 font-semibold">{pkg.class_limit ?? "-"}</td>
                      <td className="px-3 py-2 font-semibold">{pkg.is_recurrent ? "Si" : "No"}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${pkg.availabilty ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                          {pkg.availabilty ? "Disponible" : "No disponible"}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold">{pkg.order_visualization}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${pkg.stripe_sync_status === "synced" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {pkg.stripe_sync_status === "synced" ? "OK" : "Alerta"}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold">{new Date(pkg.created_at).toLocaleString("es-CO")}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button className={outlineButtonClass} onClick={() => openEditForm(pkg)}>Ver</button>
                          <button className={outlineButtonClass} onClick={() => openEditForm(pkg)}>Editar</button>
                          <button className={outlineButtonClass} onClick={() => toggleAvailability(pkg)}>
                            {pkg.availabilty ? "Desactivar" : "Activar"}
                          </button>
                          <button className={outlineButtonClass} onClick={() => movePackage(pkg, "up")}>Subir</button>
                          <button className={outlineButtonClass} onClick={() => movePackage(pkg, "down")}>Bajar</button>
                          <button className={outlineButtonClass} onClick={() => retryStripe(pkg)}>Reintentar Stripe</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                className={outlineButtonClass}
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </button>
              <span>Pagina {page} de {totalPages}</span>
              <button
                className={outlineButtonClass}
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={closeForm}>
          <div className="w-full max-w-4xl rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
              {selectedPackage ? "Editar paquete" : "Crear paquete"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)] sm:col-span-2">
                Nombre
                <input
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.name_package}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name_package: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)] sm:col-span-2">
                Descripcion espanol
                <textarea
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.description_spanish}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_spanish: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Descripcion ingles
                <textarea
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.description_english}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_english: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Descripcion frances
                <textarea
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.description_french}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_french: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Categoria
                <select
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.id_category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id_category: e.target.value }))}
                >
                  <option value="">Selecciona</option>
                  {categories.map((category) => (
                    <option key={category.id_category} value={category.id_category}>
                      {getCategoryName(category, i18n.language)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Campo legado category
                <select
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="basics">basics</option>
                  <option value="standard">standard</option>
                  <option value="premium">premium</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Precio
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.price_package}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price_package: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Duracion
                <input
                  type="number"
                  min="1"
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.duration_package}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration_package: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Limite de clases
                <input
                  type="number"
                  min="0"
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.class_limit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, class_limit: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Orden
                <input
                  type="number"
                  min="0"
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.order_visualization}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order_visualization: e.target.value }))}
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={formData.is_recurrent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_recurrent: e.target.checked }))}
                />
                Recurrente
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <input
                  type="checkbox"
                  checked={formData.availabilty}
                  onChange={(e) => setFormData((prev) => ({ ...prev, availabilty: e.target.checked }))}
                />
                Disponible para venta
              </label>
            </div>

            {selectedPackage && (
              <div className="mt-4 rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text)]">
                <p><span className="font-semibold">Producto Stripe:</span> {selectedPackage.stripe_product_id || "Sin asociar"}</p>
                <p><span className="font-semibold">Precio Stripe:</span> {selectedPackage.stripe_price_id || "Sin asociar"}</p>
                <p className="mt-1 text-yellow-700 font-semibold">Si cambias precio o recurrencia se creara un nuevo precio en Stripe para compras futuras.</p>
              </div>
            )}

            <div className="mt-5 flex gap-2 justify-end">
              <button className={outlineButtonClass} onClick={closeForm}>Cancelar</button>
              <button className={primaryButtonClass} onClick={savePackage} disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
