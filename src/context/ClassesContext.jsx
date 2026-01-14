import { createContext, useContext, useState, useCallback } from "react";
import { getClassesRemaining } from "../services/authServices";

const ClassesContext = createContext();

export const ClassesProvider = ({ children }) => {
  const [classesRemaining, setClassesRemaining] = useState(null);
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

  // Actualiza el estado localmente sin hacer llamada al backend
  const updateClassesRemaining = useCallback((newData) => {
    setClassesRemaining(newData);
  }, []);

  const value = {
    classesRemaining,
    loading,
    error,
    fetchClassesRemaining,
    updateClassesRemaining,
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
