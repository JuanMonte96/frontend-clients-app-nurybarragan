import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import img1 from "../assets/nurybarragan1.jpg";
import img2 from "../assets/nurybarragan2.jpg";
import img3 from "../assets/nurybarragan3.jpg";
import img4 from "../assets/nurybarragan4.jpg";
import img5 from "../assets/nurybarragan5.jpg";
import img6 from "../assets/nurybarragan6.jpg";
import img7 from "../assets/nurybarragan7.jpeg";
import img8 from "../assets/nurybarragan8.jpeg";

const bentoImages = [
  { src: img3, alt: "Nury 3", span: "col-span-1 row-span-1" },
  { src: img4, alt: "Nury 4", span: "col-span-1 row-span-1" },
  { src: img8, alt: "Nury 8", span: "col-span-1 row-span-2" },
  { src: img6, alt: "Nury 6", span: "col-span-2 row-span-1" },
];

export default function TeacherProfile() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        observer.observe(sectionEl);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-bg)] scroll-mt-24 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-24"
        >
            <div className="max-w-7xl mx-auto">
                {/* Título - Part superior centrado */}
                <motion.div
                    className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)]">
                        {t("teachers.title")}
                    </h2>
                </motion.div>

                {/* Flex: Texto e Imágenes */}
                <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                    {/* Texto - Columna izquierda */}
                    <motion.div
                        className="w-full lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    >
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                            NURY BARRAGAN
                        </h3>
                        <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-text)] leading-relaxed">
                            {t("teachers.experience")}
                        </p>
                    </motion.div>

                    {/* Bento Grid - Columna derecha */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[200px]">
                            {bentoImages.map((image, index) => (
                                <motion.div
                                    key={index}
                                    className={`${image.span} rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300`}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                                >
                                    <motion.img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}