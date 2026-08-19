import api from "./api";

export const getPublicPromotions = async () => {
  const { data } = await api.get("/api/promotions/public");
  return data;
};
