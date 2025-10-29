import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ej: http://localhost:3000
});

// Adjunta token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo global de respuestas (401 / must_change_password)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 401) {
      // token inválido o expirado
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (status === 400 && data?.must_change_pass) {
      window.location.href = "/changePassword";
    }
    return Promise.reject(error);
  }
);

export default api;