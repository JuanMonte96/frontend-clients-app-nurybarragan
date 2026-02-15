import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from '../../assets/final-logo-nb.png';
import { loginService } from "../../services/authServices";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const hasCheckedAuth = useRef(false);

  const { refreshProfile, profile } = useAuth();

  // Si el usuario ya está autenticado, redirigir a /user
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    
    if(profile?.id){
      navigate("/user");
    }
  }, []); // Array vacío - ejecutar solo una vez

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await loginService(email, password);
      console.log("Login successful:", data);
      console.log(data.user.id);
      setError(null);
      await refreshProfile(data.user.id); 
      navigate("/user");
    } catch (err) {
      // console.log("Error en login:", err);
      // console.log("Error response:", err.response);
      // console.log("Error response data:", err.response?.data);
      // console.log("Error message:", err.message);
      
      // Normalizar errores a un array de strings
      let errorArray = [];
      
      const errorData = err.response?.data;
      
      // console.log("Tipo de errorData:", typeof errorData);
      // console.log("errorData completo:", JSON.stringify(errorData));
      
      // Si viene como message string directo
      if (typeof errorData?.message === "string") {
        // console.log("Caso 1: message string");
        errorArray = [errorData.message];
      }
      // Si viene como un array de strings
      else if (Array.isArray(errorData?.message)) {
        // console.log("Caso 2: message array");
        errorArray = errorData.message;
      }
      // Si viene como un array de objetos {field, message}
      else if (Array.isArray(errorData?.errors)) {
        // console.log("Caso 3: errors array");
        errorArray = errorData.errors.map(err => {
          if (typeof err === "string") return err;
          if (err.message) return err.message;
          return JSON.stringify(err);
        });
      }
      // Si viene como un objeto de errores {field: message}
      else if (typeof errorData?.errors === "object" && errorData.errors !== null) {
        // console.log("Caso 4: errors object");
        errorArray = Object.values(errorData.errors).flat();
      }
      // Si el error viene como propiedad error
      else if (typeof errorData?.error === "string") {
        // console.log("Caso 5: error string");
        errorArray = [errorData.error];
      }
      // Último recurso
      else if (err.message) {
        // console.log("Caso 6: err.message");
        errorArray = [err.message];
      }
      // Si todo falla
      else {
        // console.log("Caso 7: fallback");
        errorArray = ["Error in login. Please try again."];
      }
      
      // console.log("Errores normalizados:", errorArray);
      setError(errorArray);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[var(--color-header)] to-[var(--color-text)] min-h-screen flex items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <Link to="/" className="flex items-center mb-6 text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
          <img
            className="h-12 sm:h-16 md:h-20 lg:h-28 w-auto object-contain max-w-[320px]"
            src={logo}
            alt="logo"
          />
        </Link>

        <div className="w-full bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] rounded-lg shadow sm:rounded-lg border border-[var(--color-primary)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
              {t('login.title')}
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-xs sm:text-sm">
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            )}

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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('login.password')}
                    className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-accent)] block w-full p-2.5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    )}
                  </button>
                </div>
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
                className="w-full text-[var(--color-text)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] font-semibold rounded-2xl text-sm px-5 py-2.5"
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
