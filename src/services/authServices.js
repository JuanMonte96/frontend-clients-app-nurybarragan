import api from "./api";
import { getTimezoneInfo } from "./timezone";

export const loginService = async (email, password) => {
  try {
    const timezoneInfo = getTimezoneInfo();

    const { data } = await api.post("/api/users/login", {
      email,
      password,
      timezone: timezoneInfo.timezone
    });

    if(!data.token || !data.user?.id){
      throw new Error(data.message || 'Invalid Credential, Please try again');
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("id_user", data.user.id);

    return data;
  } catch (error) {
    console.error("Error en loginService:", error.response?.data || error.message);
    throw {
      response: error.response,
      message: error.response?.data?.message || error.response?.data?.error || "Error al iniciar sesión",
      errors: error.response?.data?.errors || null
    };
  }
};

export const getProfile = async (id_user) => {
  const { data } = await api.get(`/api/users/profile/${id_user}`)
  console.log(data);
  return data;
}

export const getClassesRemaining = async () => {
  const { data } = await api.get("/api/users/classRemaining")
  console.log(data);
  return data
}