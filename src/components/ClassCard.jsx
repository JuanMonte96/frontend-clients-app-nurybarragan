import React from "react";

export const ClassCard = ({ classData }) => {
    const { id_class, title_class, level_class, teacher, description_class, is_blocked } = classData;
    return (
        <article className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-primary)] shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
            {/* Encabezado con título y estado */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-[var(--color-text)] flex-1">{title_class}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                        is_blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {is_blocked ? "Bloqueada" : "Disponible"}
                </span>
            </div>

            {/* Profesor */}
            <div className="mb-3">
                <p className="text-sm text-[var(--color-text-secondary)] font-semibold">
                    Profesor: <span className="text-[var(--color-primary)]">{teacher.name_user}</span>
                </p>
            </div>

            {/* Descripción */}
            <p className="text-[var(--color-text)] text-sm mb-4 line-clamp-2">
                {description_class}
            </p>

            {/* Pie con nivel */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-primary)] border-opacity-30">
                <div>
                    <span className="inline-block px-3 py-1 bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-primary)] rounded-lg text-xs font-semibold capitalize">
                        {level_class}
                    </span>
                </div>
            </div>
        </article>
    )
}