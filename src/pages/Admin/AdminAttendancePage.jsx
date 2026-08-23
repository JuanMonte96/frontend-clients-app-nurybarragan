import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CheckCheck, QrCode, RefreshCw, Search, School } from "lucide-react";
import { getAllClasses } from "../../services/classesService";
import { getAllScheduleByClass } from "../../services/scheduleService";
import {
  getAdminScheduleRoster,
  getScheduleQrImage,
  markManualAttendance,
} from "../../services/attendanceService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { useSearchParams } from "react-router-dom";
import { formatCalendarDate } from "../../services/timezone";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (value) => {
  return formatCalendarDate(value);
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

const statusClassMap = {
  attended: "bg-green-100 text-green-700",
  no_show: "bg-red-100 text-red-700",
  excused: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  removed: "bg-gray-100 text-gray-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-orange-100 text-orange-700",
};

const statusLabelMap = {
  active: "Inscrito",
  completed: "Completado",
  cancelled: "Cancelado",
  removed: "Removido",
};

const StatusBadge = ({ value }) => {
  const normalized = String(value || "-").toLowerCase();
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[normalized] || "bg-slate-100 text-slate-700"}`}>
      {statusLabelMap[normalized] || value || "-"}
    </span>
  );
};

const sectionCardClass = "rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const compactPrimaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const clearFiltersButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-rose-300 bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const outlineButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const inputClass = "w-full rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
const selectClass = inputClass;

export default function AdminAttendancePage() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const initialClassId = searchParams.get("classId") || "";
  const initialScheduleId = searchParams.get("scheduleId") || "";

  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [rosterData, setRosterData] = useState(null);
  const [qrImage, setQrImage] = useState("");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const [filters, setFilters] = useState({
    date: "",
    schedule_status: "active",
    enrollment_status: "",
    attendance_status: "",
    name: "",
    email: "",
  });

  const [pagination, setPagination] = useState({ page: 1, limit: 25 });

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [markingEnrollmentId, setMarkingEnrollmentId] = useState("");

  const [classesError, setClassesError] = useState("");
  const [schedulesError, setSchedulesError] = useState("");
  const [rosterError, setRosterError] = useState("");
  const [qrError, setQrError] = useState("");

  const [showQrModal, setShowQrModal] = useState(false);

  const pollingRef = useRef(false);

  const loadClasses = useCallback(async () => {
    setLoadingClasses(true);
    setClassesError("");
    try {
      const data = await getAllClasses();
      setClasses(Array.isArray(data) ? data : []);
      if (initialClassId) {
        setSelectedClassId(initialClassId);
      }
    } catch (error) {
      setClassesError(error.response?.data?.message || "No fue posible cargar las clases.");
    } finally {
      setLoadingClasses(false);
    }
  }, [initialClassId]);

  const loadSchedules = useCallback(async () => {
    if (!selectedClassId) {
      setSchedules([]);
      setSelectedScheduleId("");
      return;
    }

    setLoadingSchedules(true);
    setSchedulesError("");
    try {
      const data = await getAllScheduleByClass(selectedClassId, {
        date: filters.date || undefined,
        schedule_status: filters.schedule_status || undefined,
      });

      const nextSchedules = Array.isArray(data) ? data : [];
      setSchedules(nextSchedules);
      if (!nextSchedules.some((item) => item.id_schedule === selectedScheduleId)) {
        setSelectedScheduleId("");
      }
    } catch (error) {
      setSchedulesError(error.response?.data?.message || "No fue posible cargar los horarios.");
      setSchedules([]);
      setSelectedScheduleId("");
    } finally {
      setLoadingSchedules(false);
    }
  }, [selectedClassId, filters.date, filters.schedule_status, selectedScheduleId]);

  const rosterQuery = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      enrollment_status: filters.enrollment_status || undefined,
      attendance_status: filters.attendance_status || undefined,
      name: filters.name || undefined,
      email: filters.email || undefined,
    }),
    [pagination.page, pagination.limit, filters.enrollment_status, filters.attendance_status, filters.name, filters.email]
  );

  const loadRoster = useCallback(
    async ({ silent = false } = {}) => {
      if (!selectedScheduleId) {
        setRosterData(null);
        return;
      }

      if (pollingRef.current) return;
      pollingRef.current = true;

      if (!silent) {
        setLoadingRoster(true);
      }
      setRosterError("");

      try {
        const data = await getAdminScheduleRoster(selectedScheduleId, rosterQuery);
        setRosterData(data);
      } catch (error) {
        setRosterError(error.response?.data?.message || "No fue posible cargar las inscripciones del horario.");
      } finally {
        if (!silent) {
          setLoadingRoster(false);
        }
        pollingRef.current = false;
      }
    },
    [selectedScheduleId, rosterQuery]
  );

  const loadQr = useCallback(async () => {
    if (!selectedScheduleId) {
      setQrImage("");
      return;
    }

    setLoadingQr(true);
    setQrError("");
    try {
      const data = await getScheduleQrImage(selectedScheduleId);
      setQrImage(data?.qrImage || "");
    } catch (error) {
      setQrError(error.response?.data?.message || "No fue posible obtener el QR del horario.");
      setQrImage("");
    } finally {
      setLoadingQr(false);
    }
  }, [selectedScheduleId]);

  const handleMarkAttendance = async (row) => {
    if (!row?.id_enrollment || !row?.id_user) return;

    setMarkingEnrollmentId(row.id_enrollment);
    try {
      await markManualAttendance({
        enrollmentId: row.id_enrollment,
        userId: row.id_user,
        status: "attended",
      });
      showToast("Asistencia marcada correctamente.", "success");
      await loadRoster();
    } catch (error) {
      const message = error.response?.data?.message || "No fue posible marcar la asistencia.";
      showToast(message, "error");
    } finally {
      setMarkingEnrollmentId("");
    }
  };

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    if (!initialScheduleId || schedules.length === 0) return;
    const found = schedules.find((item) => item.id_schedule === initialScheduleId);
    if (found) {
      setSelectedScheduleId(initialScheduleId);
    }
  }, [initialScheduleId, schedules]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedScheduleId]);

  useEffect(() => {
    loadRoster();
    loadQr();
  }, [loadRoster, loadQr]);

  useEffect(() => {
    if (!selectedScheduleId) return undefined;

    const intervalId = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      loadRoster({ silent: true });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedScheduleId, loadRoster]);

  const roster = rosterData?.roster || [];
  const summary = rosterData?.summary;

  return (
    <section className="space-y-6">
      <header className={`${sectionCardClass} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-[var(--color-primary)]/20 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]">
              <CheckCheck size={14} />
              Asistencias
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">Control de asistencias</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text)]">
                Consulta las personas inscritas en cada clase, verifica su asistencia y administra el registro manual o mediante codigo QR.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-text)]">
            <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1">QR</span>
            <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1">Manual</span>
            <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1">Responsive</span>
          </div>
        </div>
      </header>

      <section className={`${sectionCardClass} space-y-0 overflow-hidden`}>
        <div className="border-b border-[var(--color-primary)]/20 p-5">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Filtros</h2>
          <p className="mt-1 text-sm text-[var(--color-text)]">Selecciona clase, horario y filtros de registro para controlar la asistencia.</p>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Clase
            <select
              className={selectClass}
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedScheduleId("");
              }}
            >
              <option value="">Selecciona una clase</option>
              {classes.map((cls) => (
                <option key={cls.id_class} value={cls.id_class}>
                  {cls.title_class}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Fecha
            <input
              type="date"
              className={inputClass}
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado horario
            <select
              className={selectClass}
              value={filters.schedule_status}
              onChange={(e) => setFilters((prev) => ({ ...prev, schedule_status: e.target.value }))}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="all">Todos</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Horario
            <select
              className={selectClass}
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              disabled={!selectedClassId || loadingSchedules}
            >
              <option value="">Selecciona un horario</option>
              {schedules.map((item) => (
                <option key={item.id_schedule} value={item.id_schedule}>
                  {`${formatDateOnly(item.date_class)} ${item.start_time} - ${item.end_time}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 p-5 pt-0 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado inscripcion
            <select
              className={selectClass}
              value={filters.enrollment_status}
              onChange={(e) => setFilters((prev) => ({ ...prev, enrollment_status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="active">Activa</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
              <option value="removed">Removida</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado asistencia
            <select
              className={selectClass}
              value={filters.attendance_status}
              onChange={(e) => setFilters((prev) => ({ ...prev, attendance_status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="attended">Asistio</option>
              <option value="no_show">No asistio</option>
              <option value="excused">Excusada</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Nombre usuario
            <input
              className={inputClass}
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Correo
            <input
              className={inputClass}
              value={filters.email}
              onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Correo"
            />
          </label>

        </div>

        <div className="flex flex-wrap gap-2 px-5 pb-5">
          <button
            className={primaryButtonClass}
            onClick={() => {
              setPagination((prev) => ({ ...prev, page: 1 }));
              loadSchedules();
              loadRoster();
            }}
          >
            <Search size={16} />
            Aplicar filtros
          </button>
          <button
            className={clearFiltersButtonClass}
            onClick={() => {
              setSelectedClassId("");
              setSelectedScheduleId("");
              setSchedules([]);
              setRosterData(null);
              setQrImage("");
              setFilters({
                date: "",
                schedule_status: "active",
                enrollment_status: "",
                attendance_status: "",
                name: "",
                email: "",
              });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            Limpiar
          </button>
          <button
            className={outlineButtonClass}
            onClick={() => {
              loadRoster();
              loadQr();
            }}
            disabled={!selectedScheduleId}
          >
            Actualizar
          </button>
        </div>

        {classesError && <DataError message={classesError} />}
        {schedulesError && <DataError message={schedulesError} />}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <article className={`${sectionCardClass} lg:col-span-2 overflow-hidden`}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Codigo QR del horario</h2>
          </div>
          <div className="space-y-4 p-5">

          {!selectedScheduleId ? (
            <EmptyState text="Selecciona clase y horario para visualizar el QR." />
          ) : loadingQr ? (
            <LoadingSpinner message="Cargando QR..." />
          ) : qrError ? (
            <DataError message={qrError} />
          ) : !qrImage ? (
            <EmptyState text="No hay QR disponible para este horario." />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <p><span className="font-semibold">Clase:</span> {rosterData?.schedule?.class_title || "-"}</p>
                <p><span className="font-semibold">Fecha:</span> {formatDateOnly(rosterData?.schedule?.date_local || rosterData?.schedule?.date_class)}</p>
                <p><span className="font-semibold">Inicio:</span> {formatDateTime(rosterData?.schedule?.start_timestamp)}</p>
                <p><span className="font-semibold">Fin:</span> {formatDateTime(rosterData?.schedule?.end_timestamp)}</p>
                <p><span className="font-semibold">Estado:</span> {rosterData?.schedule?.is_active ? "Activo" : "Inactivo"}</p>
              </div>

              <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-white p-4 flex items-center justify-center shadow-sm">
                <img src={qrImage} alt="QR asistencia" className="h-52 w-52 object-contain" />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className={primaryButtonClass}
                  onClick={() => setShowQrModal(true)}
                >
                  <QrCode size={16} />
                  Ampliar
                </button>
                <button
                  className={outlineButtonClass}
                  onClick={loadQr}
                >
                  <RefreshCw size={16} />
                  Actualizar QR
                </button>
                <a
                  className={outlineButtonClass}
                  href={qrImage}
                  download={`qr-asistencia-${selectedScheduleId}.png`}
                >
                  Descargar QR
                </a>
              </div>
            </div>
          )}
          </div>
        </article>

        <article className={`${sectionCardClass} lg:col-span-3 overflow-hidden`}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Resumen de asistencia</h2>
          </div>
          <div className="p-5">
          {!summary ? (
            <EmptyState text="Selecciona un horario para visualizar el resumen." />
          ) : (
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">Total inscritos:</span> {summary.total_enrolled}</p>
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">Asistieron:</span> {summary.total_attended}</p>
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">Pendientes:</span> {summary.total_pending}</p>
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">No asistieron:</span> {summary.total_no_show}</p>
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">Excusadas:</span> {summary.total_excused}</p>
              <p className="rounded-2xl bg-[var(--color-bg)] p-3 shadow-sm"><span className="font-semibold">Porcentaje asistencia:</span> {summary.attendance_rate}%</p>
            </div>
          )}
          </div>
        </article>
      </section>

      <section className={sectionCardClass}>
        <div className="border-b border-[var(--color-primary)]/20 p-5">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Listado de inscritos y asistencia</h2>
        </div>
        <div className="p-5">

        {loadingSchedules || loadingClasses ? (
          <LoadingSpinner message="Cargando filtros..." />
        ) : !selectedClassId ? (
          <EmptyState text="Selecciona una clase para continuar." />
        ) : !selectedScheduleId ? (
          <EmptyState text="Selecciona un horario para visualizar inscripciones." />
        ) : loadingRoster ? (
          <LoadingSpinner message="Cargando inscritos..." />
        ) : rosterError ? (
          <DataError message={rosterError} />
        ) : roster.length === 0 ? (
          <EmptyState text="No hay inscritos para el horario seleccionado." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Correo</th>
                    <th className="px-3 py-2 text-left">Clase</th>
                    <th className="px-3 py-2 text-left">Fecha</th>
                    <th className="px-3 py-2 text-left">Fecha inscripcion</th>
                    <th className="px-3 py-2 text-left">Paquete</th>
                    <th className="px-3 py-2 text-left">Inscripcion</th>
                    <th className="px-3 py-2 text-left">Asistencia</th>
                    <th className="px-3 py-2 text-left">Metodo</th>
                    <th className="px-3 py-2 text-left">Fecha asistencia</th>
                    <th className="px-3 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((row) => {
                    const attendanceTaken = row.attendance_status !== "pending";
                    const loadingAction = markingEnrollmentId === row.id_enrollment;

                    return (
                      <tr key={row.id_enrollment} className="border-t border-[var(--color-primary)]/30">
                        <td className="px-3 py-2 font-semibold">{row.user_name || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{row.user_email || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{rosterData?.schedule?.class_title || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{formatDateOnly(rosterData?.schedule?.date_local || rosterData?.schedule?.date_class)}</td>
                        <td className="px-3 py-2 font-semibold">{formatDateTime(row.enrolled_at)}</td>
                        <td className="px-3 py-2 font-semibold">{row.package_name || "-"}</td>
                        <td className="px-3 py-2"><StatusBadge value={row.enrollment_status} /></td>
                        <td className="px-3 py-2"><StatusBadge value={row.attendance_status} /></td>
                        <td className="px-3 py-2 font-semibold">{row.registration_method || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{formatDateTime(row.attendance_registered_at)}</td>
                        <td className="px-3 py-2">
                          <button
                            className={compactPrimaryButtonClass}
                            disabled={attendanceTaken || loadingAction || row.enrollment_status !== "active"}
                            onClick={() => handleMarkAttendance(row)}
                          >
                            {loadingAction ? "Guardando..." : "Marcar asistencia"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <button
                className={outlineButtonClass}
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                <CalendarDays size={16} className="rotate-180" />
                Anterior
              </button>
              <span>
                Pagina {pagination.page} de {rosterData?.pages || 1}
              </span>
              <button
                className={outlineButtonClass}
                disabled={pagination.page >= (rosterData?.pages || 1)}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Siguiente
                <CalendarDays size={16} />
              </button>
            </div>
          </>
        )}
        </div>
      </section>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowQrModal(false)}>
          <div className="modal-content max-w-xl rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)] p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={qrImage} alt="QR asistencia ampliado" className="h-[420px] w-[420px] max-w-full object-contain" />
            <button
              className={`${outlineButtonClass} mt-3 w-full`}
              onClick={() => setShowQrModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
