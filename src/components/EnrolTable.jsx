import { useState, useEffect } from "react";
import { updateStateEnrollment } from "../services/enrollmentService";
import { useClasses } from "../context/ClassesContext";

export const EnrolTable = ({ enrollments }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const { updateEnrollmentStatus } = useClasses();
    const [enrollmentsList, setEnrollmentsList] = useState(enrollments);

    // Sincroniza la lista cuando cambian los enrollments del prop
    useEffect(() => {
        setEnrollmentsList(enrollments);
    }, [enrollments]);

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
    const handleAttendanceToggle = async (enrollmentId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "removed" : "active";
        await handleStatusChange(enrollmentId, newStatus);
    };

    // Maneja la eliminación (cambio a cancelled)
    const handleDelete = (enrollmentId) => {
        handleStatusChange(enrollmentId, "cancelled");
    };

    // Función para obtener el color según el estado
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "removed":
                return "bg-gray-100 text-gray-800";
            case "blocked":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Función para obtener el nombre del estado en español
    const getStatusLabel = (status) => {
        const statusMap = {
            active: "Activa",
            removed: "Desactivada",
            Blocked: "Bloqueada",
        };
        return statusMap[status?.toLowerCase()] || status || "Desconocido";
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
                            Clase
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)] hidden sm:table-cell">
                            Profesor
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)] hidden md:table-cell">
                            Nivel
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            Horario
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            Estado
                        </th>
                        <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm font-bold text-[var(--color-text)]">
                            Asistir
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {enrollmentsList.map((enrollment) => {
                        const classData = enrollment.ClassSchedule?.Class;
                        const scheduleData = enrollment.ClassSchedule;
                        
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
                                    {classData?.description_class || "Sin descripción"}
                                </p>
                            </td>

                            {/* Profesor */}
                            <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 hidden sm:table-cell">
                                <p className="text-[var(--color-text)] text-xs sm:text-sm line-clamp-1">
                                    {classData?.teacher?.name_user || "No Disponible"}
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
                                    {scheduleData?.start_time || "N/A"} - {scheduleData?.end_time || ""}
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                    {scheduleData?.date_class || "Sin fecha"}
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
                                        onClick={() => handleAttendanceToggle(enrollment.id_enrollment, enrollment.status)}
                                        disabled={loadingId === enrollment.id_enrollment}
                                        className={`relative inline-flex items-center h-6 sm:h-8 w-12 sm:w-14 rounded-full transition-colors flex-shrink-0 ${
                                            enrollment.status === "active"
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-red-500 hover:bg-red-600"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        title={enrollment.status === "active" ? "Puedo asistir - Click para no asistir" : "No puedo asistir - Click para asistir"}
                                    >
                                        <span
                                            className={`inline-block h-5 sm:h-6 w-5 sm:w-6 transform rounded-full bg-white transition-transform ${
                                                enrollment.status === "active" ? "translate-x-6 sm:translate-x-7" : "translate-x-0.5 sm:translate-x-1"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-xs font-semibold text-[var(--color-text)] hidden sm:inline">
                                        {enrollment.status === "active" ? "Asistir" : "No asistir"}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
        </div>
    );
};

