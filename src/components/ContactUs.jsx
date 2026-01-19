// src/pages/ContactPage.jsx
import { useState } from "react";

export const ContactUS = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);
        // 👉 Aquí puedes agregar tu lógica para enviar el mensaje (por ejemplo, con tu API o email service)
    };

    return (
        <section className="bg-[var(--color-bg)] py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4">
            <div className="mx-auto max-w-screen-md">
                <h2 className="mb-3 sm:mb-4 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-center text-[var(--color-text)]">
                    Contáctanos
                </h2>
                <p className="mb-6 sm:mb-8 md:mb-10 lg:mb-16 font-light text-center text-[var(--color-text)] text-xs sm:text-sm md:text-base lg:text-lg">
                    ¿Tienes dudas sobre nuestros paquetes o necesitas ayuda con tu suscripción?
                    Escríbenos y te responderemos lo antes posible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            Tu correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow-sm bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-xl sm:rounded-2xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="phone"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            Tu número de teléfono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="shadow-sm bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-xl sm:rounded-2xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            placeholder="Tu número de teléfono"
                            required
                        />
                    </div>

                    {/* Asunto */}
                    <div>
                        <label
                            htmlFor="subject"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            Asunto
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="block p-2 sm:p-3 w-full text-xs sm:text-sm text-[var(--color-text-secondary)] bg-[var(--color-header)] rounded-xl sm:rounded-2xl border border-[var(--color-primary)] shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder="Cuéntanos en qué podemos ayudarte"
                            required
                        />
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label
                            htmlFor="message"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            Tu mensaje
                        </label>
                        <textarea
                            id="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            className="block p-2 sm:p-2.5 w-full text-xs sm:text-sm text-[var(--color-text-secondary)] bg-[var(--color-header)] rounded-xl sm:rounded-2xl border border-[var(--color-primary)] shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder="Escribe tu mensaje aquí..."
                            required
                        ></textarea>
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="py-2 sm:py-3 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-center text-[var(--color-text-button)] rounded-2xl sm:rounded-3xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:ring-4 focus:outline-none focus:ring-yellow-300 w-full sm:w-fit"
                    >
                        ENVIAR MENSAJE
                    </button>
                </form>
            </div>
        </section>
    );
};

