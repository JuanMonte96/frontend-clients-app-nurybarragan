import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Information() {
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
      id="information"
      ref={sectionRef}
      className="bg-[var(--color-text)] scroll-mt-24 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <motion.div
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-primary)] text-center">
              {t("information.title")}
            </h2>
            <p className="text-md sm:text-base md:text-lg text-[var(--color-primary)] text-center leading-relaxed">
              {t("information.intro")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-header)] p-4 sm:p-5 md:p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] text-center mb-3">
                {t("information.scheduleTitle")}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-[var(--color-primary)]">
                    {t("information.monday")}
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm sm:text-base text-[var(--color-primary)]">
                    <li>{t("information.mondayClass1")}</li>
                    <li>{t("information.mondayClass2")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-[var(--color-primary)]">
                    {t("information.saturday")}
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm sm:text-base text-[var(--color-primary)]">
                    <li>{t("information.saturdayClass1")}</li>
                    <li>{t("information.saturdayClass2")}</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-header)] p-4 sm:p-5 md:p-6 space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] text-center mb-2">
                  {t("information.startTitle")}
                </h3>
                <p className="text-sm sm:text-base text-[var(--color-primary)] text-center">
                  {t("information.startDate")}
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] text-center mb-2">
                  {t("information.locationTitle")}
                </h3>
                <p className="text-sm sm:text-base text-[var(--color-primary)] font-semibold text-center">
                  {t("information.locationName")}
                </p>
                <p className="text-sm sm:text-base text-[var(--color-primary)] text-center">
                  {t("information.locationAddress")}
                </p>
                <p className="text-sm sm:text-base text-[var(--color-primary)] text-center">
                  {t("information.locationMetro")}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="space-y-2 text-sm sm:text-base md:text-lg text-[var(--color-primary)]"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            <p className="text-center">{t("information.note")}</p>
            <p className="text-center">{t("information.contact")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
