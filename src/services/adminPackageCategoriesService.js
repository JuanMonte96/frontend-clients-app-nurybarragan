import api from "./api";

export const getAdminPackageCategories = async (params = {}) => {
  const { data } = await api.get("/api/packages/admin/categories", { params });
  return data;
};

export const getAdminPackageCategoryDetail = async (idCategory) => {
  const { data } = await api.get(`/api/packages/admin/categories/${idCategory}`);
  return data;
};

export const createAdminPackageCategory = async (payload) => {
  const { data } = await api.post("/api/packages/admin/categories", payload);
  return data;
};

export const updateAdminPackageCategory = async (idCategory, payload) => {
  const { data } = await api.patch(`/api/packages/admin/categories/${idCategory}`, payload);
  return data;
};

export const updateAdminPackageCategoryStatus = async (idCategory, active) => {
  const { data } = await api.patch(`/api/packages/admin/categories/${idCategory}/status`, { active });
  return data;
};

export const reorderAdminPackageCategories = async (items) => {
  const { data } = await api.patch("/api/packages/admin/categories/reorder", { items });
  return data;
};

export const deleteAdminPackageCategory = async (idCategory) => {
  const { data } = await api.delete(`/api/packages/admin/categories/${idCategory}`);
  return data;
};
