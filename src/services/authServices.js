import axios from "axios";

export const loginService = async (email, password) => {
  const API_LOGIN = import.meta.env.VITE_API_POST_LOGIN;
  try {
    const { data } = await axios.post(API_LOGIN, {
      email,
      password,
    });
    // guarda token o session
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión con el usuario correspondiente");
  }
};

export const getprofile = async (id_user) => {
  const API_PROFILE = import.meta.env.VITE_API_GET_PROFILE;
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_PROFILE}/${id_user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
