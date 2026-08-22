import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, CalendarRange, CreditCard, Search, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getAdminUserDetail,
  getAdminUsersList,
  getMedicalCertificateViewUrl,
  setAdminUserBlockStatus,
} from "../../services/adminUsersService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(number);
};

const EmptyState = ({ text }) => (
  <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-6 text-center text-sm text-[var(--color-text)] shadow-sm">
    {text}
  </div>
);

const DataError = ({ message }) => (
  <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
    {message}
  </div>
);

const AccordionSection = ({ title, children, isOpen, onToggle }) => (
  <section className="overflow-hidden rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[var(--color-primary)]/5"
    >
      <h3 className="text-base font-bold text-[var(--color-text)]">{title}</h3>
      <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--color-text)]">
        {isOpen ? "Ocultar" : "Mostrar"}
      </span>
    </button>
    {isOpen && <div className="border-t border-[var(--color-primary)]/10 p-4 sm:p-5">{children}</div>}
  </section>
);

const sectionCardClass = "rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const clearFiltersButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-rose-300 bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const compactPrimaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const ghostButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const inputClass = "w-full rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
const selectClass = "rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
const pageTagClass = "inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]";

export const AdminUsersPage = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [usersResponse, setUsersResponse] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [openingCertificate, setOpeningCertificate] = useState(false);
  const [blockActionLoading, setBlockActionLoading] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(true);
  const [showPayments, setShowPayments] = useState(true);
  const [showPaymentPlans, setShowPaymentPlans] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    registered_from: "",
    registered_to: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "DESC",
  });

  const activeUserRole = profile?.user?.role;

  const queryParams = useMemo(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      sort_by: pagination.sort_by,
      sort_order: pagination.sort_order,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    return params;
  }, [filters, pagination]);

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const data = await getAdminUsersList(queryParams);
      setUsersResponse(data);
    } catch (error) {
      setUsersError(error.response?.data?.message || "No fue posible cargar el listado de usuarios.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeUserRole !== "admin") return;
    loadUsers();
  }, [activeUserRole, queryParams]);

  const openDetail = async (id_user) => {
    setSelectedUserId(id_user);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const data = await getAdminUserDetail(id_user, {
        payment_page: 1,
        payment_limit: 10,
        subscription_page: 1,
        subscription_limit: 10,
      });
      setDetail(data);
    } catch (error) {
      setDetailError(error.response?.data?.message || "No fue posible cargar el detalle del usuario.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenCertificate = async (id_user) => {
    setOpeningCertificate(true);
    try {
      const data = await getMedicalCertificateViewUrl(id_user);
      const url = data?.certificate?.url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      const message = error.response?.data?.message || "No se pudo abrir el certificado.";
      setDetailError(message);
    } finally {
      setOpeningCertificate(false);
    }
  };

  const handleToggleBlock = async (id_user, nextIsBlocked) => {
    setBlockActionLoading(true);
    try {
      await setAdminUserBlockStatus(id_user, nextIsBlocked);
      showToast(nextIsBlocked ? "Usuario bloqueado" : "Acceso restaurado", "success");
      await openDetail(id_user);
      await loadUsers();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible actualizar el estado del usuario.", "error");
    } finally {
      setBlockActionLoading(false);
    }
  };

  const users = usersResponse?.users || [];
  const totalPages = usersResponse?.pages || 1;
  const userNameOptions = useMemo(() => {
    const names = users
      .map((user) => user?.name_user)
      .filter(Boolean);

    return [...new Set(names)].sort((a, b) => a.localeCompare(b, "es"));
  }, [users]);

  return (
    <section className="space-y-6">
      <div className="space-y-6">
        <header className={`${sectionCardClass} overflow-hidden`}>
          <div className="flex flex-col gap-4 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className={pageTagClass}>
                <Users size={14} />
                Usuarios
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">Administracion de usuarios</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text)]">
                  Consulta general y detalle completo de usuarios, pagos, suscripciones y certificados medicos.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-text)]">
              <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1">Responsive</span>
              <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1">Detalle completo</span>
            </div>
          </div>
        </header>

        <section className={sectionCardClass}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Filtros</h2>
            <p className="mt-1 text-sm text-[var(--color-text)]">Busca por nombre y rango de fechas sin salir de la vista principal.</p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
              Nombre del usuario
              <input
                className={inputClass}
                placeholder="Escribe o selecciona un nombre"
                type="text"
                list="admin-user-names"
                value={filters.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({ ...prev, name: value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              />
              <datalist id="admin-user-names">
                {userNameOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
              Fecha inicio
              <input
                type="date"
                className={inputClass}
                value={filters.registered_from}
                onChange={(e) => setFilters((prev) => ({ ...prev, registered_from: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
              Fecha fin
              <input
                type="date"
                className={inputClass}
                value={filters.registered_to}
                onChange={(e) => setFilters((prev) => ({ ...prev, registered_to: e.target.value }))}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-5">
            <button
              className={primaryButtonClass}
              onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
            >
              <Search size={16} />
              Aplicar filtros
            </button>
            <button
              className={clearFiltersButtonClass}
              onClick={() => {
                setFilters({
                  name: "",
                  registered_from: "",
                  registered_to: "",
                });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              Limpiar
            </button>
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="flex flex-col gap-3 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Usuarios</h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <label className="font-semibold" htmlFor="sort_by">Ordenar por</label>
              <select
                id="sort_by"
                className={selectClass}
                value={pagination.sort_by}
                onChange={(e) => setPagination((prev) => ({ ...prev, sort_by: e.target.value }))}
              >
                <option value="created_at">Registro</option>
                <option value="name_user">Nombre</option>
                <option value="email_user">Correo</option>
                <option value="role">Rol</option>
              </select>
              <select
                className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-2 py-1"
                value={pagination.sort_order}
                onChange={(e) => setPagination((prev) => ({ ...prev, sort_order: e.target.value }))}
              >
                <option value="DESC">Desc</option>
                <option value="ASC">Asc</option>
              </select>
            </div>
          </div>

          <div className="p-5">
          {usersLoading ? (
            <LoadingSpinner message="Cargando usuarios..." />
          ) : usersError ? (
            <DataError message={usersError} />
          ) : users.length === 0 ? (
            <EmptyState text="No existen usuarios para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Correo</th>
                    <th className="px-3 py-2 text-left">Telefono</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                    <th className="px-3 py-2 text-left">Rol</th>
                    <th className="px-3 py-2 text-left">Registro</th>
                    <th className="px-3 py-2 text-left">Suscripcion actual</th>
                    <th className="px-3 py-2 text-left">Estado suscripcion</th>
                    <th className="px-3 py-2 text-left">Ultimo pago</th>
                    <th className="px-3 py-2 text-left">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id_user} className="border-t border-[var(--color-primary)]/30">
                      <td className="px-3 py-2 font-semibold">{user.name_user || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{user.email_user || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{user.telephone_user || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{user.status || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{user.role || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{formatDate(user.created_at)}</td>
                      <td className="px-3 py-2 font-semibold">{user.current_subscription?.package?.name_package || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{user.current_subscription?.status || "-"}</td>
                      <td className="px-3 py-2 font-semibold">{formatDate(user.last_payment?.created_at)}</td>
                      <td className="px-3 py-2">
                        <button
                          className={compactPrimaryButtonClass}
                          onClick={() => openDetail(user.id_user)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <button
              className={ghostButtonClass}
              disabled={pagination.page <= 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              <ArrowLeftRight size={16} className="rotate-180" />
              Anterior
            </button>
            <span>
              Pagina {pagination.page} de {totalPages}
            </span>
            <button
              className={ghostButtonClass}
              disabled={pagination.page >= totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Siguiente
              <ArrowLeftRight size={16} />
            </button>
          </div>
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Detalle de usuario</h2>
          </div>
          <div className="p-5">

          {!selectedUserId ? (
            <EmptyState text="Selecciona un usuario para ver el detalle." />
          ) : detailLoading ? (
            <LoadingSpinner message="Cargando detalle del usuario..." />
          ) : detailError ? (
            <DataError message={detailError} />
          ) : !detail ? (
            <EmptyState text="No fue posible cargar el detalle." />
          ) : (
            <div className="space-y-6">
              <section className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-[var(--color-text)]">Informacion general</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <p><span className="font-semibold">Nombre:</span> {detail.user?.name_user || "-"}</p>
                  <p><span className="font-semibold">Correo:</span> {detail.user?.email_user || "-"}</p>
                  <p><span className="font-semibold">Telefono:</span> {detail.user?.telephone_user || "-"}</p>
                  <p><span className="font-semibold">Estado:</span> {detail.user?.is_blocked ? "Bloqueado" : "Activo"}</p>
                  <p><span className="font-semibold">Rol:</span> {detail.user?.role || "-"}</p>
                  <p><span className="font-semibold">Registro:</span> {formatDate(detail.user?.created_at)}</p>
                  <p><span className="font-semibold">Actualizacion:</span> {formatDate(detail.user?.update_at)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {detail.user?.is_blocked ? (
                    <button
                      className={primaryButtonClass}
                      disabled={blockActionLoading}
                      onClick={() => handleToggleBlock(detail.user.id_user, false)}
                    >
                      <ShieldCheck size={16} />
                      Revocar bloqueo (restaurar acceso)
                    </button>
                  ) : (
                    <button
                      className={clearFiltersButtonClass}
                      disabled={blockActionLoading}
                      onClick={() => handleToggleBlock(detail.user.id_user, true)}
                    >
                      <ShieldCheck size={16} />
                      Bloquear acceso manualmente
                    </button>
                  )}
                </div>
              </section>

              <AccordionSection
                title="Historial de suscripciones"
                isOpen={showSubscriptions}
                onToggle={() => setShowSubscriptions((prev) => !prev)}
              >
                {(detail.subscriptions?.rows || []).length === 0 ? (
                  <EmptyState text="Este usuario no tiene suscripciones registradas." />
                ) : (
                  <div className="overflow-x-auto rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]">
                          <th className="px-3 py-2 text-left font-semibold">Plan</th>
                          <th className="px-3 py-2 text-left font-semibold">Estado</th>
                          <th className="px-3 py-2 text-left font-semibold">Valor</th>
                          <th className="px-3 py-2 text-left font-semibold">Fecha compra</th>
                          <th className="px-3 py-2 text-left font-semibold">Inicio</th>
                          <th className="px-3 py-2 text-left font-semibold">Fin</th>
                          <th className="px-3 py-2 text-left font-semibold">Renovacion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.subscriptions?.rows || []).map((subscription) => (
                          <tr key={subscription.id_subscription} className="border-t border-[var(--color-primary)]/30">
                            <td className="px-3 py-2 font-semibold">{subscription.Package?.name_package || "-"}</td>
                            <td className="px-3 py-2 font-semibold">{subscription.status || "-"}</td>
                            <td className="px-3 py-2 font-semibold">{formatCurrency(subscription.Package?.price_package)}</td>
                            <td className="px-3 py-2 font-semibold">{formatDate(subscription.created_at)}</td>
                            <td className="px-3 py-2 font-semibold">{formatDate(subscription.start_date)}</td>
                            <td className="px-3 py-2 font-semibold">{formatDate(subscription.end_date)}</td>
                            <td className="px-3 py-2 font-semibold">{subscription.Package?.is_recurrent ? "Automatica" : "No"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </AccordionSection>

              <AccordionSection
                title="Historial de pagos"
                isOpen={showPayments}
                onToggle={() => setShowPayments((prev) => !prev)}
              >
                {(detail.payments?.rows || []).length === 0 ? (
                  <EmptyState text="Este usuario no tiene pagos registrados." />
                ) : (
                  <div className="overflow-x-auto rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]">
                          <th className="px-3 py-2 text-left font-semibold">Valor pagado</th>
                          <th className="px-3 py-2 text-left font-semibold">Fecha pago</th>
                          <th className="px-3 py-2 text-left font-semibold">Estado</th>
                          <th className="px-3 py-2 text-left font-semibold">Metodo</th>
                          <th className="px-3 py-2 text-left font-semibold">Paquete relacionado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.payments?.rows || []).map((payment) => (
                          <tr key={payment.id_payment} className="border-t border-[var(--color-primary)]/30">
                            <td className="px-3 py-2 font-semibold">{formatCurrency(payment.payment_amount)}</td>
                            <td className="px-3 py-2 font-semibold">{formatDate(payment.created_at)}</td>
                            <td className="px-3 py-2 font-semibold">Pagado</td>
                            <td className="px-3 py-2 font-semibold">{payment.method || "-"}</td>
                            <td className="px-3 py-2 font-semibold">{payment.Package?.name_package || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </AccordionSection>

              <AccordionSection
                title="Planes de pago (SEPA en cuotas)"
                isOpen={showPaymentPlans}
                onToggle={() => setShowPaymentPlans((prev) => !prev)}
              >
                {(detail.paymentPlans || []).length === 0 ? (
                  <EmptyState text="Este usuario no tiene planes de pago a cuotas." />
                ) : (
                  <div className="space-y-4">
                    {(detail.paymentPlans || []).map((plan) => {
                      const hasFailedInstallment = (plan.PaymentPlanInstallments || []).some((item) => item.status === "FAILED");
                      return (
                        <div key={plan.id_payment_plan} className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-[var(--color-text)]">{plan.Package?.name_package || "-"}</p>
                              <p className="text-xs text-[var(--color-text)]">
                                {plan.installment_count} cuotas &middot; Total {formatCurrency(Number(plan.contractual_total_minor) / 100)}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                plan.status === "PAST_DUE" || plan.status === "PAYMENT_FAILED"
                                  ? "bg-rose-500/10 text-rose-700"
                                  : plan.status === "COMPLETED"
                                    ? "bg-emerald-500/10 text-emerald-700"
                                    : "bg-amber-500/10 text-amber-700"
                              }`}
                            >
                              {plan.status}
                            </span>
                          </div>

                          {hasFailedInstallment && !detail.user?.is_blocked && (
                            <p className="mt-2 text-xs font-semibold text-rose-700">
                              Este plan tiene cuotas fallidas pero el usuario no esta bloqueado actualmente.
                            </p>
                          )}

                          <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--color-primary)]/10">
                            <table className="min-w-full text-xs">
                              <thead>
                                <tr className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]">
                                  <th className="px-2 py-1.5 text-left font-semibold">Cuota</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Monto esperado</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Monto pagado</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Estado</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Fecha esperada</th>
                                  <th className="px-2 py-1.5 text-left font-semibold">Fecha pago</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(plan.PaymentPlanInstallments || [])
                                  .sort((a, b) => a.installment_number - b.installment_number)
                                  .map((installment) => (
                                    <tr key={installment.id_installment} className="border-t border-[var(--color-primary)]/10">
                                      <td className="px-2 py-1.5 font-semibold">{installment.installment_number}/{plan.installment_count}</td>
                                      <td className="px-2 py-1.5 font-semibold">{formatCurrency(Number(installment.expected_amount_minor) / 100)}</td>
                                      <td className="px-2 py-1.5 font-semibold">{formatCurrency(Number(installment.paid_amount_minor) / 100)}</td>
                                      <td className="px-2 py-1.5 font-semibold">
                                        <span className={installment.status === "FAILED" ? "text-rose-700" : installment.status === "PAID" ? "text-emerald-700" : ""}>
                                          {installment.status}
                                        </span>
                                      </td>
                                      <td className="px-2 py-1.5 font-semibold">{formatDate(installment.expected_at)}</td>
                                      <td className="px-2 py-1.5 font-semibold">{formatDate(installment.paid_at)}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AccordionSection>

              <section className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-[var(--color-text)]">Certificado medico</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">Nombre:</span> {detail.medicalCertificate?.fileName || "-"}</p>
                  <p><span className="font-semibold">Fecha carga:</span> {formatDate(detail.medicalCertificate?.uploadedAt)}</p>
                  <p><span className="font-semibold">Estado:</span> {detail.medicalCertificate?.existsInStorage ? "Disponible" : "No disponible"}</p>
                  <p><span className="font-semibold">Tipo archivo:</span> {detail.medicalCertificate?.contentType || "-"}</p>
                  <p><span className="font-semibold">Usuario que lo cargo:</span> {detail.user?.id_user || "-"}</p>
                  <p><span className="font-semibold">Key:</span> {detail.medicalCertificate?.key || "-"}</p>
                </div>

                {!detail.medicalCertificate?.existsInDatabase && (
                  <p className="mt-3 text-sm text-[var(--color-text)]">Este usuario no tiene certificado medico registrado.</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className={primaryButtonClass}
                    disabled={!detail.medicalCertificate?.existsInStorage || openingCertificate}
                    onClick={() => handleOpenCertificate(detail.user?.id_user)}
                  >
                    {openingCertificate ? "Abriendo..." : "Visualizar"}
                  </button>
                  <button
                    className={ghostButtonClass}
                    disabled={!detail.medicalCertificate?.existsInStorage || openingCertificate}
                    onClick={() => handleOpenCertificate(detail.user?.id_user)}
                  >
                    Descargar
                  </button>
                </div>
              </section>
            </div>
          )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminUsersPage;
