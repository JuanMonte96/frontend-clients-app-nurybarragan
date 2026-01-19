import React, { useState, useEffect } from "react";
import { getAllClasses } from "../services/classesService";
import { ClassCard } from "./ClassCard.jsx";

export const ClassesList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
            getAllClasses()
                    .then(response => {
                        if (!mounted) return;
                        // El servicio ahora normaliza la respuesta para devolver un array,
                        // pero por seguridad aceptamos las dos formas:
                        // - response es un array
                        // - response es un objeto con response.classes
                        const list = Array.isArray(response)
                            ? response
                            : Array.isArray(response?.classes)
                                ? response.classes
                                : [];
                        setClasses(list);
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
        <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-[var(--color-primary)]"></div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[var(--color-text)]">Cargando Clases...</p>
            </div>
        </div>
    )
    //TO DO: Construir el renderizado del error no solo palabras
    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 text-xs sm:text-sm">
            Error: {error}
        </div>
    )
    if (classes.length === 0) return (
        <div className="bg-[var(--color-bg)] border border-[var(--color-primary)] text-[var(--color-text)] px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm">
            No hay Clases para mostrar
        </div>
    )

    return(
        <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {classes.map(classData => <ClassCard key={classData.id_class} classData={classData} />)}
            </div>
        </section>
    )
}