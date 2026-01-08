import { EnrollList } from "../../components/EnrollList";

export const EnrolmentUser = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Mis Inscripciones</h1>
            <EnrollList />
        </div>
    );
};

export default EnrolmentUser;
