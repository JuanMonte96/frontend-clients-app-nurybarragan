// src/pages/ContactPage.jsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { sendContactMessage } from "../services/contacService.js";

export const ContactUS = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name_client: "",
        email_client: "",
        telephone_client: "",
        subject: "",
        description: ""
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);
        try {
            const response = await sendContactMessage(formData);
            alert(t('contact.successMessage'));
            setFormData({
                name_client: "",
                email_client: "",
                telephone_client: "",
                subject: "",
                description: "",
            });
            console.log("Respuesta del servidor:", response);
        } catch (error) {
            console.error("Error al enviar el mensaje de contacto:", error);
            alert(t('contact.errorMessage'));
        }   
    };

    return (
        <section ref={sectionRef} id="contact" className="bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] scroll-mt-24 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4">
            <div className="mx-auto max-w-screen-md">
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="mb-3 sm:mb-4 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-center text-[var(--color-text)]">
                    {t('contact.title')}
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-6 sm:mb-8 md:mb-10 lg:mb-16 font-light text-center text-[var(--color-text)] text-xs sm:text-sm md:text-base lg:text-lg">
                    {t('contact.description')}
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.15 }}>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            {t('contact.name')}
                        </label>
                        <input
                            type="text"
                            id="name_client"
                            value={formData.name_client}
                            onChange={handleChange}
                            className="shadow-sm bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-xl sm:rounded-2xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            placeholder={t('contact.name')}
                            required
                        />
                    </motion.div>
                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            {t('contact.email')}
                        </label>
                        <input
                            type="email"
                            id="email_client"
                            value={formData.email_client}
                            onChange={handleChange}
                            className="shadow-sm bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-xl sm:rounded-2xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            placeholder="example@example.com"
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.25 }}>
                        <label
                            htmlFor="phone"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                            >
                            {t('contact.phone')}
                        </label>
                        <input
                            type="tel"
                            id="telephone_client"
                            value={formData.telephone_client}
                            onChange={handleChange}
                            className="shadow-sm bg-[var(--color-header)] border border-[var(--color-primary)] text-[var(--color-text-secondary)] text-xs sm:text-sm rounded-xl sm:rounded-2xl focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block w-full p-2 sm:p-2.5"
                            placeholder={t('contact.phone')}
                            required
                        />
                    </motion.div>

                    {/* Asunto */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}>
                        <label
                            htmlFor="subject"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            {t('contact.subject')}
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="block p-2 sm:p-3 w-full text-xs sm:text-sm text-[var(--color-text-secondary)] bg-[var(--color-header)] rounded-xl sm:rounded-2xl border border-[var(--color-primary)] shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder={t('contact.subjectPlaceholder')}
                            required
                        />
                    </motion.div>

                    {/* Mensaje */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.35 }}>
                        <label
                            htmlFor="message"
                            className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--color-text)]"
                        >
                            {t('contact.message')}
                        </label>
                        <textarea
                            id="description"
                            rows="6"
                            value={formData.description}
                            onChange={handleChange}
                            className="block p-2 sm:p-2.5 w-full text-xs sm:text-sm text-[var(--color-text-secondary)] bg-[var(--color-header)] rounded-xl sm:rounded-2xl border border-[var(--color-primary)] shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder={t('contact.message')}
                            required
                        ></textarea>
                    </motion.div>

                    {/* Botón */}
                    <motion.button
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        type="submit"
                        className="py-2 sm:py-3 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-center text-[var(--color-text-button)] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] focus:ring-4 focus:outline-none focus:ring-yellow-300 w-full sm:w-fit transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {t('contact.send')}
                    </motion.button>
                </form>
            </div>
        </section>
    );
};

