import { useEffect } from "react";
import { EnrollList } from "../../components/EnrollList";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";

export const EnrolmentUser = () => {
    const { fetchClassesRemaining } = useClasses();

    useEffect(() => {
        fetchClassesRemaining();
    }, [fetchClassesRemaining]);

    return (
        <div className="space-y-6">
            {/* Card de clases restantes */}
            <ClassesRemainingCard />

            {/* Lista de inscripciones */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Mis Inscripciones</h1>
                <EnrollList />
            </div>
        </div>
    );
};

export default EnrolmentUser;
