import React, { useState } from "react";
import { getAllScheduleByClass } from "../services/scheduleService";


export const ClassCard = ({ classData }) => {
    const { id_class, title_class, level_class, teacher, description_class, is_blocked } = classData;

    const [showSchedules, setShowSchedules] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [error, setError] = useState(null);

    const handleShowSchedules = async () => {
        if (showSchedules) {
            setShowSchedules(false);
            return;
        }
        setLoadingSchedules(true);
        setError(null);
        try {
            const data = await getAllScheduleByClass(id_class);
            console.log(data)
            const list = Array.isArray(data) ? data : Array.isArray(data?.schedules) ? data.schedules : [];
            setSchedules(list);
        } catch (error) {
            console.error(`Error fetching schedules from the class: ${error}`)
            setError(`Error fetching schedules: ${error.message}`);

        } finally {
            setLoadingSchedules(false);
        }
        setShowSchedules(true);
    };

    return (
        <article className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-primary)] shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            {/* Encabezado con título y estado */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-[var(--color-text)] flex-1">{title_class}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${is_blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                >
                    {is_blocked ? "Bloqueada" : "Disponible"}
                </span>
            </div>

            {/* Profesor */}
            <div className="mb-3">
                <p className="text-sm text-[var(--color-text)] font-semibold">
                    Profesor: <span className="text-[var(--color-text)]">{teacher.name_user}</span>
                </p>
            </div>

            {/* Descripción */}
            <p className="text-[var(--color-text)] text-sm mb-4 line-clamp-2">
                {description_class}
            </p>

            {/* Nivel */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-primary)] border-opacity-30 mb-4">
                <span className="inline-block px-3 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-text)] rounded-lg text-xs font-semibold capitalize">
                    {level_class}
                </span>
            </div>

            {/* Botón Ver Horarios */}
            <button
                onClick={handleShowSchedules}
                className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-80 transition font-semibold text-sm"
            >
                {showSchedules ? "Ocultar horarios ▲" : "Ver horarios ▼"}
            </button>

            {/* SECCIÓN EXPANDIBLE DE HORARIOS */}
            {showSchedules && (
                <div className="mt-4 pt-4 border-t border-[var(--color-primary)] border-opacity-30">
                    {loadingSchedules ? (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                            <p className="text-sm text-[var(--color-text)] mt-2">Cargando horarios...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    ) : schedules.length > 0 ? (
                        <div className="space-y-3">
                            {schedules.map(schedule => (
                                <div
                                    key={schedule.id_schedule}
                                    className="bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-primary)] border-opacity-30 hover:border-opacity-60 transition"
                                >
                                    {/* Fecha y horario */}
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-[var(--color-text)]">
                                            📅 {new Date(schedule.date_class).toLocaleDateString("es-CO")}
                                        </p>
                                        <p className="text-xs text-[var(--color-text)] mt-1">
                                            🕐 {schedule.start_time} - {schedule.end_time}
                                        </p>
                                        <p className="text-xs text-[var(--color-text)] mt-1">
                                            {schedule.time_zone_user}
                                        </p>
                                    </div>

                                    {/* Estado activo */}
                                    <div className="mb-3">
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${schedule.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {schedule.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            className="py-2 px-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-80 transition text-xs font-semibold"
                                            onClick={() => handleEnroll(schedule.id_schedule)}
                                        >
                                            ✓ Enlistarse
                                        </button>
                                        <button
                                            className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs font-semibold"
                                            onClick={() => handleRemoveEnrollment(schedule.id_schedule)}
                                        >
                                            ✕ Quitar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-[var(--color-text)]">Sin horarios disponibles</p>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
};
