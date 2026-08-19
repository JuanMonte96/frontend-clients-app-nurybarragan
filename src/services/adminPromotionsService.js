import api from "./api";

export const getAdminPromotions = async (params = {}) => {
  const { data } = await api.get("/api/promotions/admin", { params });
  return data;
};

export const createAdminPromotion = async (payload) => {
  const { data } = await api.post("/api/promotions/admin", payload);
  return data;
};

export const updateAdminPromotion = async (idPromotion, payload) => {
  const { data } = await api.patch(`/api/promotions/admin/${idPromotion}`, payload);
  return data;
};

export const updateAdminPromotionStatus = async (idPromotion, isActive) => {
  const { data } = await api.patch(`/api/promotions/admin/${idPromotion}/status`, { is_active: isActive });
  return data;
};

export const archiveAdminPromotion = async (idPromotion) => {
  const { data } = await api.post(`/api/promotions/admin/${idPromotion}/archive`);
  return data;
};

export const markAdminBenefitUsed = async (idPromotion, payload) => {
  const { data } = await api.post(`/api/promotions/admin/${idPromotion}/benefit-used`, payload);
  return data;
};

export const getPublicPromotions = async () => {
  const { data } = await api.get("/api/promotions/public");
  return data;
};
