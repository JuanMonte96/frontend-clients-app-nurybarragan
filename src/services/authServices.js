import api from "./api";

export const loginService = async (email, password) => {
  try {
    const { data } = await api.post("/api/users/login", { email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if(data?.user.id){
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
