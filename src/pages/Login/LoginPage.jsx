import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
    <section className="bg-[var(--color-header)] min-h-screen flex items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <Link to="/" className="flex items-center mb-6 text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
          <img
            className="w-auto h-14 sm:h-16 md:h-20 mr-2"
            src={logo}
            alt="logo"
          />
        </Link>

        <div className="w-full bg-[var(--color-bg)] rounded-lg shadow sm:rounded-lg border border-[var(--color-primary)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
              {t('login.title')}
            </h1>

            {error && <div className="text-red-600 text-xs sm:text-sm bg-red-100 border border-red-400 p-2 rounded">{error}</div>}

            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('contact.email')}
                  className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-accent)] block w-full p-2.5"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('login.password')}
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
                  {t('login.rememberMe')}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-[var(--color-text)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] font-semibold rounded-2xl text-sm px-5 py-2.5"
              >
                {loading ? t('common.loading') : t('login.signin')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
