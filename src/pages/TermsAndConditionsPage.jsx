import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LegalSection from '../components/LegalSection';
import logo from '../assets/final-logo-nb.webp';

const LegalDocument = ({ document }) => {
  if (!document || typeof document !== 'object') return null;

  const sections = Object.values(document.sections || document.articles || {});

  return (
    <section className="mt-12 first:mt-0 sm:mt-16">
      <header className="border-b-4 border-[var(--color-primary)] bg-white pb-5">
        <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">{document.title}</h2>
        {document.lastUpdated && <p className="mt-3 text-sm font-semibold text-[var(--color-text)] sm:text-base">{document.lastUpdated}</p>}
      </header>

      <div>
        {sections.map((section, index) => (
          <LegalSection key={`${section?.number || 'section'}-${index}`} section={section} />
        ))}
      </div>
    </section>
  );
};

export default function TermsAndConditionsPage() {
  const { t } = useTranslation();
  const termsAndConditions = t('termsAndConditions', { returnObjects: true });

  if (!termsAndConditions || typeof termsAndConditions !== 'object') return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header logo={logo} minimal />
      <main className="mx-auto w-full max-w-4xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
        <h1 className="border-l-8 border-[var(--color-gradient-button)] pl-4 text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:pl-5 sm:text-4xl">
          {termsAndConditions.title}
        </h1>

        <div className="mt-10 px-5 py-2 sm:mt-12 sm:px-8 bg-white">
          <LegalDocument document={termsAndConditions.legalNotices} />
          <LegalDocument document={termsAndConditions.generalTermsOfSale} />
        </div>
      </main>
    </div>
  );
}