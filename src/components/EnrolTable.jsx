import { useState, useEffect, useMemo } from "react";
import { updateStateEnrollment } from "../services/enrollmentService";
import { useClasses } from "../context/ClassesContext";
import { useTranslation } from "react-i18next";

export const EnrolTable = ({ enrollments }) => {
    const { t, i18n } = useTranslation();
    const [loadingId, setLoadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const { updateEnrollmentStatus } = useClasses();
    const [enrollmentsList, setEnrollmentsList] = useState(enrollments);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Sincroniza la lista cuando cambian los enrollments del prop
    useEffect(() => {
        setEnrollmentsList(enrollments);
        setCurrentPage(1);
    }, [enrollments]);

    const orderedEnrollments = useMemo(() => [...enrollmentsList].sort((first, second) => {
        const firstDate = new Date(first.enrolled_at || 0).getTime();
        const secondDate = new Date(second.enrolled_at || 0).getTime();
        return secondDate - firstDate;
    }), [enrollmentsList]);

    const totalPages = Math.max(1, Math.ceil(orderedEnrollments.length / pageSize));
    const visibleEnrollments = orderedEnrollments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Maneja la actualización del estado del enrollment
    const handleStatusChange = async (enrollmentId, newStatus) => {
        setLoadingId(enrollmentId);
        setErrorMsg(null);
        try {
            await updateStateEnrollment(enrollmentId, newStatus);

            // Actualiza localmente y en el contexto global
            setEnrollmentsList(prev =>
                prev.map(enrollment =>
                    enrollment.id_enrollment === enrollmentId
                        ? { ...enrollment, status: newStatus }
                        : enrollment
                )
            );
            updateEnrollmentStatus(enrollmentId, newStatus);
        } catch (error) {
            setErrorMsg(`Error: ${error.message}`);
            console.error(`Error updating enrollment: ${error}`);
        } finally {
            setLoadingId(null);
        }
    };

    // Maneja el toggle de asistencia - usa el estado real del enrollment
    // Función para obtener el color según el estado
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "removed":
                return "bg-gray-100 text-gray-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            case "cancelled":
                return "bg-orange-100 text-orange-800";
            case "blocked":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Función para obtener el nombre del estado en español
    const getStatusLabel = (status) => {
        const normalizedStatus = String(status || "").trim().toLowerCase();
        const statusMap = {
            active: t("enrollment.states.active"),
            completed: t("enrollment.states.completed"),
            cancelled: t("enrollment.states.cancelled"),
            removed: t("enrollment.states.removed"),
            blocked: "Bloqueada",
        };
        return statusMap[normalizedStatus] || status || t("enrollment.states.unknown");
    };

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-[var(--color-primary)]">
            {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 text-xs sm:text-sm">
                    {errorMsg}
                </div>
            )}

            <table className="w-full border-collapse bg-[var(--color-bg-secondary)] text-xs sm:text-sm">
                <thead>
                    <tr className="bg-[var(--color-table-header)] border-b border-[var(--color-primary)]">
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            {t("enrollment.class")}
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)] hidden sm:table-cell">
                            {t("enrollment.professor")}
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)] hidden md:table-cell">
                            {t("enrollment.level")}
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            {t("enrollment.schedule")}
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            {t("enrollment.status")}
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            {t("enrollment.attendance")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {visibleEnrollments.map((enrollment) => {
                        const classData = enrollment.ClassSchedule?.Class;
                        const scheduleData = enrollment.ClassSchedule;
                        const descriptionMap = {
                            es: classData?.description_spanish,
                            en: classData?.description_english,
                            fr: classData?.description_french
                        };

                        const description = descriptionMap[i18n.language] || classData?.description_french;

                        return (
                            <tr
                                key={enrollment.id_enrollment}
                                className="border-b border-[var(--color-primary)] border-opacity-30 hover:bg-[var(--color-secondary)] hover:bg-opacity-10 transition-colors text-xs sm:text-sm"
                            >
                                {/* Nombre de la clase */}
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                                    <p className="font-semibold text-[var(--color-text)] text-xs sm:text-sm line-clamp-2">
                                        {classData?.title_class || "N/A"}
                                    </p>
                                    <p className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--color-primary)] bg-opacity-20 text-xs text-[var(--color-text)] rounded-full font-semibold capitalize mt-1 line-clamp-1">
                                        {description || "N/A"}
                                    </p>
                                </td>

                                {/* Profesor */}
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 hidden sm:table-cell">
                                    <p className="text-[var(--color-text)] text-xs sm:text-sm line-clamp-1">
                                        {classData?.teacher?.name_user || "N/A"}
                                    </p>
                                </td>

                                {/* Nivel */}
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 hidden md:table-cell">
                                    <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-text)] rounded-full text-xs font-semibold capitalize">
                                        {classData?.level_class || "N/A"}
                                    </span>
                                </td>

                                {/* Horario */}
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                                    <p className="text-[var(--color-text)] text-xs sm:text-sm truncate">
                                        {scheduleData?.start_local || "N/A"} - {scheduleData?.end_local || ""}
                                    </p>
                                    <p className="text-sm text-[var(--color-table-header)] truncate">
                                        {scheduleData?.date_local || scheduleData?.date_class || "N/A"}
                                    </p>
                                </td>

                                {/* Estado */}
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(enrollment.status)}`}>
                                        {getStatusLabel(enrollment.status)}
                                    </span>
                                </td>

                                {/* Toggle de Asistencia */}
                                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                                    <div className="flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
                                        <button
                                            onClick={() => handleStatusChange(enrollment.id_enrollment, "cancelled")}
                                            disabled={loadingId === enrollment.id_enrollment || enrollment.status !== "active"}
                                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Cancelar inscripción"
                                        >
                                            Cancelar inscripción
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-primary)]/20 bg-[var(--color-bg-secondary)] px-3 py-3 text-xs sm:px-4 sm:text-sm">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className="rounded-lg border border-[var(--color-primary)] px-3 py-2 font-semibold text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t("enrollment.pagination.previous")}
                </button>
                <span className="font-semibold text-[var(--color-text)]">
                    {t("enrollment.pagination.page", { current: currentPage, total: totalPages })}
                </span>
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className="rounded-lg border border-[var(--color-primary)] px-3 py-2 font-semibold text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t("enrollment.pagination.next")}
                </button>
            </div>
        </div>
    );
};

