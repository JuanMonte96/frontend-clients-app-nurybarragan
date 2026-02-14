import { useTranslation } from 'react-i18next';
import ImageCarousel from './ImageCarousel';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative text-white scroll-mt-24 pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Carrusel de imágenes como fondo */}
      <ImageCarousel />
      
      {/* Contenido del Hero encima del fondo - Centrado */}
      <div className="relative z-10 max-w-screen-xl px-3 sm:px-4 mx-auto text-center">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="max-w-2xl mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
            style={{
              textShadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)'
            }}
          >
            {t('hero.title')}
          </h1>
          <p className="max-w-3xl mx-auto font-light text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl lg:mb-8"
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
