import { useState } from "react";
import { updateStateEnrollment } from "../services/enrollmentService";
import { Trash2 } from "lucide-react";

export const EnrolTable = ({ enrollments }) => {
    const [enrollmentsList, setEnrollmentsList] = useState(enrollments);
    const [loadingId, setLoadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [attendanceToggle, setAttendanceToggle] = useState({});

    // Maneja la actualización del estado del enrollment
    const handleStatusChange = async (enrollmentId, newStatus) => {
        setLoadingId(enrollmentId);
        setErrorMsg(null);
        try {
            await updateStateEnrollment(enrollmentId, newStatus);
            
            // Actualiza la lista localmente para ver el cambio inmediatamente
            setEnrollmentsList(prev =>
                prev.map(enrollment =>
                    enrollment.id_enrollment === enrollmentId
                        ? { ...enrollment, status: newStatus }
                        : enrollment
                )
            );
        } catch (error) {
            setErrorMsg(`Error: ${error.message}`);
            console.error(`Error updating enrollment: ${error}`);
        } finally {
            setLoadingId(null);
        }
    };

    // Maneja el toggle de asistencia
    const handleAttendanceToggle = async (enrollmentId, currentAttendance) => {
        const newAttendance = !currentAttendance;
        const status = newAttendance ? "active" : "removed";
        
        setLoadingId(enrollmentId);
        setErrorMsg(null);
        try {
            await updateStateEnrollment(enrollmentId, status);
            
            // Actualiza el toggle localmente
            setAttendanceToggle(prev => ({
                ...prev,
                [enrollmentId]: newAttendance
            }));
        } catch (error) {
            setErrorMsg(`Error: ${error.message}`);
            console.error(`Error updating attendance: ${error}`);
        } finally {
            setLoadingId(null);
        }
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
        <div className="overflow-x-auto rounded-lg border border-[var(--color-primary)]">
            {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {errorMsg}
                </div>
            )}
            
            <table className="w-full border-collapse bg-[var(--color-bg-secondary)]">
                <thead>
                    <tr className="bg-[var(--color-header)] border-b border-[var(--color-primary)]">
                        <th className="px-6 py-4 text-left text-sm font-bold text-[var(--color-text)]">
                            Clase
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[var(--color-text)]">
                            Profesor
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[var(--color-text)]">
                            Nivel
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[var(--color-text)]">
                            Horario
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[var(--color-text)]">
                            Estado
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[var(--color-text)]">
                            Modificar
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[var(--color-text)]">
                            Eliminar
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
                            className="border-b border-[var(--color-primary)] border-opacity-30 hover:bg-[var(--color-secondary)] hover:bg-opacity-10 transition-colors"
                        >
                            {/* Nombre de la clase */}
                            <td className="px-6 py-4">
                                <p className="font-semibold text-[var(--color-text)]">
                                    {classData?.title_class || "N/A"}
                                </p>
                                <p className="inline-block px-3 py-1 bg-[var(--color-primary)] bg-opacity-20 text-xs text-[var(--color-text)] rounded-full text-xs font-semibold capitalize mt-1">
                                    {classData?.description_class || "Sin descripción"}
                                </p>
                            </td>

                            {/* Profesor */}
                            <td className="px-6 py-4">
                                <p className="text-[var(--color-text)]">
                                    {classData?.teacher?.name_user || "No Disponible"}
                                </p>
                            </td>

                            {/* Nivel */}
                            <td className="px-6 py-4">
                                <span className="inline-block px-3 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-text)] rounded-full text-xs font-semibold capitalize">
                                    {classData?.level_class || "N/A"}
                                </span>
                            </td>

                            {/* Horario */}
                            <td className="px-6 py-4">
                                <p className="text-[var(--color-text)] text-sm">
                                    {scheduleData?.start_time || "N/A"} - {scheduleData?.end_time || ""}
                                </p>
                                <p className="text-xs text-[var(--color-text-secondary)]">
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
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleAttendanceToggle(enrollment.id_enrollment, attendanceToggle[enrollment.id_enrollment] ?? true)}
                                        disabled={loadingId === enrollment.id_enrollment || enrollment.status?.toLowerCase() === "cancelled"}
                                        className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors ${
                                            attendanceToggle[enrollment.id_enrollment] ?? true
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-red-500 hover:bg-red-600"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        title={attendanceToggle[enrollment.id_enrollment] ?? true ? "Puedo asistir - Click para no asistir" : "No puedo asistir - Click para asistir"}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                                attendanceToggle[enrollment.id_enrollment] ?? true ? "translate-x-7" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-xs font-semibold text-[var(--color-text)]">
                                        {attendanceToggle[enrollment.id_enrollment] ?? true ? "Asistir" : "No asistir"}
                                    </span>
                                </div>
                            </td>
                            
                            {/* Acciones */}
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    {/* Botón Cancelar */}
                                    <button
                                        onClick={() => handleDelete(enrollment.id_enrollment)}
                                        disabled={loadingId === enrollment.id_enrollment || enrollment.status?.toLowerCase() === "cancelled"}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Cancelar inscripción"
                                    >
                                        <Trash2 size={20} />
                                    </button>
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

