import { useTranslation } from "react-i18next";

const TestimonialCard = ({ item, duplicate = false }) => (
  <article
    className="testimonials-card flex w-[min(82vw,360px)] shrink-0 flex-col rounded-2xl border p-5 shadow-xl sm:w-[min(56vw,380px)] sm:p-6 lg:w-[min(30vw,390px)]"
    aria-hidden={duplicate}
  >
    <div className="mb-5 flex items-center gap-3">
      <span className="testimonials-mark" aria-hidden="true">“</span>
      <h3 className="text-base font-bold text-[var(--color-primary)] sm:text-lg">{item.name}</h3>
    </div>
    <div className="flex-1 space-y-4 text-sm leading-7 text-white/90 sm:text-base">
      {String(item.text || "").split(/\n\s*\n/).map((paragraph, index) => (
        <p key={`${item.name}-${index}`}>{paragraph}</p>
      ))}
    </div>
  </article>
);

export default function Testimonials() {
  const { t } = useTranslation();
  const translatedItems = t("testimonials.items", { returnObjects: true });
  const items = Array.isArray(translatedItems) ? translatedItems : [];

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="testimonials-section overflow-hidden bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] px-3 py-10 scroll-mt-24 sm:px-4 sm:py-14 md:px-6 md:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--color-text)] sm:mb-10 sm:text-3xl md:text-4xl lg:text-5xl">
          {t("testimonials.title")}
        </h2>

        <div className="testimonials-viewport" aria-label={t("testimonials.title")}>
          <div className="testimonials-track">
            <div className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6" role="list">
              {items.map((item, index) => (
                <TestimonialCard key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
            <div className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6" aria-hidden="true">
              {items.map((item, index) => (
                <TestimonialCard key={`duplicate-${item.name}-${index}`} item={item} duplicate />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
