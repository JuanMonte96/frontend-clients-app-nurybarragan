import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import {
  createAdminPackageCategory,
  deleteAdminPackageCategory,
  getAdminPackageCategories,
  reorderAdminPackageCategories,
  updateAdminPackageCategory,
  updateAdminPackageCategoryStatus,
} from "../../services/adminPackageCategoriesService";

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
  category_name_spanish: "",
  category_name_english: "",
  category_name_french: "",
  order_visualization: 0,
  active: true,
};

export default function AdminPackageCategoriesPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoriesResponse, setCategoriesResponse] = useState(null);
  const [filters, setFilters] = useState({ search: "", active: "all" });
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: 50,
        sort_by: "order_visualization",
        sort_order: "ASC",
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.active !== "all") params.active = filters.active;

      const data = await getAdminPackageCategories(params);
      setCategoriesResponse(data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "No fue posible cargar las categorias.");
    } finally {
      setLoading(false);
    }
  }, [filters.active, filters.search, page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const categories = categoriesResponse?.categories || [];
  const totalPages = categoriesResponse?.pages || 1;

  const canMoveById = useMemo(() => {
    const map = new Map();
    categories.forEach((item, index) => {
      map.set(item.id_category, {
        canUp: index > 0,
        canDown: index < categories.length - 1,
      });
    });
    return map;
  }, [categories]);

  const openCreateForm = () => {
    setSelectedCategory(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setSelectedCategory(category);
    setFormData({
      category_name_spanish: category.category_name_spanish || "",
      category_name_english: category.category_name_english || "",
      category_name_french: category.category_name_french || "",
      order_visualization: category.order_visualization ?? 0,
      active: Boolean(category.active),
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCategory(null);
    setFormData(initialForm);
  };

  const saveCategory = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        order_visualization: Number(formData.order_visualization),
      };

      if (selectedCategory) {
        await updateAdminPackageCategory(selectedCategory.id_category, payload);
        showToast("La categoria se actualizo correctamente", "success");
      } else {
        await createAdminPackageCategory(payload);
        showToast("La categoria se creo correctamente", "success");
      }

      closeForm();
      await loadCategories();
    } catch (apiError) {
      const message = apiError.response?.data?.message || "No fue posible guardar la categoria.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (category, active) => {
    try {
      await updateAdminPackageCategoryStatus(category.id_category, active);
      showToast(active ? "Categoria activada" : "Categoria desactivada", "success");
      await loadCategories();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible actualizar el estado.", "error");
    }
  };

  const deleteCategory = async (category) => {
    try {
      await deleteAdminPackageCategory(category.id_category);
      showToast("Categoria eliminada correctamente", "success");
      await loadCategories();
    } catch (apiError) {
      showToast(
        apiError.response?.data?.message || "No puedes eliminar esta categoria porque tiene paquetes asociados.",
        "error"
      );
    }
  };

  const moveCategory = async (category, direction) => {
    const index = categories.findIndex((item) => item.id_category === category.id_category);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    const [row] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, row);

    const items = reordered.map((item, order) => ({
      id_category: item.id_category,
      order_visualization: order,
    }));

    try {
      await reorderAdminPackageCategories(items);
      await loadCategories();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible reordenar las categorias.", "error");
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">Categorias de paquetes</h1>
            <p className="mt-2 text-sm text-[var(--color-text)]">
              Gestiona nombres multidioma, estado y orden de visualizacion de las categorias.
            </p>
          </div>
          <div className="flex gap-2">
            <button className={primaryButtonClass} onClick={openCreateForm}>Crear categoria</button>
            <button className={outlineButtonClass} onClick={loadCategories}>Actualizar</button>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Filtros</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Busqueda
            <input
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.search}
              placeholder="Nombre en cualquier idioma"
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, search: e.target.value }));
                setPage(1);
              }}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.active}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, active: e.target.value }));
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Listado de categorias</h2>

        {loading ? (
          <LoadingSpinner message="Cargando categorias..." />
        ) : error ? (
          <DataError message={error} />
        ) : categories.length === 0 ? (
          <EmptyState text="No hay categorias para los filtros seleccionados." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)]">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-table-header)] text-[var(--color-text)]">
                    <th className="px-3 py-2 text-left">Nombre ES</th>
                    <th className="px-3 py-2 text-left">Nombre EN</th>
                    <th className="px-3 py-2 text-left">Nombre FR</th>
                    <th className="px-3 py-2 text-left">Orden</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                    <th className="px-3 py-2 text-left">Paquetes</th>
                    <th className="px-3 py-2 text-left">Actualizacion</th>
                    <th className="px-3 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const movement = canMoveById.get(category.id_category) || { canUp: false, canDown: false };

                    return (
                      <tr key={category.id_category} className="border-t border-[var(--color-primary)]/30">
                        <td className="px-3 py-2 font-semibold">{category.category_name_spanish}</td>
                        <td className="px-3 py-2 font-semibold">{category.category_name_english}</td>
                        <td className="px-3 py-2 font-semibold">{category.category_name_french}</td>
                        <td className="px-3 py-2 font-semibold">{category.order_visualization}</td>
                        <td className="px-3 py-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${category.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                            {category.active ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-semibold">{category.package_count}</td>
                        <td className="px-3 py-2 font-semibold">{new Date(category.updated_at).toLocaleString("es-CO")}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            <button className={outlineButtonClass} onClick={() => openEditForm(category)}>Ver</button>
                            <button className={outlineButtonClass} onClick={() => openEditForm(category)}>Editar</button>
                            <button className={outlineButtonClass} onClick={() => changeStatus(category, !category.active)}>
                              {category.active ? "Desactivar" : "Activar"}
                            </button>
                            <button className={outlineButtonClass} disabled={!movement.canUp} onClick={() => moveCategory(category, "up")}>Subir</button>
                            <button className={outlineButtonClass} disabled={!movement.canDown} onClick={() => moveCategory(category, "down")}>Bajar</button>
                            <button className={outlineButtonClass} onClick={() => deleteCategory(category)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
          <div className="w-full max-w-2xl rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
              {selectedCategory ? "Editar categoria" : "Crear categoria"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)] sm:col-span-2">
                Nombre en espanol
                <input
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.category_name_spanish}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_name_spanish: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Nombre en ingles
                <input
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.category_name_english}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_name_english: e.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
                Nombre en frances
                <input
                  className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                  value={formData.category_name_french}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_name_french: e.target.value }))}
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
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] mt-6">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                />
                Categoria activa
              </label>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button className={outlineButtonClass} onClick={closeForm}>Cancelar</button>
              <button className={primaryButtonClass} onClick={saveCategory} disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
