import api from "./api";

export const getAdminUsersList = async (params = {}) => {
  const { data } = await api.get("/api/users/admin/list", { params });
  return data;
};

export const getAdminUserDetail = async (id_user, params = {}) => {
  const { data } = await api.get(`/api/users/${id_user}/detail`, { params });
  return data;
};

export const getAdminUserPayments = async (id_user, params = {}) => {
  const { data } = await api.get(`/api/users/${id_user}/payments`, { params });
  return data;
};

export const getAdminUserSubscriptions = async (id_user, params = {}) => {
  const { data } = await api.get(`/api/users/${id_user}/subscriptions`, { params });
  return data;
};

export const getMedicalCertificateViewUrl = async (id_user) => {
  const { data } = await api.get(`/api/users/${id_user}/medical-certificate/url`);
  return data;
};

export const setAdminUserBlockStatus = async (id_user, is_blocked) => {
  const { data } = await api.patch(`/api/users/${id_user}/block-status`, { is_blocked });
  return data;
};
