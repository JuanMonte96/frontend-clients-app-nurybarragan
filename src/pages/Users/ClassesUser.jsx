import React, { useEffect } from "react";
import { ClassesList } from "../../components/ClassesList";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";

export const ClassesUser = () => {
    const { fetchClassesRemaining } = useClasses();

    useEffect(() => {
        fetchClassesRemaining();
    }, [fetchClassesRemaining]);

    return (
        <div className="space-y-6">
            {/* Card de clases restantes */}
            <ClassesRemainingCard />

            {/* Lista de clases disponibles */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Clases Disponibles</h1>
                <ClassesList />
            </div>
        </div>
    );
}