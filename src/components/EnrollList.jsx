import { useState, useEffect } from "react";
import { getAllEnrollmentsByUser} from "../services/enrollmentService";
import { EnrolTable } from "./EnrolTable";

export const EnrollList = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

     useEffect(() => {
            let mounted = true;
            setLoading(true);
                getAllEnrollmentsByUser()
                        .then(response => {
                            if (!mounted) return;
                            // Normaliza la respuesta - puede ser array o objeto con enrollments
                            const list = Array.isArray(response)
                                ? response
                                : Array.isArray(response?.enrollments)
                                    ? response.enrollments
                                    : [];
                            console.log('Enrollments recibidos:', list);
                            setEnrollments(list);
                    })
                .catch(err => {
                    if (mounted)
                        setError(err.message);
                })
                .finally(() => {
                    if (mounted)
                        setLoading(false);
                });
            return () => { mounted = false }
        }, []);
    //TO DO: Construir el renderizado del cargando no solo palabras
    if (loading) return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                <p className="mt-4 text-[var(--color-text)]">Cargando Clases...</p>
            </div>
        </div>
    )

    if(error) return (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            Error: {error}
        </div>
    );
    if (enrollments.length === 0) return (
        <div className="bg-[var(--color-bg)] border border-[var(--color-primary)] text-[var(--color-text)] px-4 py-3 rounded-lg text-center">
            No hay Inscripciones para mostrar
        </div>
    )
    return (
        <div className="p-4">
            <EnrolTable enrollments={enrollments} />
        </div>
    );
};