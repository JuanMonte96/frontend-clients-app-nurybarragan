import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo_menu_nury_barragan.png';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const API_LOGIN = import.meta.env.VITE_API_POST_LOGIN
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(API_LOGIN, {
        email,
        password,
      });

      console.log(data.token);
      // guarda token o session
      localStorage.setItem("token", data.token);
      navigate("/user"); // redirige a inicio o panel del usuario
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#fff8e1] dark:bg-[#2c2c2c] min-h-screen flex items-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-[#3333] dark:text-white">
          <img
            className="w-auto h-20 mr-2"
            src={logo}
            alt="logo"
          />
        </a>

        <div className="w-full bg-[#fff8e1] rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-[#fff8e1] dark:border-[#ffb300]">
          <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold text-[#333333] dark:text-[#ffb300]">
              Inicia sesión en tu cuenta
            </h1>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#ffc107] dark:text-[#333333]">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#fff8e1] border border-[#333333] text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#333333] dark:border-[#ffb300] dark:placeholder-[#fff8e1] dark:text-[#fff8e1]"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#ffc107] dark:text-[#333333]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#fff8e1] border border-[#333333] text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#333333] dark:border-[#ffb300] dark:placeholder-[#fff8e1] dark:text-[#fff8e1]"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[#fff8e1] dark:text-[#333333]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 border rounded bg-[#fff8e1] focus:ring-3 focus:ring-primary-300 dark:bg-[#333333] dark:border-[#333333]"
                  />
                  Recuérdame
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-[#333333] bg-primary-600 hover:bg-[#ffb300] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-[#fff8e1] dark:hover:bg-[#ffb300] dark:focus:ring-[#ffb300]"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
