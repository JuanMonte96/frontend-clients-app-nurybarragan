import api from "./api.js";

export const getAllClasses = async () => {
  const { data } = await api.get("/api/classes/all");
  console.log("getAllClasses response:", data);
  // La API devuelve un objeto { classes: [...] , message, status }
  // Normalizamos para devolver siempre un array de clases.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.classes)) return data.classes;
  return [];
};