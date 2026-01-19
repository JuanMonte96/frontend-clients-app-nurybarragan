import { useEffect } from "react";
import { ClassesList } from "../../components/ClassesList";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";

export const ClassesUser = () => {
    const { fetchClassesRemaining } = useClasses();

    useEffect(() => {
        fetchClassesRemaining();
    }, [fetchClassesRemaining]);

    return (
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)]">Clases Disponibles</h1>
                  <div className="w-full sm:w-auto">
                    <ClassesRemainingCard />
                  </div>
                </div>
                <ClassesList />
            </div>
    );
}