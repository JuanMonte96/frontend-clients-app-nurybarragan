import api from "./api";

export const getPublicPackageCatalog = async () => {
  const { data } = await api.get("/api/packages/public/catalog");
  return data;
};
