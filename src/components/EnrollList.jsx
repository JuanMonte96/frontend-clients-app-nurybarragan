import { useState, useEffect } from "react";
import { getAllEnrollmentsByUser} from "../services/enrollmentService";
import { useClasses } from "../context/ClassesContext";
import { EnrolTable } from "./EnrolTable";

export const EnrollList = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchEnrollments, enrollments: contextEnrollments, fetchClassesRemaining } = useClasses();

     useEffect(() => {
            let mounted = true;
            setLoading(true);
            
            // Si ya hay enrollments en el contexto, úsalos
            if (contextEnrollments.length > 0) {
                setEnrollments(contextEnrollments);
                setLoading(false);
                return;
            }
            
            // Si no, trae del servicio
            getAllEnrollmentsByUser()
                    .then(response => {
                        if (!mounted) return;
                        // Normaliza la respuesta - puede ser array u objeto con enrollments
                        const list = Array.isArray(response)
                            ? response
                            : Array.isArray(response?.enrollments)
                                ? response.enrollments
                                : [];
                        console.log('Enrollments recibidos:', list);
                        setEnrollments(list);
                        // También actualiza el contexto
                        fetchEnrollments();
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
        }, [contextEnrollments.length, fetchEnrollments]);
    //TO DO: Construir el renderizado del cargando no solo palabras
    if (loading) return (
        <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-[var(--color-primary)]"></div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[var(--color-text)]">Cargando Clases...</p>
            </div>
        </div>
    )

    if(error) return (
         <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 text-xs sm:text-sm">
            Error: {error}
        </div>
    );
    if (enrollments.length === 0) return (
        <div className="bg-[var(--color-bg)] border border-[var(--color-primary)] text-[var(--color-text)] px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm">
            No hay Inscripciones para mostrar
        </div>
    )
    return (
        <div className="p-2 sm:p-4">
            <EnrolTable enrollments={enrollments} />
        </div>
    );
};