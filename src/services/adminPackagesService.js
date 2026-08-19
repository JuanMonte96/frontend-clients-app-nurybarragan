import api from "./api";

export const getAdminPackages = async (params = {}) => {
  const { data } = await api.get("/api/packages/admin/list", { params });
  return data;
};

export const getAdminPackageDetail = async (idPackage) => {
  const { data } = await api.get(`/api/packages/admin/${idPackage}`);
  return data;
};

export const createAdminPackage = async (payload) => {
  const { data } = await api.post("/api/packages/admin/create", payload);
  return data;
};

export const updateAdminPackage = async (idPackage, payload) => {
  const { data } = await api.patch(`/api/packages/admin/${idPackage}`, payload);
  return data;
};

export const updateAdminPackageAvailability = async (idPackage, availabilty) => {
  const { data } = await api.patch(`/api/packages/admin/${idPackage}/availability`, { availabilty });
  return data;
};

export const reorderAdminPackages = async (idCategory, items) => {
  const { data } = await api.patch("/api/packages/admin/reorder", { id_category: idCategory, items });
  return data;
};

export const retryAdminPackageStripeSync = async (idPackage) => {
  const { data } = await api.post(`/api/packages/admin/${idPackage}/retry-stripe-sync`);
  return data;
};
