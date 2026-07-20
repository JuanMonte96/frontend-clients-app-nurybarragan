import api from "./api";

export const getAdminScheduleRoster = async (scheduleId, params = {}) => {
  const { data } = await api.get(`/api/attendance/admin/roster/${scheduleId}`, { params });
  return data;
};

export const markManualAttendance = async ({ enrollmentId, userId, status = "attended" }) => {
  const { data } = await api.post("/api/attendance/manual-attendance", {
    enrollmentId,
    userId,
    status,
  });
  return data;
};

export const scanQrAttendance = async (scheduleId, status = "attended") => {
  const { data } = await api.post(`/api/attendance/scan-qr/${scheduleId}`, { status });
  return data;
};

export const getScheduleQrImage = async (scheduleId) => {
  const { data } = await api.get(`/api/schedule/qr-schedule/${scheduleId}`);
  return data;
};
