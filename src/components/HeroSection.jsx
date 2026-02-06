import classImg from '../assets/classes2.jpg';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="bg-[var(--color-bg)] scroll-mt-24 pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-12">
      <div className="grid max-w-screen-xl px-3 sm:px-4 py-6 sm:py-8 md:py-16 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7 mb-8 lg:mb-0">
          <h1 className="max-w-2xl mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-none text-[var(--color-text)]">
            {t('hero.title')}
          </h1>
          <p className="max-w-2xl mb-4 sm:mb-6 font-light text-xs sm:text-sm md:text-base lg:text-lg text-[var(--color-text)] lg:mb-8">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="flex justify-center mt-6 sm:mt-0 lg:col-span-5">
          <img
            src={classImg}
            alt="hero image"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none h-auto rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
