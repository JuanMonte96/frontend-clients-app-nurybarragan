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

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.user.id) {
      localStorage.setItem("id_user", data.user.id)
    }

    return data;
  } catch (error) {
    throw {
      response: error.response,
      message: error.response?.data?.message || "Error al iniciar sesión",
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