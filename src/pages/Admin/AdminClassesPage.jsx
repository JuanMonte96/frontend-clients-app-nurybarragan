import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  CheckCheck,
  ChevronRight,
  CircleOff,
  Eye,
  PencilLine,
  RefreshCw,
  School,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { getAdminUsersList } from "../../services/adminUsersService";
import {
  cancelAdminSchedule,
  createAdminClass,
  createAdminRecurringSchedule,
  createAdminUniqueSchedule,
  getAdminClassDetail,
  getAdminClasses,
  getAdminSchedulesByClass,
  toggleAdminClassStatus,
  toggleAdminScheduleStatus,
  updateAdminClass,
  updateAdminSchedule,
} from "../../services/adminClassesSchedulesService";
import { useNavigate } from "react-router-dom";
import { formatCalendarDate } from "../../services/timezone";

const sectionCardClass = "rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)]/95 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const ghostButtonClass = "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";
const inputClass = "w-full rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
const selectClass = inputClass;
const textareaClass = `${inputClass} min-h-[110px] resize-y`;
const pageTagClass = "inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)]";
const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  blocked: "bg-rose-100 text-rose-700",
  inactive: "bg-slate-100 text-slate-700",
  "true": "bg-emerald-100 text-emerald-700",
  "false": "bg-rose-100 text-rose-700",
};

const normalize = (value) => String(value ?? "").toLowerCase();

const formatDate = (value) => {
  return formatCalendarDate(value);
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getStatusClass = (value) => statusClasses[normalize(value)] || "bg-slate-100 text-slate-700";

const Modal = ({ title, description, onClose, children, footer, sizeClass = "max-w-4xl" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
    <div
      className={`${sectionCardClass} ${sizeClass} w-full max-h-[92vh] overflow-y-auto p-0`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="border-b border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={pageTagClass}>
              <School size={14} />
              Clases y horarios
            </div>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-[var(--color-text)]">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text)]">{description}</p>
          </div>
          <button type="button" onClick={onClose} className={ghostButtonClass}>
            Cerrar
          </button>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer ? <div className="border-t border-[var(--color-primary)]/20 px-5 py-4 sm:px-6">{footer}</div> : null}
    </div>
  </div>
);

const Field = ({ label, children, helper, className = "" }) => (
  <label className={`flex flex-col gap-2 text-sm font-semibold text-[var(--color-text)] ${className}`}>
    <span className="flex items-center justify-between gap-2">
      <span>{label}</span>
      {helper ? <span className="text-xs font-medium text-[var(--color-text)]/80">{helper}</span> : null}
    </span>
    {children}
  </label>
);

const Toggle = ({ checked, onChange, onLabel = "Activo", offLabel = "Inactivo" }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-semibold transition-all duration-300 ${checked ? "border-emerald-300 bg-emerald-500/10 text-emerald-700" : "border-slate-300 bg-slate-100 text-slate-600"}`}
  >
    <span className="relative flex h-6 w-11 items-center rounded-full bg-white/80 p-0.5 shadow-inner ring-1 ring-inset ring-black/5">
      <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </span>
    {checked ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
    {checked ? onLabel : offLabel}
  </button>
);

const initialClassForm = {
  title: "",
  descriptionEnglish: "",
  descriptionSpanish: "",
  descriptionFrench: "",
  level: "beginner",
  teacherId: "",
  isBlocked: false,
};

const initialScheduleForm = {
  idClass: "",
  dateClass: "",
  startHour: "",
  endHour: "",
  timeZone: "Europe/Paris",
  isRecurring: false,
  intervaleDays: 7,
  isEnable: true,
  isActive: true,
  scope: "single",
};

const sortSchedulesByStart = (list) =>
  [...list].sort((a, b) => {
    const aTime = new Date(a.start_timestamp || a.date_class || 0).getTime();
    const bTime = new Date(b.start_timestamp || b.date_class || 0).getTime();
    return aTime - bTime;
  });

export default function AdminClassesPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classDetail, setClassDetail] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorClasses, setErrorClasses] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [errorSchedules, setErrorSchedules] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    classStatus: "all",
    instructor: "all",
    scheduleStatus: "all",
    scheduleDate: "",
    scheduleSearch: "",
    recurrence: "all",
  });

  const [classModal, setClassModal] = useState({ open: false, mode: "create", data: initialClassForm });
  const [scheduleModal, setScheduleModal] = useState({ open: false, mode: "create", data: initialScheduleForm });
  const [cancelModal, setCancelModal] = useState({ open: false, schedule: null, reason: "", notify: true, scope: "single" });

  const loadClasses = useCallback(async () => {
    setLoadingClasses(true);
    setErrorClasses("");
    try {
      const data = await getAdminClasses();
      setClasses(Array.isArray(data) ? data : []);
      setSelectedClassId((current) => current || (Array.isArray(data) && data[0]?.id_class ? data[0].id_class : current));
    } catch (error) {
      setErrorClasses(error.response?.data?.message || "No fue posible cargar las clases.");
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  const loadTeachers = useCallback(async () => {
    setLoadingTeachers(true);
    try {
      const response = await getAdminUsersList({ page: 1, limit: 200, sort_by: "created_at", sort_order: "DESC" });
      const list = Array.isArray(response?.users) ? response.users : [];
      setTeachers(list.filter((user) => ["teacher", "admin"].includes(normalize(user.role))));
    } catch {
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  }, []);

  const loadClassDetail = useCallback(async () => {
    if (!selectedClassId) {
      setClassDetail(null);
      setSchedules([]);
      return;
    }

    setLoadingDetail(true);
    setErrorDetail("");
    try {
      const data = await getAdminClassDetail(selectedClassId);
      setClassDetail(data);
    } catch (error) {
      setErrorDetail(error.response?.data?.message || "No fue posible cargar el detalle de la clase.");
      setClassDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, [selectedClassId]);

  const loadSchedules = useCallback(async () => {
    if (!selectedClassId) {
      setSchedules([]);
      return;
    }

    setLoadingSchedules(true);
    setErrorSchedules("");
    try {
      const data = await getAdminSchedulesByClass(selectedClassId, {
        schedule_status: filters.scheduleStatus === "all" ? undefined : filters.scheduleStatus,
      });
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorSchedules(error.response?.data?.message || "No fue posible cargar los horarios.");
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  }, [filters.scheduleStatus, selectedClassId]);

  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, [loadClasses, loadTeachers]);

  useEffect(() => {
    loadClassDetail();
  }, [loadClassDetail]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch = !filters.search || normalize(item.title_class).includes(normalize(filters.search));
      const matchesStatus = filters.classStatus === "all" || (filters.classStatus === "active" ? !item.is_blocked : item.is_blocked);
      const matchesInstructor = filters.instructor === "all" || String(item.teacher?.id_user || "") === filters.instructor;
      return matchesSearch && matchesStatus && matchesInstructor;
    });
  }, [classes, filters.classStatus, filters.instructor, filters.search]);

  const selectedClass = useMemo(() => classes.find((item) => item.id_class === selectedClassId) || null, [classes, selectedClassId]);
  const selectedTeacher = useMemo(() => teachers.find((teacher) => teacher.id_user === classModal.data.teacherId) || null, [teachers, classModal.data.teacherId]);

  const stats = useMemo(() => {
    const active = classes.filter((item) => !item.is_blocked).length;
    const blocked = classes.filter((item) => item.is_blocked).length;
    const recurrentSchedules = schedules.filter((item) => item.id_template).length;
    return {
      total: classes.length,
      active,
      blocked,
      schedules: schedules.length,
      recurrentSchedules,
    };
  }, [classes, schedules]);

  const openClassCreate = () => {
    setClassModal({ open: true, mode: "create", data: { ...initialClassForm, teacherId: teachers[0]?.id_user || "" } });
  };

  const openClassEdit = (item, mode = "edit") => {
    setClassModal({
      open: true,
      mode,
      data: {
        title: item.title_class || "",
        descriptionEnglish: item.description_english || "",
        descriptionSpanish: item.description_spanish || "",
        descriptionFrench: item.description_french || "",
        level: item.level_class || "beginner",
        teacherId: item.teacher_id || item.teacher?.id_user || "",
        isBlocked: Boolean(item.is_blocked),
      },
    });
  };

  const openScheduleCreate = (classId = selectedClassId) => {
    if (!classId) {
      showToast("Selecciona una clase primero.", "error");
      return;
    }

    setScheduleModal({
      open: true,
      mode: "create",
      data: { ...initialScheduleForm, idClass: classId, timeZone: "Europe/Paris" },
    });
  };

  const openScheduleEdit = (item, mode = "edit") => {
    setScheduleModal({
      open: true,
      mode,
      data: {
        id_schedule: item.id_schedule,
        idClass: item.id_class || selectedClassId,
        dateClass: item.date_class ? String(item.date_class).slice(0, 10) : "",
        startHour: item.start_time || "",
        endHour: item.end_time || "",
        timeZone: "Europe/Paris",
        isRecurring: Boolean(item.id_template),
        intervaleDays: Number(item?.recurrence_template?.interval_days || 7),
        isEnable: Boolean(item?.recurrence_template?.is_enabled ?? true),
        isActive: Boolean(item.is_active),
        scope: "single",
      },
    });
  };

  const submitClass = async (payload) => {
    if (!payload.title.trim()) {
      showToast("El nombre de la clase es obligatorio.", "error");
      return;
    }

    setSaving(true);
    try {
      if (classModal.mode === "create") {
        await createAdminClass(payload);
        showToast("Clase creada correctamente.", "success");
      } else if (selectedClassId) {
        await updateAdminClass({ id: selectedClassId, ...payload });
        showToast("Clase actualizada correctamente.", "success");
      }
      setClassModal({ open: false, mode: "create", data: initialClassForm });
      await loadClasses();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible guardar la clase.", "error");
    } finally {
      setSaving(false);
    }
  };

  const submitSchedule = async (payload) => {
    if (!payload.idClass || !payload.dateClass || !payload.startHour || !payload.endHour) {
      showToast("Completa la información básica del horario.", "error");
      return;
    }

    setSaving(true);
    try {
      if (scheduleModal.mode === "create") {
        if (payload.isRecurring) {
          await createAdminRecurringSchedule({
            idClass: payload.idClass,
            startDate: payload.dateClass,
            startHour: payload.startHour,
            endHour: payload.endHour,
            timeZone: "Europe/Paris",
            intervaleDays: Number(payload.intervaleDays || 7),
            isEnable: Boolean(payload.isEnable),
          });
        } else {
          await createAdminUniqueSchedule({
            idClass: payload.idClass,
            dateClass: payload.dateClass,
            startHour: payload.startHour,
            endHour: payload.endHour,
            timeZone: "Europe/Paris",
          });
        }
        showToast("Horario creado correctamente.", "success");
      } else if (selectedClassId) {
        await updateAdminSchedule(scheduleModal.data.id_schedule, {
          idClass: payload.idClass,
          dateClass: payload.dateClass,
          startHour: payload.startHour,
          endHour: payload.endHour,
          timeZone: "Europe/Paris",
          isActive: Boolean(payload.isActive),
          scope: payload.scope || "single",
          intervaleDays: Number(payload.intervaleDays || 7),
          isEnable: Boolean(payload.isEnable),
        });
        showToast("Horario actualizado correctamente.", "success");
      }
      setScheduleModal({ open: false, mode: "create", data: initialScheduleForm });
      await loadSchedules();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible guardar el horario.", "error");
    } finally {
      setSaving(false);
    }
  };

  const visibleSchedules = useMemo(() => {
    const source = sortSchedulesByStart(schedules);
    return source.filter((item) => {
      const recurrenceType = item.id_template ? "recurrent" : "single";
      const className = selectedClass?.title_class || "";
      const textSource = `${item.start_time || ""} ${item.end_time || ""} ${className}`.toLowerCase();
      const matchesSearch = !filters.scheduleSearch || textSource.includes(filters.scheduleSearch.toLowerCase());
      const matchesDate = !filters.scheduleDate || String(item.date_class || "").slice(0, 10) === filters.scheduleDate;
      const matchesRecurrence = filters.recurrence === "all" || recurrenceType === filters.recurrence;
      return matchesSearch && matchesDate && matchesRecurrence;
    });
  }, [filters.recurrence, filters.scheduleDate, filters.scheduleSearch, schedules, selectedClass?.title_class]);

  const handleClassToggle = async (item) => {
    setSaving(true);
    try {
      await toggleAdminClassStatus(item.id_class, !item.is_blocked);
      showToast(item.is_blocked ? "Clase activada." : "Clase inactivada.", "success");
      await loadClasses();
      await loadClassDetail();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible cambiar el estado de la clase.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleToggle = async (item) => {
    setSaving(true);
    try {
      await toggleAdminScheduleStatus(item.id_schedule, !item.is_active);
      showToast(item.is_active ? "Horario inactivado." : "Horario activado.", "success");
      await loadSchedules();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible cambiar el estado del horario.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSchedule = async () => {
    if (!cancelModal.schedule) return;

    setSaving(true);
    try {
      const response = await cancelAdminSchedule(cancelModal.schedule.id_schedule, {
        reason: cancelModal.reason,
        notify: cancelModal.notify,
        scope: cancelModal.scope,
      });
      showToast(response?.message || "Horario cancelado correctamente.", "success");
      setCancelModal({ open: false, schedule: null, reason: "", notify: true, scope: "single" });
      await loadSchedules();
      await loadClasses();
    } catch (error) {
      showToast(error.response?.data?.message || "No fue posible cancelar el horario.", "error");
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
              <School size={14} />
              Clases
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">Clases y horarios</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text)]">
                Administra la publicación, activación, inactivación y cancelación de clases y horarios desde una sola pantalla.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={primaryButtonClass} onClick={openClassCreate}>
              <CalendarPlus size={16} />
              Crear clase
            </button>
            <button type="button" className={ghostButtonClass} onClick={loadClasses}>
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Total de clases</p>
            <p className="mt-2 text-3xl font-black text-[var(--color-text)]">{stats.total}</p>
          </div>
          <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Activas</p>
            <p className="mt-2 text-3xl font-black text-emerald-600">{stats.active}</p>
          </div>
          <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Inactivas</p>
            <p className="mt-2 text-3xl font-black text-rose-600">{stats.blocked}</p>
          </div>
          <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Horarios</p>
            <p className="mt-2 text-3xl font-black text-[var(--color-text)]">{stats.schedules}</p>
          </div>
          <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">Recurrentes</p>
            <p className="mt-2 text-3xl font-black text-[var(--color-text)]">{stats.recurrentSchedules}</p>
          </div>
        </div>
      </header>

      <section className={`${sectionCardClass} p-5`}>
        <div className="grid gap-3 lg:grid-cols-4">
          <Field label="Buscar clase">
            <input className={inputClass} value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} placeholder="Nombre de la clase" />
          </Field>
          <Field label="Estado">
            <select className={selectClass} value={filters.classStatus} onChange={(event) => setFilters((prev) => ({ ...prev, classStatus: event.target.value }))}>
              <option value="all">Todos</option>
              <option value="active">Activas</option>
              <option value="blocked">Inactivas</option>
            </select>
          </Field>
          <Field label="Instructor">
            <select className={selectClass} value={filters.instructor} onChange={(event) => setFilters((prev) => ({ ...prev, instructor: event.target.value }))}>
              <option value="all">Todos</option>
              {teachers.map((teacher) => (
                <option key={teacher.id_user} value={teacher.id_user}>
                  {teacher.name_user}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Clase seleccionada" helper={selectedClassId ? "Detalle cargado" : "Sin selección"}>
            <select className={selectClass} value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)}>
              <option value="">Selecciona una clase</option>
              {classes.map((item) => (
                <option key={item.id_class} value={item.id_class}>{item.title_class}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <section className={sectionCardClass}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Listado de clases</h2>
            <p className="mt-1 text-sm text-[var(--color-text)]">Edita, activa o inactiva sin salir de la pantalla.</p>
          </div>
          <div className="p-4">
            {loadingClasses ? (
              <LoadingSpinner message="Cargando clases..." />
            ) : errorClasses ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{errorClasses}</div>
            ) : filteredClasses.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-6 text-center text-sm text-[var(--color-text)]">
                No hay clases para los filtros aplicados.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClasses.map((item) => (
                  <article key={item.id_class} className={`rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 shadow-sm transition hover:shadow-md ${selectedClassId === item.id_class ? "ring-2 ring-[var(--color-primary)]/30" : ""}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[var(--color-text)]">{item.title_class}</h3>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.is_blocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {item.is_blocked ? "Inactiva" : "Activa"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text)]">Instructor: {item.teacher?.name_user || "Sin instructor"}</p>
                        <p className="text-sm text-[var(--color-text)]">Nivel: {item.level_class || "-"}</p>
                        <p className="text-xs text-[var(--color-text)]">Actualizada: {formatDateTime(item.updated_at || item.created_at)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className={ghostButtonClass} onClick={() => setSelectedClassId(item.id_class)}>
                          <Eye size={16} />
                          Ver
                        </button>
                        <button type="button" className={ghostButtonClass} onClick={() => openClassEdit(item, "edit")}>
                          <PencilLine size={16} />
                          Editar
                        </button>
                        <button type="button" className={ghostButtonClass} onClick={() => handleClassToggle(item)} disabled={saving}>
                          {item.is_blocked ? <CheckCheck size={16} /> : <CircleOff size={16} />}
                          {item.is_blocked ? "Activar" : "Inactivar"}
                        </button>
                        <button type="button" className={primaryButtonClass} onClick={() => openScheduleCreate(item.id_class)}>
                          <CalendarPlus size={16} />
                          Crear horario
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`${sectionCardClass} overflow-hidden`}>
          <div className="border-b border-[var(--color-primary)]/20 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">Horarios de la clase</h2>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {selectedClass ? `${selectedClass.title_class} · ${selectedClass.teacher?.name_user || "Sin instructor"}` : "Selecciona una clase para ver sus horarios."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={primaryButtonClass} onClick={openScheduleCreate} disabled={!selectedClassId}>
                  <CalendarPlus size={16} />
                  Crear horario
                </button>
                <button type="button" className={ghostButtonClass} onClick={loadSchedules} disabled={!selectedClassId}>
                  <RefreshCw size={16} />
                  Actualizar horarios
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Estado de horario">
              <select className={selectClass} value={filters.scheduleStatus} onChange={(event) => setFilters((prev) => ({ ...prev, scheduleStatus: event.target.value }))}>
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </Field>
            <Field label="Fecha">
              <input
                type="date"
                className={inputClass}
                value={filters.scheduleDate}
                onChange={(event) => setFilters((prev) => ({ ...prev, scheduleDate: event.target.value }))}
              />
            </Field>
            <Field label="Búsqueda rápida">
              <input
                className={inputClass}
                placeholder="Ej. 08:00, 10:00"
                value={filters.scheduleSearch}
                onChange={(event) => setFilters((prev) => ({ ...prev, scheduleSearch: event.target.value }))}
              />
            </Field>
            <Field label="Recurrencia">
              <select className={selectClass} value={filters.recurrence} onChange={(event) => setFilters((prev) => ({ ...prev, recurrence: event.target.value }))}>
                <option value="all">Todos</option>
                <option value="single">Solo únicos</option>
                <option value="recurrent">Solo recurrentes</option>
              </select>
            </Field>
          </div>
          <div className="p-4 pt-0">
            {loadingDetail || loadingSchedules ? (
              <LoadingSpinner message="Cargando horarios..." />
            ) : errorDetail || errorSchedules ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{errorDetail || errorSchedules}</div>
            ) : visibleSchedules.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] px-4 py-6 text-center text-sm text-[var(--color-text)]">
                Esta clase todavía no tiene horarios publicados.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-[var(--color-table-header)] text-[var(--color-text)]">
                    <tr>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Inicio</th>
                      <th className="px-4 py-3 text-left">Final</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Serie</th>
                      <th className="px-4 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSchedules.map((item) => (
                      <tr key={item.id_schedule} className="border-t border-[var(--color-primary)]/10">
                        <td className="px-4 py-3 text-[var(--color-text)]">{formatDate(item.date_class)}</td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{item.start_time}</td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{item.end_time}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{item.is_active ? "Activo" : "Inactivo"}</span></td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{item.id_template ? "Recurrente" : "Único"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className={ghostButtonClass} onClick={() => navigate(`/admin/attendance?classId=${selectedClassId}&scheduleId=${item.id_schedule}`)}>
                              <Users size={16} />
                              Inscritos
                            </button>
                            <button type="button" className={ghostButtonClass} onClick={() => openScheduleEdit(item, "edit")}>
                              <PencilLine size={16} />
                              Editar
                            </button>
                            <button type="button" className={ghostButtonClass} onClick={() => handleScheduleToggle(item)} disabled={saving}>
                              {item.is_active ? <CircleOff size={16} /> : <CheckCheck size={16} />}
                              {item.is_active ? "Inactivar" : "Activar"}
                            </button>
                            <button type="button" className={primaryButtonClass} onClick={() => setCancelModal({ open: true, schedule: item, reason: "", notify: true, scope: item.id_template ? "single" : "single" })}>
                              <Trash2 size={16} />
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {classModal.open ? (
        <ClassModal
          open={classModal.open}
          mode={classModal.mode}
          data={classModal.data}
          teachers={teachers}
          saving={saving}
          onClose={() => setClassModal({ open: false, mode: "create", data: initialClassForm })}
          onSubmit={submitClass}
          selectedTeacher={selectedTeacher}
          onChange={(nextData) => setClassModal((prev) => ({ ...prev, data: nextData }))}
        />
      ) : null}

      {scheduleModal.open ? (
        <ScheduleModal
          open={scheduleModal.open}
          mode={scheduleModal.mode}
          data={scheduleModal.data}
          classes={classes}
          selectedClassId={selectedClassId}
          saving={saving}
          onClose={() => setScheduleModal({ open: false, mode: "create", data: initialScheduleForm })}
          onSubmit={submitSchedule}
          onChange={(nextData) => setScheduleModal((prev) => ({ ...prev, data: nextData }))}
        />
      ) : null}

      {cancelModal.open ? (
        <Modal
          title="Cancelar horario"
          description="La sesión quedará cancelada y las inscripciones activas pasarán a estado excused."
          onClose={() => setCancelModal({ open: false, schedule: null, reason: "", notify: true, scope: "single" })}
          sizeClass="max-w-3xl"
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className={ghostButtonClass} onClick={() => setCancelModal({ open: false, schedule: null, reason: "", notify: true, scope: "single" })}>
                Cancelar
              </button>
              <button type="button" className={primaryButtonClass} onClick={handleCancelSchedule} disabled={saving}>
                {saving ? "Cancelando..." : "Confirmar cancelación"}
              </button>
            </div>
          }
        >
          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text)]">
              <p className="font-semibold">{selectedClass?.title_class || cancelModal.schedule?.Class?.title_class || "Clase"}</p>
              <p>Fecha: {formatDate(cancelModal.schedule?.date_class)}</p>
              <p>Horario: {cancelModal.schedule?.start_time} - {cancelModal.schedule?.end_time}</p>
            </div>
            {cancelModal.schedule?.id_template ? (
              <Field label="Alcance">
                <select className={selectClass} value={cancelModal.scope} onChange={(event) => setCancelModal((prev) => ({ ...prev, scope: event.target.value }))}>
                  <option value="single">Solo esta sesión</option>
                  <option value="series">Esta sesión y las siguientes</option>
                </select>
              </Field>
            ) : null}
            <Field label="Motivo de cancelación">
              <textarea className={textareaClass} value={cancelModal.reason} onChange={(event) => setCancelModal((prev) => ({ ...prev, reason: event.target.value }))} placeholder="Describe brevemente el motivo" />
            </Field>
            <label className="flex items-center gap-3 text-sm font-semibold text-[var(--color-text)]">
              <input type="checkbox" checked={cancelModal.notify} onChange={(event) => setCancelModal((prev) => ({ ...prev, notify: event.target.checked }))} />
              Notificar a los inscritos por correo
            </label>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}

function ClassModal({ open, mode, data, teachers, saving, onClose, onSubmit, selectedTeacher, onChange }) {
  if (!open) return null;

  const isView = mode === "view";
  return (
    <Modal
      title={isView ? "Ver clase" : mode === "edit" ? "Editar clase" : "Crear clase"}
      description="Usa los campos reales del modelo sin introducir información paralela."
      onClose={onClose}
      sizeClass="max-w-5xl"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            Cerrar
          </button>
          {!isView ? (
            <button type="button" className={primaryButtonClass} onClick={() => onSubmit(data)} disabled={saving}>
              {saving ? "Guardando..." : mode === "edit" ? "Actualizar clase" : "Crear clase"}
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Nombre de la clase">
          <input className={inputClass} value={data.title} disabled={isView} onChange={(event) => onChange({ ...data, title: event.target.value })} />
        </Field>
        <Field label="Nivel">
          <select className={selectClass} value={data.level} disabled={isView} onChange={(event) => onChange({ ...data, level: event.target.value })}>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
        </Field>
        <Field label="Instructor">
          <select className={selectClass} value={data.teacherId} disabled={isView || teachers.length === 0} onChange={(event) => onChange({ ...data, teacherId: event.target.value })}>
            <option value="">Selecciona un instructor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id_user} value={teacher.id_user}>
                {teacher.name_user}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Estado</span>
          <Toggle checked={!data.isBlocked} onChange={(nextValue) => onChange({ ...data, isBlocked: !nextValue })} onLabel="Activa" offLabel="Inactiva" />
        </div>
        <Field label="Descripción en español" className="lg:col-span-2">
          <textarea className={textareaClass} value={data.descriptionSpanish} disabled={isView} onChange={(event) => onChange({ ...data, descriptionSpanish: event.target.value })} />
        </Field>
        <Field label="Descripción en inglés" className="lg:col-span-2">
          <textarea className={textareaClass} value={data.descriptionEnglish} disabled={isView} onChange={(event) => onChange({ ...data, descriptionEnglish: event.target.value })} />
        </Field>
        <Field label="Descripción en francés" className="lg:col-span-2">
          <textarea className={textareaClass} value={data.descriptionFrench} disabled={isView} onChange={(event) => onChange({ ...data, descriptionFrench: event.target.value })} />
        </Field>
      </div>
      {selectedTeacher ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-4 text-sm text-[var(--color-text)]">
          Instructor seleccionado: <strong>{selectedTeacher.name_user}</strong>
        </div>
      ) : null}
    </Modal>
  );
}

function ScheduleModal({ open, mode, data, classes, selectedClassId, saving, onClose, onSubmit, onChange }) {
  if (!open) return null;
  const isView = mode === "view";
  return (
    <Modal
      title={isView ? "Ver horario" : mode === "edit" ? "Editar horario" : "Crear horario"}
      description="Puedes crear una sesión única o una plantilla recurrente a partir del mismo formulario."
      onClose={onClose}
      sizeClass="max-w-5xl"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={ghostButtonClass} onClick={onClose}>
            Cerrar
          </button>
          {!isView ? (
            <button type="button" className={primaryButtonClass} onClick={() => onSubmit(data)} disabled={saving}>
              {saving ? "Guardando..." : mode === "edit" ? "Actualizar horario" : "Crear horario"}
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Clase">
          <select className={selectClass} value={data.idClass} disabled={isView || Boolean(selectedClassId)} onChange={(event) => onChange({ ...data, idClass: event.target.value })}>
            <option value="">Selecciona una clase</option>
            {classes.map((item) => (
              <option key={item.id_class} value={item.id_class}>
                {item.title_class}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fecha">
          <input type="date" className={inputClass} value={data.dateClass} disabled={isView} onChange={(event) => onChange({ ...data, dateClass: event.target.value })} />
        </Field>
        <Field label="Hora de inicio">
          <input type="time" className={inputClass} value={data.startHour} disabled={isView} onChange={(event) => onChange({ ...data, startHour: event.target.value })} />
        </Field>
        <Field label="Hora de finalización">
          <input type="time" className={inputClass} value={data.endHour} disabled={isView} onChange={(event) => onChange({ ...data, endHour: event.target.value })} />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">¿Recurrente?</span>
          <Toggle checked={data.isRecurring} onChange={(nextValue) => onChange({ ...data, isRecurring: nextValue })} onLabel="Sí" offLabel="No" />
        </div>
        {data.isRecurring ? (
          <>
            <Field label="Intervalo de días" helper="Usa 7 para recurrencia semanal.">
              <input type="number" min="1" className={inputClass} value={data.intervaleDays} disabled={isView} onChange={(event) => onChange({ ...data, intervaleDays: event.target.value })} />
            </Field>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">Plantilla activa</span>
              <Toggle checked={data.isEnable} onChange={(nextValue) => onChange({ ...data, isEnable: nextValue })} onLabel="Activa" offLabel="Inactiva" />
            </div>
          </>
        ) : null}
        {mode === "edit" ? (
          <div className="flex flex-col gap-2 lg:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">Alcance de edición</span>
            <select className={selectClass} value={data.scope} disabled={isView} onChange={(event) => onChange({ ...data, scope: event.target.value })}>
              <option value="single">Solo esta sesión</option>
              <option value="series">Toda la serie</option>
            </select>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Estado</span>
          <Toggle checked={data.isActive} onChange={(nextValue) => onChange({ ...data, isActive: nextValue })} onLabel="Activo" offLabel="Inactivo" />
        </div>
      </div>
    </Modal>
  );
}
