import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo_menu_nury_barragan.png';

export const ChangePassword = () => {
    const navigate = useNavigate();
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
            setError("Las contraseñas nuevas no coinciden");
            return; 
        }

        const API_CHANGE_PASSWORD = import.meta.env.VITE_API_PUT_CHANGE_PASSWORD

        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${API_CHANGE_PASSWORD}`,
                {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                setSuccess("Tu contraseña ha sido actualizada correctamente ✅");
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
        <section className="bg-[var(--color-header)] min-h-screen flex flex-col justify-center items-center px-6 py-8">
            <a
                href="/"
                className="flex items-center mb-6 text-2xl font-semibold "
            >
                <img
                    className="w-auto h-20 mr-2"
                    src={logo}
                    alt="Logo"
                />
            </a>

            <div className="w-full bg-[var(--color-bg)] rounded-lg shadow sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-[var(--color-text)] md:text-2xl text-center">
                        Cambia tu contraseña
                    </h1>

                    <p className="text-sm text-[var(--color-text)] text-center">
                        Por seguridad, debes actualizar tu contraseña antes de continuar.
                    </p>

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Contraseña actual */}
                        <div>
                            <label
                                htmlFor="current_password"
                                className="block mb-2 text-sm font-medium text-[var(--color-text)]"
                            >
                                Contraseña actual
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2.5"
                            />
                        </div>

                        {/* Nueva contraseña */}
                        <div>
                            <label
                                htmlFor="new_password"
                                className="block mb-2 text-sm font-medium text-[var(--color-text)]"
                            >
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2.5"
                            />
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label
                                htmlFor="confirm_password"
                                className="block mb-2 text-sm font-medium text-[var(--color-text)]"
                            >
                                Confirmar nueva contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2.5"
                            />
                        </div>

                        {/* Mensajes */}
                        {error && (
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-600 text-sm font-medium">{success}</p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full text-[var(--color-button_text)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:ring-4 focus:outline-none focus:ring-[var(--color-primary)] font-semibold rounded-3xl text-sm px-5 py-2.5 text-center"
                        >
                            ACTUALIZAR CONTRASEÑA
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

