import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo_menu_nury_barragan.png';
import { loginService } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { refreshProfile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginService(email, password);
      console.log("Login exitoso:", data);
      console.log(data.user.id);
      await refreshProfile(data.user.id); 
      navigate("/user");
    } catch (err) {
      console.log(err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--color-header)] min-h-screen flex items-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-[var(--color-text)]">
          <img
            className="w-auto h-20 mr-2"
            src={logo}
            alt="logo"
          />
        </a>

        <div className="w-full bg-[var(--color-bg)] rounded-lg shadow sm:max-w-md xl:p-0 border border-[var(--color-primary)]">
          <div className="p-6 space-y-6">
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              Inicia sesión en tu cuenta
            </h1>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-accent)] block w-full p-2.5"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-accent)] block w-full p-2.5"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)] ">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 border rounded bg-[var(--color-header)] focus:ring-3 focus:ring-primary-300"
                  />
                  Recuérdame
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-[var(--color-text)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] font-semibold rounded-2xl text-sm px-5 py-2.5 "
              >
                {loading ? "Ingresando..." : "INICIAR SESIÓN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
