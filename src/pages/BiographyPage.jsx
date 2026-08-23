import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/final-logo-nb.webp';
import heroImage from '../assets/bio/bio12.webp';
import studioImage from '../assets/bio/bio6.webp';
import stageImage from '../assets/bio/bio20.webp';
import parisImage from '../assets/bio/bio24.webp';
import communityImage from '../assets/bio/bio1.webp';
import galleryImageOne from '../assets/bio/bio15.webp';
import galleryImageTwo from '../assets/bio/bio17.webp';
import galleryImageThree from '../assets/bio/bio23.webp';

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: 'easeOut' },
};

const renderExperienceHighlight = (text) => {
  const experiencePattern = /(35\s+(?:años\s+de\s+experiencia|years\s+of\s+experience|ans\s+d[’']expérience))/iu;
  const parts = String(text || '').split(experiencePattern);

  return parts.map((part, index) => experiencePattern.test(part) ? (
    <strong key={`${part}-${index}`} className="font-extrabold text-[var(--color-gradient-button)]">
      {part}
    </strong>
  ) : part);
};

const BiographyParagraphs = ({ paragraphs, className = '' }) => (
  <div className={`space-y-5 text-base leading-8 text-[var(--color-text)] sm:text-lg sm:leading-9 ${className}`}>
    {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{renderExperienceHighlight(paragraph)}</p>)}
  </div>
);

const NarrativeSection = ({ paragraphs, image, imageFirst = false, imageClassName, name }) => (
  <motion.section {...reveal} className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-12 md:py-20 lg:px-8">
    <div className={imageFirst ? 'md:order-2' : ''}>
      <BiographyParagraphs paragraphs={paragraphs} />
    </div>
    <div className={imageFirst ? 'md:order-1' : ''}>
      <img src={image} alt={name} loading="lazy" className={`h-full w-full rounded-lg object-cover shadow-xl ${imageClassName}`} />
    </div>
  </motion.section>
);

export default function BiographyPage() {
  const { t } = useTranslation();
  const biography = t('biography', { returnObjects: true });
  const paragraphs = Array.isArray(biography?.paragraphs) ? biography.paragraphs : [];
  const links = [
    { label: t('header.home'), to: '#hero' },
    { label: t('header.packages'), to: '#packages' },
    { label: t('header.about'), to: '/about' },
    { label: t('header.contact'), to: '#contact' },
  ];

  if (!biography || typeof biography !== 'object') return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-bg)]">
      <Header logo={logo} links={links} />

      <main>
        <section className="bg-[var(--color-header)] px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(300px,0.78fr)] md:gap-14">
            <motion.div {...reveal} className="order-2 md:order-1">
              <p className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">{biography.name}</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight text-[var(--color-text-secondary)] sm:text-5xl lg:text-6xl">{biography.title}</h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--color-text-secondary)] sm:text-xl">
                {renderExperienceHighlight(biography.experience)}
              </p>
              <BiographyParagraphs paragraphs={paragraphs.slice(0, 2)} className="mt-8 text-[var(--color-text-secondary)]" />
            </motion.div>

            <motion.figure {...reveal} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }} className="order-1 mx-auto w-full max-w-[430px] md:order-2 md:max-w-none">
              <img src={heroImage} alt={biography.name} fetchPriority="high" className="aspect-[2/3] w-full rounded-lg object-cover object-center shadow-2xl" />
            </motion.figure>
          </div>
        </section>

        <NarrativeSection paragraphs={paragraphs.slice(2, 5)} image={studioImage} imageClassName="aspect-[3/2]" name={biography.name} />

        <section className="bg-[var(--color-primary)]/25 py-12 sm:py-16">
          <motion.div {...reveal} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <img src={stageImage} alt={biography.name} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover object-center shadow-xl" />
          </motion.div>
          <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8">
            <BiographyParagraphs paragraphs={paragraphs.slice(5, 9)} />
          </div>
        </section>

        <NarrativeSection paragraphs={paragraphs.slice(9, 14)} image={parisImage} imageFirst imageClassName="aspect-[3/2] object-[center_45%]" name={biography.name} />

        <section className="bg-[var(--color-header)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] sm:gap-6">
              {[galleryImageOne, galleryImageTwo, galleryImageThree].map((image, index) => (
                <motion.figure key={image} {...reveal} transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }} className="w-[72vw] max-w-[310px] flex-none snap-center sm:w-[30%] sm:min-w-[240px]">
                  <img src={image} alt={biography.name} loading="lazy" className="aspect-[2/3] w-full rounded-lg object-cover shadow-xl" />
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <NarrativeSection paragraphs={paragraphs.slice(14)} image={communityImage} imageClassName="aspect-[4/3]" name={biography.name} />
      </main>

      <Footer />
    </div>
  );
}