import api from "./api.js";

export const getAllScheduleByClass= async (id) => {
  const { data } = await api.get(`/api/schedule/schedulesByClass/${id}`);
  console.log("getAllScheduleByClass response:", data);
  // La API devuelve un objeto { schedules: [...] , message, status }
  // Normalizamos para devolver siempre un array de horarios.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.schedules)) return data.schedules;
  return [];
};