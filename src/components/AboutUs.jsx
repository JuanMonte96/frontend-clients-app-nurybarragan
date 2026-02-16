// src/pages/AboutUs.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import classes3Img from "../assets/classes3.jpg";
import classes5Img from "../assets/classes5.jpg";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
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
      { threshold: 0.25 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">

        {/* Imagenes con overlapping */}
        <div className="w-full lg:w-1/2">
          <motion.div
            className="relative w-full h-[420px] sm:h-[470px] md:h-[500px] lg:h-[560px]"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.img
              src={classes5Img}
              alt="Clase 2"
              className="absolute right-0 top-0 w-[62%] h-[72%] object-cover rounded-xl shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            />
            <motion.img
              src={classes3Img}
              alt="Clase 1"
              className="absolute left-0 top-14 w-[66%] h-[76%] object-cover rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            />
          </motion.div>
        </div>

        {/* Texto */}
        <div
          className={`w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-5 transition-all duration-700 ease-out delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)]">
            {t('aboutUs.title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-text)] font-semibold leading-relaxed">
            {t('aboutUs.description')}
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-text)] font-semibold leading-relaxed">
            {t('aboutUs.description2')}
          </p>

          <div className="pt-2 sm:pt-3 md:pt-4">
            <a
              href="#packages"
              className="inline-block bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] hover:scale-105 active:scale-95 font-bold rounded-3xl px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-all duration-300"
            >
              {t('aboutUs.explorePackages')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;