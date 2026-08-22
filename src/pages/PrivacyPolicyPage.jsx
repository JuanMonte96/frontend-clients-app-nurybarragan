import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import LegalSection from '../components/LegalSection';
import logo from '../assets/final-logo-nb.webp';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const privacyPolicy = t('privacyPolicy', { returnObjects: true });

  if (!privacyPolicy || typeof privacyPolicy !== 'object') return null;

  const sections = Object.values(privacyPolicy.sections || {})
    .sort((first, second) => Number(first?.number) - Number(second?.number));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header logo={logo} minimal />
      <main className="mx-auto w-full max-w-4xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
        <h1 className="border-l-8 border-[var(--color-gradient-button)] pl-4 text-3xl font-extrabold leading-tight text-[var(--color-text)] sm:pl-5 sm:text-4xl">
          {privacyPolicy.title}
        </h1>

        <section className="mt-10 bg-white px-5 py-2 sm:mt-12 sm:px-8">
          {privacyPolicy.lastUpdated && (
            <p className="border-b-4 border-[var(--color-primary)] pb-5 text-sm font-semibold text-[var(--color-text)] sm:text-base">
              {privacyPolicy.lastUpdated}
            </p>
          )}

          <div>
            {sections.map((section, index) => (
              <LegalSection key={`${section?.number || 'section'}-${index}`} section={section} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}