// Lightweight i18n helper utilities (no external library).
import { computed } from 'vue';

import { useLanguageStore } from '../../store/language.store';
import { translations } from './translations';

// Helper function that resolves translation keys like "home.title".
const resolvePath = (obj, path) => path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);

export const useI18n = () => {
  const languageStore = useLanguageStore();

  // t(key): returns translated text for current language, with safe key fallback.
  const t = (key) => {
    const langTable = translations[languageStore.currentLang] || translations.es;
    return resolvePath(langTable, key) ?? key;
  };

  const currentLang = computed(() => languageStore.currentLang);

  return {
    currentLang,
    t,
    toggleLanguage: languageStore.toggleLanguage,
  };
};
