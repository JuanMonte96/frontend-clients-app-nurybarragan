// src/pages/AboutUs.jsx
import danceImg from "../assets/nurybarragan49.jpg";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[var(--color-bg-secondary)] py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        
        {/* Imagen */}
        <div className="w-full lg:w-1/2">
          <img
            src={danceImg}
            alt="Baile y movimiento"
            className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg object-cover w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
          />
        </div>

        {/* Texto */}
        <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-text)]">
            {t('aboutUs.title')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[var(--color-text)] leading-relaxed">
            {t('aboutUs.description')}
          </p>

          <p className="text-xs sm:text-sm md:text-base text-[var(--color-text)] leading-relaxed">
            {t('aboutUs.description2')}
          </p>

          <div className="pt-2 sm:pt-3 md:pt-4">
            <a
              href="/packages"
              className="inline-block bg-[var(--color-table-header)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-button)] font-bold rounded-3xl px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition"
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