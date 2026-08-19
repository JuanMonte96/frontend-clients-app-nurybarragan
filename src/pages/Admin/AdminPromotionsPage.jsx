import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  CircleOff,
  Gift,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { getAdminPackages } from "../../services/adminPackagesService";
import { getAdminUsersList } from "../../services/adminUsersService";
import {
  archiveAdminPromotion,
  createAdminPromotion,
  getAdminPromotions,
  markAdminBenefitUsed,
  updateAdminPromotion,
  updateAdminPromotionStatus,
} from "../../services/adminPromotionsService";

const sectionCardClass = "rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const ghostButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const iconButtonBaseClass = "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const inputClass = "w-full rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
const pageTagClass = "inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]";
const types = ["PERCENTAGE_DISCOUNT", "FIXED_AMOUNT_DISCOUNT", "NON_MONETARY"];

const initialForm = {
  name_spanish: "",
  name_english: "",
  name_french: "",
  description_spanish: "",
  description_english: "",
  description_french: "",
  promotion_type: "PERCENTAGE_DISCOUNT",
  discount_percentage: "",
  discount_amount_minor: "",
  currency: "eur",
  benefit_code: "",
  is_active: false,
  first_purchase_only: true,
  applies_to_all_packages: false,
  priority: 0,
  starts_at: "",
  ends_at: "",
  package_ids: [],
};

const isMonetaryType = (promotionType) => promotionType === "PERCENTAGE_DISCOUNT" || promotionType === "FIXED_AMOUNT_DISCOUNT";
const typeLabel = (type, t) => t(`promotions.types.${type}`);
const localizedValue = (promotion, field, language) => promotion?.[`${field}_${language}`] || promotion?.[`${field}_spanish`] || "";

const formatDate = (value, t) => {
  if (!value) return t("promotions.unlimited");
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const packagesLabel = (promotion, t) => {
  if (promotion.applies_to_all_packages) return t("promotions.allPackages");
  const names = (promotion.packages || []).map((item) => item.name_package);
  return names.length > 0 ? names.join(", ") : t("promotions.noPackages");
};

const IconActionButton = ({ icon: Icon, label, variant = "neutral", onClick, disabled = false }) => {
  const styles = {
    neutral: "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100",
    primary: "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20",
    view: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    edit: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`${iconButtonBaseClass} ${styles[variant] ?? styles.neutral}`}
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
      checked ? "border-emerald-300 bg-emerald-500/10 text-emerald-700" : "border-slate-300 bg-slate-100 text-slate-600"
    } ${disabled ? "opacity-60" : "hover:scale-[1.01]"}`}
  >
    <span className="relative flex h-6 w-11 items-center rounded-full bg-white/70 p-0.5 shadow-inner ring-1 ring-inset ring-black/5">
      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </span>
    <span className="inline-flex items-center gap-1">
      {checked ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {checked ? onLabel : offLabel}
    </span>
  </button>
);

function Modal({ title, description, onClose, children, footer }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`${sectionCardClass} w-full max-w-5xl max-h-[92vh] overflow-y-auto p-0`} onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className={pageTagClass}>
                <Gift size={14} /> {title}
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text)]">{description}</p>
            </div>
            <button type="button" className={ghostButtonClass} onClick={onClose}>
              <X size={16} /> {t("common.close")}
            </button>
          </div>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="border-t border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}

function Field({ label, helper, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-semibold text-[var(--color-text)] ${className}`}>
      <span>{label}</span>
      {helper ? <span className="text-xs font-normal text-[var(--color-text)]/70">{helper}</span> : null}
      {children}
    </label>
  );
}

export default function AdminPromotionsPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [promotions, setPromotions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState({ open: false, editing: null, data: initialForm });
  const [benefitModal, setBenefitModal] = useState({ open: false, promotion: null, id_user: "", id_package: "" });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [promotionResponse, packageResponse, userResponse] = await Promise.all([
        getAdminPromotions(),
        getAdminPackages({ page: 1, limit: 1000, sort_by: "name_package", sort_order: "ASC" }),
        getAdminUsersList({ page: 1, limit: 500, sort_by: "name_user", sort_order: "ASC" }),
      ]);
      setPromotions(promotionResponse.promotions || []);
      setPackages(packageResponse.packages || []);
      setUsers((userResponse.users || []).filter((user) => user.role === "student"));
    } catch (apiError) {
      setError(apiError.response?.data?.message || t("promotions.errors.load"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visiblePromotions = useMemo(
    () =>
      promotions.filter((promotion) => {
        const searchableText = isMonetaryType(promotion.promotion_type)
          ? packagesLabel(promotion, t)
          : [promotion.name_spanish, promotion.name_english, promotion.name_french, promotion.description_spanish, promotion.description_english, promotion.description_french]
              .filter(Boolean)
              .join(" ");
        const matchesSearch = !search.trim() || searchableText.toLowerCase().includes(search.trim().toLowerCase());
        const matchesType = filterType === "all" || promotion.promotion_type === filterType;
        const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? promotion.is_active : !promotion.is_active);
        return matchesSearch && matchesType && matchesStatus;
      }),
    [filterStatus, filterType, promotions, search, t]
  );

  const stats = useMemo(
    () => ({
      total: promotions.length,
      active: promotions.filter((promotion) => promotion.is_active).length,
      monetary: promotions.filter((promotion) => isMonetaryType(promotion.promotion_type)).length,
      benefits: promotions.filter((promotion) => promotion.promotion_type === "NON_MONETARY").length,
    }),
    [promotions]
  );

  const openCreate = () => setForm({ open: true, editing: null, data: { ...initialForm } });

  const openEdit = (promotion) =>
    setForm({
      open: true,
      editing: promotion,
      data: {
        ...initialForm,
        ...promotion,
        package_ids: (promotion.packages || []).map((item) => item.id_package),
        discount_percentage: promotion.discount_percentage ?? "",
        discount_amount_minor: promotion.discount_amount_minor ?? "",
        starts_at: promotion.starts_at ? String(promotion.starts_at).slice(0, 16) : "",
        ends_at: promotion.ends_at ? String(promotion.ends_at).slice(0, 16) : "",
      },
    });

  const closeForm = () => setForm({ open: false, editing: null, data: initialForm });

  const savePromotion = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form.data,
        discount_percentage: form.data.promotion_type === "PERCENTAGE_DISCOUNT" && form.data.discount_percentage !== "" ? Number(form.data.discount_percentage) : null,
        discount_amount_minor: form.data.promotion_type === "FIXED_AMOUNT_DISCOUNT" && form.data.discount_amount_minor !== "" ? Number(form.data.discount_amount_minor) : null,
        priority: Number(form.data.priority || 0),
        starts_at: form.data.starts_at || null,
        ends_at: form.data.ends_at || null,
      };
      if (form.editing) await updateAdminPromotion(form.editing.id_promotion, payload);
      else await createAdminPromotion(payload);
      showToast(t("promotions.messages.saved"), "success");
      closeForm();
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || t("promotions.errors.save"), "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePromotion = async (promotion) => {
    try {
      await updateAdminPromotionStatus(promotion.id_promotion, !promotion.is_active);
      showToast(t("promotions.messages.status"), "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || t("promotions.errors.status"), "error");
    }
  };

  const archivePromotion = async (promotion) => {
    try {
      await archiveAdminPromotion(promotion.id_promotion);
      showToast(t("promotions.messages.archived"), "success");
      await loadData();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || t("promotions.errors.archive"), "error");
    }
  };

  const closeBenefitModal = () => setBenefitModal({ open: false, promotion: null, id_user: "", id_package: "" });

  const markBenefitUsed = async () => {
    setSaving(true);
    try {
      await markAdminBenefitUsed(benefitModal.promotion.id_promotion, {
        id_user: benefitModal.id_user,
        id_package: benefitModal.id_package,
      });
      showToast(t("promotions.messages.benefitUsed"), "success");
      closeBenefitModal();
    } catch (apiError) {
      showToast(apiError.response?.data?.message || t("promotions.errors.benefitUsed"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className={`${sectionCardClass} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className={pageTagClass}>
              <Gift size={14} /> {t("promotions.tag")}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">{t("promotions.title")}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text)]">{t("promotions.subtitle")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={primaryButtonClass} onClick={openCreate}>
              <Plus size={16} /> {t("promotions.create")}
            </button>
            <button type="button" className={ghostButtonClass} onClick={loadData}>
              <RefreshCw size={16} /> {t("promotions.refresh")}
            </button>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t("promotions.stats.total"), stats.total],
            [t("promotions.stats.active"), stats.active],
            [t("promotions.stats.monetary"), stats.monetary],
            [t("promotions.stats.benefits"), stats.benefits],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text)]">{label}</p>
              <p className="mt-2 text-3xl font-black text-[var(--color-text)]">{value}</p>
            </article>
          ))}
        </div>
      </header>

      <section className={`${sectionCardClass} p-5`}>
        <div className="grid gap-3 lg:grid-cols-3">
          <Field label={t("promotions.filters.search")}>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text)]/60" />
              <input className={`${inputClass} pl-10`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("promotions.filters.searchPlaceholder")} />
            </div>
          </Field>
          <Field label={t("promotions.filters.type")}>
            <select className={inputClass} value={filterType} onChange={(event) => setFilterType(event.target.value)}>
              <option value="all">{t("promotions.filters.all")}</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type, t)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("promotions.filters.status")}>
            <select className={inputClass} value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="all">{t("promotions.filters.all")}</option>
              <option value="active">{t("promotions.status.active")}</option>
              <option value="inactive">{t("promotions.status.inactive")}</option>
            </select>
          </Field>
        </div>
      </section>

      <section className={sectionCardClass}>
        <div className="border-b border-[var(--color-primary)]/20 p-5">
          <h2 className="text-xl font-bold text-[var(--color-text)]">{t("promotions.listTitle")}</h2>
          <p className="mt-1 text-sm text-[var(--color-text)]">{t("promotions.listSubtitle")}</p>
        </div>
        <div className="p-4">
          {loading ? (
            <LoadingSpinner message={t("common.loading")} />
          ) : error ? (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : visiblePromotions.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-8 text-center text-sm text-[var(--color-text)]">{t("promotions.empty")}</div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {visiblePromotions.map((promotion) => {
                const monetary = isMonetaryType(promotion.promotion_type);
                return (
                  <article key={promotion.id_promotion} className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[var(--color-text)]">
                            {localizedValue(promotion, "name", i18n.language)}
                          </h3>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${promotion.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                            {promotion.is_active ? t("promotions.status.active") : t("promotions.status.inactive")}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text)]">{typeLabel(promotion.promotion_type, t)}</p>
                        {monetary ? null : <p className="mt-2 text-sm text-[var(--color-text)]">{localizedValue(promotion, "description", i18n.language)}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <IconActionButton icon={PencilLine} label={t("common.edit")} variant="edit" onClick={() => openEdit(promotion)} />
                        <IconActionButton
                          icon={promotion.is_active ? CircleOff : Check}
                          label={promotion.is_active ? t("promotions.actions.deactivate") : t("promotions.actions.activate")}
                          variant={promotion.is_active ? "danger" : "view"}
                          onClick={() => togglePromotion(promotion)}
                        />
                        <IconActionButton icon={Archive} label={t("promotions.actions.archive")} variant="neutral" onClick={() => archivePromotion(promotion)} />
                        {promotion.promotion_type === "NON_MONETARY" ? (
                          <IconActionButton
                            icon={UserCheck}
                            label={t("promotions.actions.markUsed")}
                            variant="primary"
                            onClick={() => setBenefitModal({ open: true, promotion, id_user: "", id_package: "" })}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">{t("promotions.fields.discount")}</p>
                        <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                          {promotion.promotion_type === "PERCENTAGE_DISCOUNT"
                            ? `${promotion.discount_percentage}%`
                            : promotion.promotion_type === "FIXED_AMOUNT_DISCOUNT"
                              ? `${promotion.discount_amount_minor / 100} ${String(promotion.currency || "eur").toUpperCase()}`
                              : t("promotions.nonMonetary")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">{t("promotions.fields.packages")}</p>
                        <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                          {monetary ? packagesLabel(promotion, t) : t("promotions.notLinkedToPackage")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">{t("promotions.fields.validity")}</p>
                        <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                          {formatDate(promotion.starts_at, t)} - {formatDate(promotion.ends_at, t)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {form.open ? (
        <PromotionForm
          form={form.data}
          editing={form.editing}
          packages={packages}
          saving={saving}
          t={t}
          onChange={(data) => setForm((previous) => ({ ...previous, data }))}
          onClose={closeForm}
          onSave={savePromotion}
        />
      ) : null}

      {benefitModal.open ? (
        <Modal
          title={t("promotions.benefitModal.title")}
          description={t("promotions.benefitModal.description")}
          onClose={closeBenefitModal}
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" className={ghostButtonClass} onClick={closeBenefitModal}>
                {t("common.cancel")}
              </button>
              <button type="button" className={primaryButtonClass} disabled={saving || !benefitModal.id_user || !benefitModal.id_package} onClick={markBenefitUsed}>
                {t("promotions.benefitModal.confirm")}
              </button>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("promotions.benefitModal.user")}>
              <select className={inputClass} value={benefitModal.id_user} onChange={(event) => setBenefitModal((previous) => ({ ...previous, id_user: event.target.value }))}>
                <option value="">{t("promotions.benefitModal.selectUser")}</option>
                {users.map((user) => (
                  <option key={user.id_user} value={user.id_user}>
                    {user.name_user} · {user.email_user}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("promotions.benefitModal.package")}>
              <select className={inputClass} value={benefitModal.id_package} onChange={(event) => setBenefitModal((previous) => ({ ...previous, id_package: event.target.value }))}>
                <option value="">{t("promotions.benefitModal.selectPackage")}</option>
                {packages.map((item) => (
                  <option key={item.id_package} value={item.id_package}>
                    {item.name_package}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}

function PromotionForm({ form, editing, packages, saving, t, onChange, onClose, onSave }) {
  const update = (key, value) => onChange({ ...form, [key]: value });
  const isNonMonetary = form.promotion_type === "NON_MONETARY";
  const nameHelper = isNonMonetary ? t("promotions.form.nameHintNonMonetary") : t("promotions.form.nameHintMonetary");
  const descriptionHelper = isNonMonetary ? t("promotions.form.descriptionHintNonMonetary") : t("promotions.form.descriptionHintMonetary");

  const togglePackage = (id_package, checked) => {
    update("package_ids", checked ? [...form.package_ids, id_package] : form.package_ids.filter((id) => id !== id_package));
  };

  return (
    <Modal
      title={editing ? t("promotions.form.editTitle") : t("promotions.form.createTitle")}
      description={t("promotions.form.description")}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            {t("common.cancel")}
          </button>
          <button type="button" className={primaryButtonClass} disabled={saving} onClick={onSave}>
            {saving ? t("promotions.form.saving") : t("common.save")}
          </button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Field label={t("promotions.form.nameEs")} helper={nameHelper}>
          <input className={inputClass} value={form.name_spanish} onChange={(event) => update("name_spanish", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.nameEn")}>
          <input className={inputClass} value={form.name_english} onChange={(event) => update("name_english", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.nameFr")}>
          <input className={inputClass} value={form.name_french} onChange={(event) => update("name_french", event.target.value)} />
        </Field>

        <Field label={t("promotions.form.descriptionEs")} helper={descriptionHelper} className="lg:col-span-3">
          <textarea className={`${inputClass} min-h-24`} value={form.description_spanish} onChange={(event) => update("description_spanish", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.descriptionEn")} className="lg:col-span-3">
          <textarea className={`${inputClass} min-h-24`} value={form.description_english} onChange={(event) => update("description_english", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.descriptionFr")} className="lg:col-span-3">
          <textarea className={`${inputClass} min-h-24`} value={form.description_french} onChange={(event) => update("description_french", event.target.value)} />
        </Field>

        <Field label={t("promotions.form.type")}>
          <select
            className={inputClass}
            value={form.promotion_type}
            onChange={(event) => {
              const nextType = event.target.value;
              onChange({
                ...form,
                promotion_type: nextType,
                // Las promociones no monetarias nunca quedan ancladas a paquetes.
                ...(nextType === "NON_MONETARY" ? { applies_to_all_packages: false, package_ids: [] } : {}),
              });
            }}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {typeLabel(type, t)}
              </option>
            ))}
          </select>
        </Field>

        {form.promotion_type === "PERCENTAGE_DISCOUNT" ? (
          <Field label={t("promotions.form.percentage")}>
            <input type="number" min="0.01" max="99.99" step="0.01" className={inputClass} value={form.discount_percentage} onChange={(event) => update("discount_percentage", event.target.value)} />
          </Field>
        ) : null}

        {form.promotion_type === "FIXED_AMOUNT_DISCOUNT" ? (
          <>
            <Field label={t("promotions.form.amountMinor")}>
              <input type="number" min="1" className={inputClass} value={form.discount_amount_minor} onChange={(event) => update("discount_amount_minor", event.target.value)} />
            </Field>
            <Field label={t("promotions.form.currency")}>
              <input className={inputClass} value={form.currency} maxLength={3} onChange={(event) => update("currency", event.target.value.toLowerCase())} />
            </Field>
          </>
        ) : null}

        {isNonMonetary ? (
          <Field label={t("promotions.form.benefitCode")}>
            <input className={inputClass} value={form.benefit_code} onChange={(event) => update("benefit_code", event.target.value)} />
          </Field>
        ) : null}

        <Field label={t("promotions.form.startsAt")}>
          <input type="datetime-local" className={inputClass} value={form.starts_at} onChange={(event) => update("starts_at", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.endsAt")}>
          <input type="datetime-local" className={inputClass} value={form.ends_at} onChange={(event) => update("ends_at", event.target.value)} />
        </Field>
        <Field label={t("promotions.form.priority")}>
          <input type="number" min="0" className={inputClass} value={form.priority} onChange={(event) => update("priority", event.target.value)} />
        </Field>

        <div className="lg:col-span-3">
          <p className="mb-2 text-sm font-semibold text-[var(--color-text)]">{t("promotions.form.packages")}</p>
          {isNonMonetary ? (
            <p className="rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text)]">
              {t("promotions.form.nonMonetaryNoPackages")}
            </p>
          ) : (
            <>
              <div className="mb-3">
                <ToggleSwitch
                  checked={form.applies_to_all_packages}
                  onChange={(nextValue) => update("applies_to_all_packages", nextValue)}
                  onLabel={t("promotions.allPackages")}
                  offLabel={t("promotions.form.specificPackages")}
                />
              </div>
              {!form.applies_to_all_packages ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((item) => (
                    <div key={item.id_package} className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-bg)] p-3">
                      <span className="truncate text-sm font-semibold text-[var(--color-text)]">{item.name_package}</span>
                      <ToggleSwitch
                        checked={form.package_ids.includes(item.id_package)}
                        onChange={(nextValue) => togglePackage(item.id_package, nextValue)}
                        onLabel={t("promotions.form.included")}
                        offLabel={t("promotions.form.notIncluded")}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:col-span-3">
          <ToggleSwitch checked={form.first_purchase_only} onChange={(nextValue) => update("first_purchase_only", nextValue)} onLabel={t("promotions.form.firstPurchase")} offLabel={t("promotions.form.firstPurchase")} />
        </div>
        <div className="flex items-center gap-3 lg:col-span-3">
          <ToggleSwitch checked={form.is_active} onChange={(nextValue) => update("is_active", nextValue)} onLabel={t("promotions.form.active")} offLabel={t("promotions.status.inactive")} />
        </div>
      </div>
    </Modal>
  );
}
