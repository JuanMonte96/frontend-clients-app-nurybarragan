import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from '../../assets/final-logo-nb.png';
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
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
        <section className="bg-[var(--color-header)] min-h-screen flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-6 sm:py-8">
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

            <div className="w-full bg-[var(--color-bg)] rounded-lg sm:rounded-xl shadow sm:max-w-md xl:p-0">
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-tight text-[var(--color-text)] text-center">
                        {t('changePassword.title')}
                    </h1>

                    <p className="text-xs sm:text-sm text-[var(--color-text)] text-center">
                        {t('changePassword.description')}
                    </p>

                    <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Contraseña actual */}
                        <div>
                            <label
                                htmlFor="current_password"
                                className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.currentPassword')}
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            />
                        </div>

                        {/* Nueva contraseña */}
                        <div>
                            <label
                                htmlFor="new_password"
                                className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.newPassword')}
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            />
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label
                                htmlFor="confirm_password"
                                className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-[var(--color-text)]"
                            >
                                {t('changePassword.confirmPassword')}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            />
                        </div>

                        {/* Mensajes */}
                        {error && (
                            <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-600 text-xs sm:text-sm font-medium">{success}</p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full text-[var(--color-button_text)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] font-semibold rounded-2xl sm:rounded-3xl text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5"
                        >
                            {t('changePassword.update')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

