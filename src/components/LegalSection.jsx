const isEmailDetail = (key, value) => key.toLowerCase().includes('email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isUrlDetail = (key, value) => key.toLowerCase().includes('website') || /^https?:\/\//i.test(value);

const DetailValue = ({ detailKey, value }) => {
  const textValue = String(value);

  if (isEmailDetail(detailKey, textValue)) {
    return <a className="break-all underline decoration-[var(--color-primary)] underline-offset-4 hover:text-[var(--color-gradient-button)]" href={`mailto:${textValue}`}>{textValue}</a>;
  }

  if (isUrlDetail(detailKey, textValue)) {
    return <a className="break-all underline decoration-[var(--color-primary)] underline-offset-4 hover:text-[var(--color-gradient-button)]" href={textValue} target="_blank" rel="noreferrer">{textValue}</a>;
  }

  return <span className="break-words">{textValue}</span>;
};

export default function LegalSection({ section }) {
  if (!section || typeof section !== 'object') return null;

  const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
  const items = Array.isArray(section.items) ? section.items : [];
  const details = section.details && typeof section.details === 'object'
    ? Object.entries(section.details).filter(([, value]) => value !== null && value !== undefined && value !== '')
    : [];

  return (
    <article className="border-b border-[var(--color-header)]/15 py-7 last:border-b-0 sm:py-8">
      <h3 className="text-xl font-bold leading-tight text-[var(--color-text)] sm:text-2xl">
        {[section.number, section.title].filter(Boolean).join(' — ')}
      </h3>

      <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text)] sm:text-lg sm:leading-8">
        {paragraphs.map((paragraph, index) => (
          <p key={`${section.number || section.title || 'section'}-${index}`}>{paragraph}</p>
        ))}
      </div>

      {items.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-[var(--color-text)] marker:text-[var(--color-gradient-button)] sm:text-lg sm:leading-8">
          {items.map((item, index) => (
            <li key={`${section.number || section.title || 'section'}-item-${index}`}>{item}</li>
          ))}
        </ul>
      )}

      {details.length > 0 && (
        <dl className="mt-5 grid gap-2 border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-3 text-sm leading-6 text-[var(--color-text)] sm:text-base">
          {details.map(([key, value]) => (
            <div key={key} className="min-w-0">
              <dd><DetailValue detailKey={key} value={value} /></dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}