import React from "react";
import { ClassesList } from "../../components/ClassesList";

export const ClassesUser = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Clases Disponibles</h1>
            <ClassesList />
        </div>
    );
}