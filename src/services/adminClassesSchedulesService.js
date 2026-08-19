import api from "./api.js";

export const getAdminClasses = async () => {
  const { data } = await api.get("/api/classes/all");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.classes)) return data.classes;
  return [];
};

export const getAdminClassDetail = async (classId) => {
  const { data } = await api.get(`/api/classes/admin/${classId}`);
  return data;
};

export const createAdminClass = async (payload) => {
  const { data } = await api.post("/api/classes/create", payload);
  return data;
};

export const updateAdminClass = async (payload) => {
  const { data } = await api.put("/api/classes/update", payload);
  return data;
};

export const toggleAdminClassStatus = async (classId, isBlocked) => {
  const { data } = await api.patch(`/api/classes/admin/${classId}/status`, { isBlocked });
  return data;
};

export const getAdminSchedulesByClass = async (classId, params = {}) => {
  const { data } = await api.get(`/api/schedule/schedulesByClass/${classId}`, { params });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.schedules)) return data.schedules;
  return [];
};

export const getAdminScheduleDetail = async (scheduleId) => {
  const { data } = await api.get(`/api/schedule/scheduleBy/${scheduleId}`);
  return data;
};

export const createAdminUniqueSchedule = async (payload) => {
  const { data } = await api.post("/api/schedule/create-schedule-unic", payload);
  return data;
};

export const createAdminRecurringSchedule = async (payload) => {
  const { data } = await api.post("/api/schedule/class-schedule-template", payload);
  return data;
};

export const updateAdminSchedule = async (scheduleId, payload) => {
  const { data } = await api.patch(`/api/schedule/admin/${scheduleId}`, payload);
  return data;
};

export const toggleAdminScheduleStatus = async (scheduleId, isActive) => {
  const { data } = await api.patch(`/api/schedule/admin/${scheduleId}/status`, { isActive });
  return data;
};

export const cancelAdminSchedule = async (scheduleId, payload) => {
  const { data } = await api.post(`/api/schedule/admin/${scheduleId}/cancel`, payload);
  return data;
};
