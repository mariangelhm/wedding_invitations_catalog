// Global language store for app-wide language state.
import { defineStore } from 'pinia';

const STORAGE_KEY = 'wedding_builder_lang';

const resolveInitialLang = () => {
  // Keep browser-safe access to localStorage for initial language restore.
  if (typeof window === 'undefined') return 'es';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'en' ? 'en' : 'es';
};

export const useLanguageStore = defineStore('languageStore', {
  state: () => ({
    // Default language is Spanish unless a valid saved value exists.
    currentLang: resolveInitialLang(),
  }),

  actions: {
    // Explicit setter used by language switch controls.
    setLanguage(lang) {
      this.currentLang = lang === 'en' ? 'en' : 'es';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, this.currentLang);
      }
    },

    // Toggle helper kept for convenience in simple UIs.
    toggleLanguage() {
      this.setLanguage(this.currentLang === 'es' ? 'en' : 'es');
    },
  },
});
