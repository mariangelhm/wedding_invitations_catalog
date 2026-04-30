// Global language store for simple app-wide language state.
import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('languageStore', {
  state: () => ({
    // Default language is Spanish.
    currentLang: 'es',
  }),

  actions: {
    // Toggle between Spanish and English.
    toggleLanguage() {
      this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    },
  },
});
