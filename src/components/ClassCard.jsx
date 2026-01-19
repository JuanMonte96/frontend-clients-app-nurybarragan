import React, { useState } from "react";
import { getAllScheduleByClass } from "../services/scheduleService";
import { enrollClass } from "../services/enrollmentService";
import { formatDateInTimezone, getUserTimezone } from "../services/timezone";
import { useTranslation } from "react-i18next";

export const ClassCard = ({ classData }) => {   
    const { t } = useTranslation();
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

    const handleEnroll = async (id_schedule) => {
        try {
            const response = await enrollClass(id_schedule);
            console.log(response)
            alert ("Inscripción exitosa");
        } catch (error) {
            const {response} = error; 
            alert (`Error during enrollment: ${response?.data?.message || error.message}`);
        }
    }

    return (
        <article className="bg-[var(--color-bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--color-primary)] shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 flex flex-col h-full">
            {/* Encabezado con título y estado */}
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-3 mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] flex-1 break-words">{title_class}</h3>
                <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${is_blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                >
                    {is_blocked ? "Bloqueada" : "Disponible"}
                </span>
            </div>

            {/* Profesor */}
            <div className="mb-3">
                <p className="text-xs sm:text-sm text-[var(--color-text)] font-semibold line-clamp-2">
                    {t("classes.professor")}: <span className="text-[var(--color-text)]">{teacher.name_user}</span>
                </p>
            </div>

            {/* Descripción */}
            <p className="text-[var(--color-text)] text-xs sm:text-sm mb-4 line-clamp-2 flex-grow">
                {description_class}
            </p>

            {/* Nivel */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[var(--color-primary)] border-opacity-30 mb-4">
                <span className="inline-block px-2 sm:px-3 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-text)] rounded-lg text-xs font-semibold capitalize">
                    {level_class}
                </span>
            </div>

            {/* Botón Ver Horarios */}
            <button
                onClick={handleShowSchedules}
                className="w-full py-2 px-3 sm:px-4 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-80 transition font-semibold text-xs sm:text-sm"
            >
                {showSchedules ? "Ocultar horarios ▲" : "Ver horarios ▼"}
            </button>

            {/* SECCIÓN EXPANDIBLE DE HORARIOS */}
            {showSchedules && (
                <div className="mt-4 pt-4 border-t border-[var(--color-primary)] border-opacity-30">
                    {loadingSchedules ? (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-[var(--color-primary)]"></div>
                            <p className="text-xs sm:text-sm text-[var(--color-text)] mt-2">{t("common.loading")}...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm">
                            {error}
                        </div>
                    ) : schedules.length > 0 ? (
                        <div className="space-y-2 sm:space-y-3">
                            {schedules.map(schedule => (
                                <div
                                    key={schedule.id_schedule}
                                    className="bg-[var(--color-bg)] p-3 sm:p-4 rounded-lg border border-[var(--color-primary)] border-opacity-30 hover:border-opacity-60 transition"
                                >
                                    {/* Fecha y horario */}
                                    <div className="mb-3">
                                        <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                                            📅 {formatDateInTimezone(schedule.date_class, schedule.time_zone_user || "Europe/Paris", getUserTimezone()).split('-').reverse().join('/')}
                                        </p>
                                        <p className="text-xs text-[var(--color-text)] mt-1">
                                            🕐 {schedule.start_time} - {schedule.end_time}
                                        </p>
                                        <p className="text-xs text-[var(--color-text)] mt-1 truncate">
                                            📍 {schedule.time_zone_user}
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
                                            {schedule.is_active ? `${t('profile.active')}` : `${t('profile.cancelled')}`}
                                        </span>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            className="py-2 px-2 sm:px-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-80 transition text-xs sm:text-sm font-semibold w-full"
                                            onClick={() => handleEnroll(schedule.id_schedule)}
                                        >
                                            ✓ {t("classes.enroll")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-xs sm:text-sm text-[var(--color-text)]">{t("classes.noClasses")}</p>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
};
