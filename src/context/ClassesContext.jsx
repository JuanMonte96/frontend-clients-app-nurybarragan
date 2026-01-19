import { createContext, useContext, useState, useCallback } from "react";
import { getClassesRemaining } from "../services/authServices";
import { getAllEnrollmentsByUser } from "../services/enrollmentService";

const ClassesContext = createContext();

export const ClassesProvider = ({ children }) => {
  const [classesRemaining, setClassesRemaining] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtiene las clases restantes del backend
  const fetchClassesRemaining = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClassesRemaining();
      setClassesRemaining(data);
    } catch (err) {
      setError(err.message || "Error al obtener clases restantes");
      console.error("Error fetching classes remaining:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtiene los enrollments del usuario
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEnrollmentsByUser();
      // Normaliza la respuesta - puede ser array o objeto con enrollments
      const enrollmentsList = Array.isArray(data)
        ? data
        : Array.isArray(data?.enrollments)
          ? data.enrollments
          : [];
      setEnrollments(enrollmentsList);
    } catch (err) {
      setError(err.message || "Error al obtener inscripciones");
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualiza un enrollment específico en el estado global
  const updateEnrollmentStatus = useCallback((enrollmentId, newStatus) => {
    setEnrollments(prev =>
      prev.map(enrollment =>
        enrollment.id_enrollment === enrollmentId
          ? { ...enrollment, status: newStatus }
          : enrollment
      )
    );
  }, []);

  // Actualiza el estado localmente sin hacer llamada al backend
  const updateClassesRemaining = useCallback((newData) => {
    setClassesRemaining(newData);
  }, []);

  // Refresca tanto clases restantes como enrollments
  const refreshAllData = useCallback(async () => {
    await Promise.all([fetchClassesRemaining(), fetchEnrollments()]);
  }, [fetchClassesRemaining, fetchEnrollments]);

  const value = {
    classesRemaining,
    enrollments,
    loading,
    error,
    fetchClassesRemaining,
    fetchEnrollments,
    updateClassesRemaining,
    updateEnrollmentStatus,
    refreshAllData,
  };

  return (
    <ClassesContext.Provider value={value}>
      {children}
    </ClassesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error("useClasses debe ser usado dentro de ClassesProvider");
  }
  return context;
};
