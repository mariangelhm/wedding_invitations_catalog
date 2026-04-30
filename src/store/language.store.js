// Global language store for simple app-wide language state.
import { defineStore } from 'pinia';

const STORAGE_KEY = 'wedding_builder_lang';

export const useLanguageStore = defineStore('languageStore', {
  state: () => ({
    // Initialize from localStorage if available, fallback to Spanish.
    currentLang: localStorage.getItem(STORAGE_KEY) || 'es',
  }),

  actions: {
    // Explicit setter used by UI toggle buttons.
    setLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    },

    // Backward-compatible toggle between Spanish and English.
    toggleLanguage() {
      this.setLanguage(this.currentLang === 'es' ? 'en' : 'es');
    },
  },
});
