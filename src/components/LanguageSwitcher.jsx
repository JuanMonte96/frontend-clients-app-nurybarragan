import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es', label: t('common.spanish'), flag: '🇪🇸' },
    { code: 'en', label: t('common.english'), flag: '🇬🇧' },
    { code: 'fr', label: t('common.french'), flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botón de idioma */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] text-[var(--color-text)] transition-all duration-300 hover:scale-105 active:scale-95 border border-[var(--color-primary)] text-xs sm:text-sm font-semibold"
        title={t('common.language')}
      >
        <Globe size={20} />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute left-0 md:right-0 mt-2 w-44 bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg shadow-lg p-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-300 flex items-center gap-2 ${
                i18n.language === lang.code
                  ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] text-[var(--color-text)] font-semibold'
                  : 'text-[var(--color-text)] hover:bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-gradient-button)] hover:scale-105 active:scale-95'
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
