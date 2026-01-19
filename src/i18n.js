import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
  fr: { translation: fr }
};

// Detectar idioma del navegador o usar español por defecto
const getDefaultLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  return ['es', 'en', 'fr'].includes(browserLang) ? browserLang : 'es';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || getDefaultLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React protege de XSS de forma nativa
    }
  });

// Guardar idioma en localStorage cuando cambie
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
