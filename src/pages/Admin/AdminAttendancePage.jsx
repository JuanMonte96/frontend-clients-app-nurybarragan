import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllClasses } from "../../services/classesService";
import { getAllScheduleByClass } from "../../services/scheduleService";
import {
  getAdminScheduleRoster,
  getScheduleQrImage,
  markManualAttendance,
} from "../../services/attendanceService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

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
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

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

const statusClassMap = {
  attended: "bg-green-100 text-green-700",
  no_show: "bg-red-100 text-red-700",
  excused: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  removed: "bg-gray-100 text-gray-700",
};

const StatusBadge = ({ value }) => {
  const normalized = String(value || "-").toLowerCase();
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassMap[normalized] || "bg-slate-100 text-slate-700"}`}>
      {value || "-"}
    </span>
  );
};

export default function AdminAttendancePage() {
  const { showToast } = useToast();

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

  const selectedSchedule = useMemo(
    () => schedules.find((item) => item.id_schedule === selectedScheduleId) || null,
    [schedules, selectedScheduleId]
  );

  const loadClasses = useCallback(async () => {
    setLoadingClasses(true);
    setClassesError("");
    try {
      const data = await getAllClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      setClassesError(error.response?.data?.message || "No fue posible cargar las clases.");
    } finally {
      setLoadingClasses(false);
    }
  }, []);

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
      <header className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">Control de asistencias</h1>
        <p className="mt-2 text-sm text-[var(--color-text)]">
          Consulta las personas inscritas en cada clase, verifica su asistencia y administra el registro manual o mediante codigo QR.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Filtros</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Clase
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
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
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado horario
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
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
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado inscripcion
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.enrollment_status}
              onChange={(e) => setFilters((prev) => ({ ...prev, enrollment_status: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="active">Activa</option>
              <option value="removed">Removida</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Estado asistencia
            <select
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
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
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--color-text)]">
            Correo
            <input
              className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-3 py-2 text-sm"
              value={filters.email}
              onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Correo"
            />
          </label>

        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
            onClick={() => {
              setPagination((prev) => ({ ...prev, page: 1 }));
              loadSchedules();
              loadRoster();
            }}
          >
            Aplicar filtros
          </button>
          <button
            className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-4 py-2 text-sm"
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
            className="rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] px-4 py-2 text-sm"
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
        <article className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6 lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Codigo QR del horario</h2>

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
                <p><span className="font-semibold">Fecha:</span> {formatDateOnly(rosterData?.schedule?.date_class)}</p>
                <p><span className="font-semibold">Inicio:</span> {formatDateTime(rosterData?.schedule?.start_timestamp)}</p>
                <p><span className="font-semibold">Fin:</span> {formatDateTime(rosterData?.schedule?.end_timestamp)}</p>
                <p><span className="font-semibold">Estado:</span> {rosterData?.schedule?.is_active ? "Activo" : "Inactivo"}</p>
              </div>

              <div className="rounded-lg border border-[var(--color-primary)] bg-white p-4 flex items-center justify-center">
                <img src={qrImage} alt="QR asistencia" className="h-52 w-52 object-contain" />
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-[var(--color-text)]"
                  onClick={() => setShowQrModal(true)}
                >
                  Ampliar
                </button>
                <button
                  className="rounded-md border border-[var(--color-primary)] px-3 py-2 text-xs"
                  onClick={loadQr}
                >
                  Actualizar QR
                </button>
                <a
                  className="rounded-md border border-[var(--color-primary)] px-3 py-2 text-xs"
                  href={qrImage}
                  download={`qr-asistencia-${selectedScheduleId}.png`}
                >
                  Descargar QR
                </a>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6 lg:col-span-3">
          <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Resumen de asistencia</h2>
          {!summary ? (
            <EmptyState text="Selecciona un horario para visualizar el resumen." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <p><span className="font-semibold">Total inscritos:</span> {summary.total_enrolled}</p>
              <p><span className="font-semibold">Asistieron:</span> {summary.total_attended}</p>
              <p><span className="font-semibold">Pendientes:</span> {summary.total_pending}</p>
              <p><span className="font-semibold">No asistieron:</span> {summary.total_no_show}</p>
              <p><span className="font-semibold">Excusadas:</span> {summary.total_excused}</p>
              <p><span className="font-semibold">Porcentaje asistencia:</span> {summary.attendance_rate}%</p>
            </div>
          )}
        </article>
      </section>

      <section className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">Listado de inscritos y asistencia</h2>

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
            <div className="overflow-x-auto rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)]">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[var(--color-table-header)] text-[var(--color-text)]">
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Correo</th>
                    <th className="px-3 py-2 text-left">Clase</th>
                    <th className="px-3 py-2 text-left">Fecha</th>
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
                        <td className="px-3 py-2 font-semibold">{formatDateOnly(rosterData?.schedule?.date_class)}</td>
                        <td className="px-3 py-2 font-semibold">{row.package_name || "-"}</td>
                        <td className="px-3 py-2"><StatusBadge value={row.enrollment_status} /></td>
                        <td className="px-3 py-2"><StatusBadge value={row.attendance_status} /></td>
                        <td className="px-3 py-2 font-semibold">{row.registration_method || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{formatDateTime(row.attendance_registered_at)}</td>
                        <td className="px-3 py-2">
                          <button
                            className="rounded-md bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold disabled:opacity-50"
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

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                className="rounded-md border border-[var(--color-primary)] px-3 py-1 disabled:opacity-50"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Anterior
              </button>
              <span>
                Pagina {pagination.page} de {rosterData?.pages || 1}
              </span>
              <button
                className="rounded-md border border-[var(--color-primary)] px-3 py-1 disabled:opacity-50"
                disabled={pagination.page >= (rosterData?.pages || 1)}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </section>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowQrModal(false)}>
          <div className="max-w-xl rounded-xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <img src={qrImage} alt="QR asistencia ampliado" className="h-[420px] w-[420px] max-w-full object-contain" />
            <button
              className="mt-3 w-full rounded-md border border-[var(--color-primary)] px-3 py-2 text-sm"
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
