import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from '../../assets/final-logo-nb.webp';
import api from "../../services/api";

export const ChangePassword = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleCancel = async () => {
        try {
            // Verificar si existe token
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            // Intentar verificar si el token es válido haciendo una petición simple
            await api.get("/api/users/profile");
            // Si la petición es exitosa, ir a /user
            navigate("/user");
        } catch (err) {
            // Si hay error (token expirado, inválido, etc), ir a /login
            navigate("/login");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError(t('changePassword.error') || "Las contraseñas nuevas no coinciden");
            return; 
        }

        try {
            const token = localStorage.getItem("token");
            const res = await api.put(
                "/api/users/changePassword",
                {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                setSuccess(t('changePassword.success') || "Tu contraseña ha sido actualizada correctamente ✅");
                setTimeout(() => {
                    navigate("/user"); // o "/login" si quieres forzar nuevo inicio de sesión
                }, 1500);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Hubo un error al actualizar tu contraseña. Intenta nuevamente."
            );
        }
    };

    return (
        <section className="bg-gradient-to-br from-[var(--color-header)] to-[var(--color-text)] min-h-screen flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-6 sm:py-8">
            <a
                href="/"
                className="flex items-center mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold"
            >
                <img
                    className="w-auto h-14 sm:h-16 md:h-20 mr-2"
                    src={logo}
                    alt="Logo"
                />
            </a>

            <div className="w-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-bg)] rounded-lg sm:rounded-xl shadow sm:max-w-md xl:p-0">
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-tight text-[var(--color-text)] text-center">
                        {t('changePassword.title')}
                    </h1>

                    <p className="text-md sm:text-md text-[var(--color-text)] text-center font-semibold">
                        {t('changePassword.description')}
                    </p>

                    <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Contraseña actual */}
                        <div>
                            <label
                                htmlFor="current_password"
                                className="block mb-1 sm:mb-2 text-md sm:text-md font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.currentPassword')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={form.currentPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-md sm:text-md rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                    aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showCurrentPassword ? (
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

                        {/* Nueva contraseña */}
                        <div>
                            <label
                                htmlFor="new_password"
                                className="block mb-1 sm:mb-2 text-md sm:text-md font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.newPassword')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-md sm:text-md rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showNewPassword ? (
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

                        {/* Confirmar contraseña */}
                        <div>
                            <label
                                htmlFor="confirm_password"
                                className="block mb-1 sm:mb-2 text-md sm:text-md font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.confirmPassword')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-md sm:text-md rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showConfirmPassword ? (
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

                        {/* Mensajes */}
                        {error && (
                            <p className="text-red-600 text-md sm:text-md font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-600 text-md sm:text-md font-medium">{success}</p>
                        )}

                        {/* Botones */}
                        <div className="flex gap-4 justify-center w-full pt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] bg-gradient-to-r from-[var(--color-header)] to-[var(--color-text)] rounded-lg hover:shadow-lg transition-all duration-200 active:scale-95"
                            >
                                {t('common.cancel') || 'Cancelar'}
                            </button>
                            <button
                                type="submit"
                                className="px-6 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[var(--color-button_text)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gradient-button)] rounded-lg hover:shadow-lg transition-all duration-200 active:scale-95"
                            >
                                {t('changePassword.update')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

