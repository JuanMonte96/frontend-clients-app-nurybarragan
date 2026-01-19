import { useEffect } from "react";
import { EnrollList } from "../../components/EnrollList";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";

export const EnrolmentUser = () => {
    const { fetchClassesRemaining, fetchEnrollments } = useClasses();

    useEffect(() => {
        // Carga ambos datos al montar el componente
        Promise.all([fetchClassesRemaining(), fetchEnrollments()]);
    }, [fetchClassesRemaining, fetchEnrollments]);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)]">Mis Inscripciones</h1>
                {/* Card de clases restantes - se actualiza automáticamente cuando cambia el contexto */}
                <div className="w-full sm:w-auto">
                  <ClassesRemainingCard />
                </div>
            </div>
            <EnrollList />
        </div>
    );
};

export default EnrolmentUser;
