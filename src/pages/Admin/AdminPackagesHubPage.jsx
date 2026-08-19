import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  GripVertical,
  Package,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { getCategoryName } from "../../utils/catalogI18n";
import {
  createAdminPackage,
  getAdminPackages,
  reorderAdminPackages,
  retryAdminPackageStripeSync,
  updateAdminPackage,
  updateAdminPackageAvailability,
} from "../../services/adminPackagesService";
import {
  createAdminPackageCategory,
  deleteAdminPackageCategory,
  getAdminPackageCategories,
  reorderAdminPackageCategories,
  updateAdminPackageCategory,
  updateAdminPackageCategoryStatus,
} from "../../services/adminPackageCategoriesService";

const initialCategoryForm = {
  category_name_spanish: "",
  category_name_english: "",
  category_name_french: "",
  order_visualization: 0,
  active: true,
};

const initialPackageForm = {
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

const sectionCardClass = "rounded-3xl border border-[var(--color-primary)]/50 bg-[var(--color-bg-secondary)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
const softCardClass = "rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-bg)] shadow-sm";
const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const ghostButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const iconButtonBaseClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const inputClass =
  "w-full rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-75";
const textareaClass = `${inputClass} min-h-[110px] resize-y`;
const selectClass = inputClass;

const toLower = (value) => String(value ?? "").toLowerCase().trim();

const sortByOrder = (left, right) => {
  const leftOrder = Number(left.order_visualization ?? 0);
  const rightOrder = Number(right.order_visualization ?? 0);
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return String(left.name_package ?? left.category_name_spanish ?? "").localeCompare(
    String(right.name_package ?? right.category_name_spanish ?? "")
  );
};

const moveItem = (items, fromId, toId, key) => {
  const list = [...items];
  const fromIndex = list.findIndex((item) => item[key] === fromId);
  const toIndex = list.findIndex((item) => item[key] === toId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return list;
  }

  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  return list;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const SectionHeader = ({ icon: Icon, title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-end sm:justify-between">
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
        <Icon size={14} />
        Paquetes
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text)]">{subtitle}</p>
      </div>
    </div>
    {actions}
  </div>
);

const StatCard = ({ label, value, icon: Icon, tone = "default" }) => {
  const tones = {
    default: "from-[var(--color-primary)]/15 to-[var(--color-gradient-button)]/10 text-[var(--color-primary)]",
    success: "from-emerald-500/15 to-emerald-400/10 text-emerald-600",
    warning: "from-amber-500/15 to-amber-400/10 text-amber-600",
    danger: "from-rose-500/15 to-rose-400/10 text-rose-600",
  };

  return (
    <article className={`rounded-3xl border border-[var(--color-primary)]/20 bg-gradient-to-br ${tones[tone]} p-4 shadow-sm`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text)]">{label}</p>
          <p className="mt-2 text-3xl font-black text-[var(--color-text)]">{value}</p>
        </div>
          <div className="rounded-2xl border border-white/50 bg-white/60 p-3 text-current shadow-sm backdrop-blur">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
};

const IconActionButton = ({ icon: Icon, label, variant = "neutral", onClick, disabled = false, className = "" }) => {
  const styles = {
    neutral: "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100",
    primary: "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20",
    view: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    edit: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100",
    refresh: "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`${iconButtonBaseClass} ${styles[variant] ?? styles.neutral} ${className}`}
    >
      <Icon size={16} />
      <span className="sr-only">{label}</span>
    </button>
  );
};

const ToggleSwitch = ({ checked, onChange, disabled = false, onLabel = "Activo", offLabel = "Inactivo" }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-semibold transition-all duration-300 ${
      checked
        ? "border-emerald-300 bg-emerald-500/10 text-emerald-700"
        : "border-slate-300 bg-slate-100 text-slate-600"
    } ${disabled ? "opacity-60" : "hover:scale-[1.01]"}`}
  >
    <span className="relative flex h-6 w-11 items-center rounded-full bg-white/70 p-0.5 shadow-inner ring-1 ring-inset ring-black/5">
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </span>
    <span className="inline-flex items-center gap-1">
      {checked ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {checked ? onLabel : offLabel}
    </span>
  </button>
);

const ModalShell = ({ title, subtitle, icon: Icon, onClose, children, footer, sizeClass = "max-w-4xl" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
    <div
      className={`modal-content ${sectionCardClass} ${sizeClass} w-full max-h-[92vh] overflow-y-auto p-0`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="border-b border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
              <Icon size={14} />
              {title}
            </div>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-text)]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-primary)]/10"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer ? <div className="border-t border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">{footer}</div> : null}
    </div>
  </div>
);

const TextField = ({ label, children, helper, className = "" }) => (
  <label className={`flex flex-col gap-2 text-sm font-semibold text-[var(--color-text)] ${className}`}>
    <span className="inline-flex items-center justify-between gap-2">
      <span>{label}</span>
      {helper ? <span className="text-xs font-medium text-[var(--color-text)]">{helper}</span> : null}
    </span>
    {children}
  </label>
);

function CategoryFormModal({ open, mode, category, saving, onClose, onSave }) {
  const readOnly = mode === "view";
  const [formData, setFormData] = useState(initialCategoryForm);

  useEffect(() => {
    if (!open) return;

    setFormData({
      category_name_spanish: category?.category_name_spanish || "",
      category_name_english: category?.category_name_english || "",
      category_name_french: category?.category_name_french || "",
      order_visualization: category?.order_visualization ?? 0,
      active: Boolean(category?.active ?? true),
    });
  }, [category, open]);

  if (!open) return null;

  return (
    <ModalShell
      title={readOnly ? "Ver categoría" : category ? "Editar categoría" : "Crear categoría"}
      subtitle="Define nombres multidioma, estado y orden visual de la categoría."
      icon={Tag}
      onClose={onClose}
      sizeClass="max-w-3xl"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            Cancelar
          </button>
          {!readOnly ? (
            <button type="button" className={primaryButtonClass} onClick={() => onSave(formData)} disabled={saving}>
              {saving ? "Guardando..." : category ? "Actualizar categoría" : "Crear categoría"}
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nombre en español" className="sm:col-span-2">
          <input
            className={inputClass}
            value={formData.category_name_spanish}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, category_name_spanish: event.target.value }))}
            placeholder="Ej. Planes para descubrirnos"
          />
        </TextField>

        <TextField label="Nombre en inglés">
          <input
            className={inputClass}
            value={formData.category_name_english}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, category_name_english: event.target.value }))}
            placeholder="Ej. Discover plans"
          />
        </TextField>

        <TextField label="Nombre en francés">
          <input
            className={inputClass}
            value={formData.category_name_french}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, category_name_french: event.target.value }))}
            placeholder="Ej. Plans découverte"
          />
        </TextField>

        <TextField label="Orden visual" helper="Se usa en el tablero y en el modal de ordenamiento.">
          <input
            type="number"
            min="0"
            className={inputClass}
            value={formData.order_visualization}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, order_visualization: event.target.value }))}
          />
        </TextField>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Estado</span>
          <ToggleSwitch
            checked={Boolean(formData.active)}
            disabled={readOnly}
            onChange={(nextValue) => setFormData((prev) => ({ ...prev, active: nextValue }))}
            onLabel="Activa"
            offLabel="Inactiva"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function PackageFormModal({
  open,
  mode,
  pkg,
  categories,
  saving,
  onClose,
  onSave,
  defaultCategoryId = "",
}) {
  const { i18n } = useTranslation();
  const readOnly = mode === "view";
  const [formData, setFormData] = useState(initialPackageForm);

  useEffect(() => {
    if (!open) return;

    setFormData({
      name_package: pkg?.name_package || "",
      description_spanish: pkg?.description_spanish || "",
      description_english: pkg?.description_english || "",
      description_french: pkg?.description_french || "",
      price_package: pkg?.price_package ?? "",
      duration_package: pkg?.duration_package ?? "",
      class_limit: pkg?.class_limit ?? "",
      is_recurrent: Boolean(pkg?.is_recurrent ?? false),
      availabilty: Boolean(pkg?.availabilty ?? true),
      id_category: pkg?.id_category || defaultCategoryId || categories[0]?.id_category || "",
      order_visualization: pkg?.order_visualization ?? 0,
      category: pkg?.category || "standard",
    });
  }, [categories, defaultCategoryId, open, pkg]);

  if (!open) return null;

  return (
    <ModalShell
      title={readOnly ? "Ver paquete" : pkg ? "Editar paquete" : "Crear paquete"}
      subtitle="Controla la información, la categoría principal, el estado comercial y la visibilidad del paquete."
      icon={Package}
      onClose={onClose}
      sizeClass="max-w-5xl"
      footer={
        <div className="flex flex-wrap justify-between gap-3">
          <p className="text-xs text-[var(--color-text)]">
            El orden se puede ajustar arrastrando cada bloque desde el tablero principal.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" className={ghostButtonClass} onClick={onClose}>
              Cancelar
            </button>
            {!readOnly ? (
              <button type="button" className={primaryButtonClass} onClick={() => onSave(formData)} disabled={saving}>
                {saving ? "Guardando..." : pkg ? "Actualizar paquete" : "Crear paquete"}
              </button>
            ) : null}
          </div>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Nombre del paquete" className="lg:col-span-2">
          <input
            className={inputClass}
            value={formData.name_package}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, name_package: event.target.value }))}
            placeholder="Ej. Premium Plus"
          />
        </TextField>

        <TextField label="Categoría principal">
          <select
            className={selectClass}
            value={formData.id_category}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, id_category: event.target.value }))}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id_category} value={category.id_category}>
                {getCategoryName(category, i18n.language)}
              </option>
            ))}
          </select>
        </TextField>

        <TextField label="Categoría legada">
          <select
            className={selectClass}
            value={formData.category}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="basics">basics</option>
            <option value="standard">standard</option>
            <option value="premium">premium</option>
          </select>
        </TextField>

        <TextField label="Precio">
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={formData.price_package}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, price_package: event.target.value }))}
          />
        </TextField>

        <TextField label="Duración en días">
          <input
            type="number"
            min="0"
            className={inputClass}
            value={formData.duration_package}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, duration_package: event.target.value }))}
          />
        </TextField>

        <TextField label="Límite de clases">
          <input
            type="number"
            min="0"
            className={inputClass}
            value={formData.class_limit}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, class_limit: event.target.value }))}
          />
        </TextField>

        <TextField label="Orden visual">
          <input
            type="number"
            min="0"
            className={inputClass}
            value={formData.order_visualization}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, order_visualization: event.target.value }))}
          />
        </TextField>

        <TextField label="Descripción en español" className="lg:col-span-2">
          <textarea
            className={textareaClass}
            value={formData.description_spanish}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, description_spanish: event.target.value }))}
          />
        </TextField>

        <TextField label="Descripción en inglés">
          <textarea
            className={textareaClass}
            value={formData.description_english}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, description_english: event.target.value }))}
          />
        </TextField>

        <TextField label="Descripción en francés">
          <textarea
            className={textareaClass}
            value={formData.description_french}
            disabled={readOnly}
            onChange={(event) => setFormData((prev) => ({ ...prev, description_french: event.target.value }))}
          />
        </TextField>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-bg)] p-4">
            <span className="text-sm font-semibold text-[var(--color-text)]">Disponible para venta</span>
            <ToggleSwitch
              checked={Boolean(formData.availabilty)}
              disabled={readOnly}
              onChange={(nextValue) => setFormData((prev) => ({ ...prev, availabilty: nextValue }))}
              onLabel="Disponible"
              offLabel="Oculto"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-bg)] p-4">
            <span className="text-sm font-semibold text-[var(--color-text)]">Recurrente</span>
            <ToggleSwitch
              checked={Boolean(formData.is_recurrent)}
              disabled={readOnly}
              onChange={(nextValue) => setFormData((prev) => ({ ...prev, is_recurrent: nextValue }))}
              onLabel="Sí"
              offLabel="No"
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function CategoryOrderModal({ open, categories, saving, onClose, onSave }) {
  const [draft, setDraft] = useState([]);
  const [draggingCategoryId, setDraggingCategoryId] = useState(null);

  useEffect(() => {
    if (!open) return;
    setDraft(categories.map((category, index) => ({ ...category, order_visualization: index })));
  }, [categories, open]);

  if (!open) return null;

  const moveCategory = (fromId, toId) => {
    setDraft((prev) => moveItem(prev, fromId, toId, "id_category"));
  };

  const shiftCategory = (categoryId, direction) => {
    setDraft((prev) => {
      const list = [...prev];
      const index = list.findIndex((item) => item.id_category === categoryId);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      return list;
    });
  };

  return (
    <ModalShell
      title="Ordenar categorías"
      subtitle="Arrastra los bloques o usa los controles de apoyo para dejar el orden final de visualización."
      icon={ArrowUpDown}
      onClose={onClose}
      sizeClass="max-w-4xl"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => onSave(draft)}
            disabled={saving || draft.length === 0}
          >
            {saving ? "Guardando..." : "Guardar orden"}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {draft.map((category, index) => (
          <div
            key={category.id_category}
            draggable
            onDragStart={() => setDraggingCategoryId(category.id_category)}
            onDragEnd={() => setDraggingCategoryId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingCategoryId && draggingCategoryId !== category.id_category) {
                moveCategory(draggingCategoryId, category.id_category);
              }
            }}
            className={`flex items-center gap-3 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 transition ${
              draggingCategoryId === category.id_category ? "opacity-60 ring-2 ring-[var(--color-primary)]/30" : ""
            }`}
          >
            <div className="flex items-center gap-3 text-[var(--color-text)]">
              <GripVertical size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[var(--color-text)]">{getCategoryName(category, "es")}</p>
              <p className="text-xs text-[var(--color-text)]">Orden actual: {category.order_visualization ?? index}</p>
            </div>
            <div className="flex items-center gap-1">
              <IconActionButton
                icon={ChevronUp}
                label="Subir categoría"
                variant="neutral"
                disabled={index === 0}
                onClick={() => shiftCategory(category.id_category, "up")}
                className="h-9 w-9"
              />
              <IconActionButton
                icon={ChevronDown}
                label="Bajar categoría"
                variant="neutral"
                disabled={index === draft.length - 1}
                onClick={() => shiftCategory(category.id_category, "down")}
                className="h-9 w-9"
              />
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

export default function AdminPackagesHubPage() {
  const { i18n } = useTranslation();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [defaultPackageCategoryId, setDefaultPackageCategoryId] = useState("");
  const [categoryOrderDraft, setCategoryOrderDraft] = useState([]);
  const [draggingPackage, setDraggingPackage] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [categoriesResponse, packagesResponse] = await Promise.all([
        getAdminPackageCategories({ limit: 500, sort_by: "order_visualization", sort_order: "ASC" }),
        getAdminPackages({ page: 1, limit: 1000, sort_by: "order_visualization", sort_order: "ASC" }),
      ]);

      setCategories(categoriesResponse.categories || []);
      setPackages(packagesResponse.packages || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "No fue posible cargar la informacion de paquetes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id_category, category])), [categories]);

  const sortedCategories = useMemo(
    () => [...categories].sort((left, right) => sortByOrder(left, right)),
    [categories]
  );

  const sortedPackages = useMemo(
    () => [...packages].sort((left, right) => {
      const leftCategory = String(left.id_category ?? "");
      const rightCategory = String(right.id_category ?? "");
      if (leftCategory !== rightCategory) return leftCategory.localeCompare(rightCategory);
      return sortByOrder(left, right);
    }),
    [packages]
  );

  const searchTerm = toLower(search);

  const visibleCategoryGroups = useMemo(() => {
    return sortedCategories
      .map((category) => {
        const categoryLabel = getCategoryName(category, i18n.language);
        const categoryText = toLower(
          [
            categoryLabel,
            category.category_name_spanish,
            category.category_name_english,
            category.category_name_french,
          ]
            .filter(Boolean)
            .join(" ")
        );

        const categoryPackages = sortedPackages
          .filter((pkg) => pkg.id_category === category.id_category)
          .sort(sortByOrder);

        const packageMatches = categoryPackages.filter((pkg) => {
          if (!searchTerm) return true;
          const packageText = toLower(
            [
              pkg.name_package,
              pkg.description_spanish,
              pkg.description_english,
              pkg.description_french,
              getCategoryName(categoryMap.get(pkg.id_category) || category, i18n.language),
            ]
              .filter(Boolean)
              .join(" ")
          );
          return packageText.includes(searchTerm);
        });

        const shouldShowAllPackages = !searchTerm || categoryText.includes(searchTerm);
        const visiblePackages = shouldShowAllPackages ? categoryPackages : packageMatches;

        return {
          category,
          categoryLabel,
          visiblePackages,
          totalPackages: categoryPackages.length,
        };
      })
      .filter((group) => {
        const categoryText = toLower(
          [
            group.categoryLabel,
            group.category.category_name_spanish,
            group.category.category_name_english,
            group.category.category_name_french,
          ]
            .filter(Boolean)
            .join(" ")
        );
        return !searchTerm || categoryText.includes(searchTerm) || group.visiblePackages.length > 0;
      });
  }, [categoryMap, i18n.language, searchTerm, sortedCategories, sortedPackages]);

  const orphanPackages = useMemo(
    () =>
      sortedPackages
        .filter((pkg) => !pkg.id_category || !categoryMap.has(pkg.id_category))
        .filter((pkg) => {
          if (!searchTerm) return true;
          return toLower(
            [pkg.name_package, pkg.description_spanish, pkg.description_english, pkg.description_french].filter(Boolean).join(" ")
          ).includes(searchTerm);
        }),
    [categoryMap, searchTerm, sortedPackages]
  );

  const indicators = useMemo(() => {
    return {
      categories: sortedCategories.length,
      packages: sortedPackages.length,
      activeCategories: sortedCategories.filter((category) => Boolean(category.active)).length,
      availablePackages: sortedPackages.filter((pkg) => Boolean(pkg.availabilty)).length,
      stripeAlerts: sortedPackages.filter((pkg) => pkg.stripe_sync_status !== "synced").length,
    };
  }, [sortedCategories, sortedPackages]);

  const openCategoryForm = (category = null) => {
    setSelectedCategory(category);
    setActiveModal(category ? "category-form" : "category-form");
  };

  const openCategoryView = (category) => {
    setSelectedCategory(category);
    setActiveModal("category-view");
  };

  const openPackageForm = (pkg = null, defaultCategoryId = "") => {
    setSelectedPackage(pkg);
    setDefaultPackageCategoryId(defaultCategoryId);
    setActiveModal("package-form");
  };

  const openPackageView = (pkg) => {
    setSelectedPackage(pkg);
    setActiveModal("package-view");
  };

  const openCategoryOrder = () => {
    setCategoryOrderDraft(sortedCategories.map((category, index) => ({ ...category, order_visualization: index })));
    setActiveModal("category-order");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCategory(null);
    setSelectedPackage(null);
    setDefaultPackageCategoryId("");
    setCategoryOrderDraft([]);
    setDraggingPackage(null);
  };

  const persistCategory = async (formData) => {
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

      closeModal();
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible guardar la categoria.", "error");
    } finally {
      setSaving(false);
    }
  };

  const persistCategoryOrder = async (draftCategories) => {
    setSaving(true);
    try {
      const items = draftCategories.map((category, index) => ({
        id_category: category.id_category,
        order_visualization: index,
      }));
      await reorderAdminPackageCategories(items);
      showToast("El orden de las categorias se actualizo correctamente", "success");
      closeModal();
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible reordenar las categorias.", "error");
    } finally {
      setSaving(false);
    }
  };

  const persistPackage = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price_package: Number(formData.price_package),
        duration_package: Number(formData.duration_package),
        class_limit: formData.class_limit === "" ? null : Number(formData.class_limit),
        order_visualization: Number(formData.order_visualization),
      };

      if (!payload.id_category) {
        throw new Error("Selecciona una categoría principal para el paquete.");
      }

      if (selectedPackage) {
        const data = await updateAdminPackage(selectedPackage.id_package, payload);
        showToast(data.stripe_message || "El paquete se actualizo correctamente", "success");
      } else {
        await createAdminPackage(payload);
        showToast("El paquete se creo correctamente", "success");
      }

      closeModal();
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || apiError.message || "No fue posible guardar el paquete.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryStatus = async (category, nextValue) => {
    try {
      await updateAdminPackageCategoryStatus(category.id_category, nextValue);
      showToast(nextValue ? "Categoria activada" : "Categoria desactivada", "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible actualizar el estado.", "error");
    }
  };

  const deleteCategory = async (category) => {
    try {
      await deleteAdminPackageCategory(category.id_category);
      showToast("Categoria eliminada correctamente", "success");
      await loadData();
    } catch (apiError) {
      showToast(
        apiError.response?.data?.message || "No puedes eliminar esta categoria porque tiene paquetes asociados.",
        "error"
      );
    }
  };

  const togglePackageAvailability = async (pkg) => {
    try {
      await updateAdminPackageAvailability(pkg.id_package, !pkg.availabilty);
      showToast(pkg.availabilty ? "Paquete desactivado" : "Paquete activado", "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible actualizar la disponibilidad.", "error");
    }
  };

  const retryStripe = async (pkg) => {
    try {
      const data = await retryAdminPackageStripeSync(pkg.id_package);
      showToast(data.message || "Sincronizacion ejecutada", "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible sincronizar con Stripe.", "error");
    }
  };

  const persistPackageOrder = async (categoryId, orderedPackages) => {
    if (!categoryId || orderedPackages.length === 0) return;

    setSaving(true);
    try {
      const items = orderedPackages.map((item, index) => ({
        id_package: item.id_package,
        order_visualization: index,
      }));
      await reorderAdminPackages(categoryId, items);
      showToast("El orden de los paquetes se actualizo correctamente", "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || "No fue posible reordenar los paquetes.", "error");
    } finally {
      setSaving(false);
      setDraggingPackage(null);
    }
  };

  const movePackageWithinCategory = (categoryId, fromPackageId, toPackageId) => {
    const categoryPackages = sortedPackages
      .filter((pkg) => pkg.id_category === categoryId)
      .sort(sortByOrder);

    const reordered = moveItem(categoryPackages, fromPackageId, toPackageId, "id_package");
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id_category !== categoryId) return pkg;
        const index = reordered.findIndex((item) => item.id_package === pkg.id_package);
        if (index === -1) return pkg;
        return { ...pkg, order_visualization: index };
      })
    );
    void persistPackageOrder(categoryId, reordered);
  };

  const appendDraggedPackageToCategory = (categoryId) => {
    if (!draggingPackage || draggingPackage.categoryId !== categoryId) return;

    const categoryPackages = sortedPackages
      .filter((pkg) => pkg.id_category === categoryId)
      .sort(sortByOrder);
    const draggedPackage = categoryPackages.find((item) => item.id_package === draggingPackage.packageId);
    if (!draggedPackage) return;

    const reordered = [...categoryPackages.filter((item) => item.id_package !== draggingPackage.packageId), draggedPackage];
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id_category !== categoryId) return pkg;
        const index = reordered.findIndex((item) => item.id_package === pkg.id_package);
        if (index === -1) return pkg;
        return { ...pkg, order_visualization: index };
      })
    );
    void persistPackageOrder(categoryId, reordered);
  };

  const renderPackageCard = (pkg, categoryId) => {
    const category = categoryMap.get(pkg.id_category);
    const stripeTone = pkg.stripe_sync_status === "synced" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700";

    return (
      <article
        key={pkg.id_package}
        draggable={!saving}
        onDragStart={() => setDraggingPackage({ categoryId, packageId: pkg.id_package })}
        onDragEnd={() => setDraggingPackage(null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => movePackageWithinCategory(categoryId, draggingPackage?.packageId, pkg.id_package)}
        className={`group rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
          draggingPackage?.packageId === pkg.id_package ? "opacity-60 ring-2 ring-[var(--color-primary)]/30" : ""
        } ${saving ? "pointer-events-none" : "cursor-grab"}`}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
            <GripVertical size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-lg font-bold text-[var(--color-text)]">{pkg.name_package}</h4>
                <p className="mt-1 text-xs text-[var(--color-text)]">
                  {category ? getCategoryName(category, i18n.language) : "Sin categoría"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <IconActionButton icon={Eye} label="Ver paquete" variant="view" onClick={() => openPackageView(pkg)} />
                <IconActionButton icon={PencilLine} label="Editar paquete" variant="edit" onClick={() => openPackageForm(pkg, pkg.id_category)} />
                <IconActionButton icon={RefreshCw} label="Reintentar Stripe" variant="refresh" onClick={() => retryStripe(pkg)} />
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text)]">Precio</p>
                  <p className="mt-1 font-bold text-[var(--color-text)]">EUR {pkg.price_package}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text)]">Duración</p>
                  <p className="mt-1 font-bold text-[var(--color-text)]">{pkg.duration_package} días</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text)]">Límite</p>
                  <p className="mt-1 font-bold text-[var(--color-text)]">{pkg.class_limit ?? "-"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text)]">Stripe</p>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${stripeTone}`}>
                  {pkg.stripe_sync_status === "synced" ? "Sincronizado" : "Pendiente"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ToggleSwitch
                checked={Boolean(pkg.availabilty)}
                onChange={() => togglePackageAvailability(pkg)}
                onLabel="Disponible"
                offLabel="Oculto"
              />
              <span className="text-xs font-medium text-[var(--color-text)]">
                Orden visual: {pkg.order_visualization ?? 0}
              </span>
              <span className="text-xs font-medium text-[var(--color-text)]">
                Creado: {formatDate(pkg.created_at)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="space-y-6">
      <header className={`${sectionCardClass} overflow-hidden`}>
        <SectionHeader
          icon={Package}
          title="Paquetes y categorías"
          subtitle="Gestiona ambas entidades en una sola pantalla, con los paquetes anidados dentro de cada categoría y orden visual interactivo."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={ghostButtonClass} onClick={openCategoryOrder} disabled={saving || sortedCategories.length === 0}>
                <ArrowUpDown size={16} />
                Ordenar categorías
              </button>
              <button type="button" className={ghostButtonClass} onClick={() => openCategoryForm(null)} disabled={saving}>
                <Tag size={16} />
                Crear categoría
              </button>
              <button
                type="button"
                className={primaryButtonClass}
                onClick={() => openPackageForm(null, sortedCategories[0]?.id_category || "")}
                disabled={saving || sortedCategories.length === 0}
              >
                <Plus size={16} />
                Crear paquete
              </button>
              <button type="button" className={ghostButtonClass} onClick={loadData} disabled={saving || loading}>
                <RefreshCw size={16} />
                Actualizar
              </button>
            </div>
          }
        />

        <div className="grid gap-3 border-t border-[var(--color-primary)]/20 p-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Categorías" value={indicators.categories} icon={Tag} />
          <StatCard label="Paquetes" value={indicators.packages} icon={Package} />
          <StatCard label="Categorías activas" value={indicators.activeCategories} icon={ToggleRight} tone="success" />
          <StatCard label="Disponibles" value={indicators.availablePackages} icon={ToggleRight} tone="success" />
          <StatCard label="Alertas Stripe" value={indicators.stripeAlerts} icon={RefreshCw} tone="warning" />
        </div>
      </header>

      <section className={sectionCardClass}>
        <div className="flex flex-col gap-3 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Buscar dentro del tablero</h2>
            <p className="mt-1 text-sm text-[var(--color-text)]">
              Filtra categorías y paquetes sin salir de la vista principal.
            </p>
          </div>
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text)]" size={18} />
            <input
              className={`${inputClass} pl-11`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar categoría, paquete o descripción..."
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <LoadingSpinner message="Cargando paquetes y categorías..." />
          </div>
        ) : error ? (
          <div className="p-5">
            <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          </div>
        ) : sortedCategories.length === 0 ? (
          <div className="p-5">
            <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-6 text-center text-sm text-[var(--color-text)]">
              No hay categorías registradas. Crea una categoría para empezar a organizar los paquetes.
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5">
            {visibleCategoryGroups.map(({ category, categoryLabel, visiblePackages, totalPackages }) => (
              <article
                key={category.id_category}
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  category.active
                    ? "border-[var(--color-primary)]/20 bg-[var(--color-bg)]"
                    : "border-slate-300 bg-slate-50/80"
                }`}
              >
                <div className="flex flex-col gap-4 border-b border-[var(--color-primary)]/10 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-[var(--color-text)]">{categoryLabel}</h3>
                      <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                        Orden {category.order_visualization ?? 0}
                      </span>
                      <span className="rounded-full bg-[var(--color-bg-secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text)]">
                        {totalPackages} paquetes
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text)]">
                      <span>ES: {category.category_name_spanish || "-"}</span>
                      <span>EN: {category.category_name_english || "-"}</span>
                      <span>FR: {category.category_name_french || "-"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <ToggleSwitch
                      checked={Boolean(category.active)}
                      onChange={(nextValue) => toggleCategoryStatus(category, nextValue)}
                      onLabel="Activa"
                      offLabel="Inactiva"
                    />
                    <IconActionButton icon={Eye} label="Ver categoría" variant="view" onClick={() => openCategoryView(category)} />
                    <IconActionButton icon={PencilLine} label="Editar categoría" variant="edit" onClick={() => openCategoryForm(category)} />
                    <IconActionButton icon={Trash2} label="Eliminar categoría" variant="danger" onClick={() => deleteCategory(category)} />
                    <button
                      type="button"
                      className={ghostButtonClass}
                      onClick={() => openPackageForm(null, category.id_category)}
                      disabled={saving}
                    >
                      <Plus size={16} />
                      Nuevo paquete
                    </button>
                  </div>
                </div>

                <div
                  className="space-y-3 p-4"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => appendDraggedPackageToCategory(category.id_category)}
                >
                  {visiblePackages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[var(--color-primary)]/30 bg-[var(--color-bg-secondary)] px-4 py-8 text-center text-sm text-[var(--color-text)]">
                      No hay paquetes que coincidan con el filtro dentro de esta categoría.
                    </div>
                  ) : (
                    visiblePackages.map((pkg) => renderPackageCard(pkg, category.id_category))
                  )}
                </div>
              </article>
            ))}

            {orphanPackages.length > 0 ? (
              <article className="overflow-hidden rounded-3xl border border-amber-300 bg-amber-50/80">
                <div className="border-b border-amber-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-amber-800">Paquetes sin categoría válida</h3>
                      <p className="text-sm text-amber-700">
                        Estos paquetes no tienen una categoría asociada en la base de datos actual.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  {orphanPackages.map((pkg) => renderPackageCard(pkg, pkg.id_category || ""))}
                </div>
              </article>
            ) : null}
          </div>
        )}
      </section>

      <CategoryFormModal
        open={activeModal === "category-form" || activeModal === "category-view"}
        mode={activeModal === "category-view" ? "view" : "edit"}
        category={selectedCategory}
        saving={saving}
        onClose={closeModal}
        onSave={persistCategory}
      />

      <PackageFormModal
        open={activeModal === "package-form" || activeModal === "package-view"}
        mode={activeModal === "package-view" ? "view" : "edit"}
        pkg={selectedPackage}
        categories={sortedCategories}
        saving={saving}
        defaultCategoryId={defaultPackageCategoryId}
        onClose={closeModal}
        onSave={persistPackage}
      />

      <CategoryOrderModal
        open={activeModal === "category-order"}
        categories={categoryOrderDraft}
        saving={saving}
        onClose={closeModal}
        onSave={persistCategoryOrder}
      />
    </section>
  );
}
