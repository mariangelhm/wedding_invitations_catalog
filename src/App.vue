<!--
  Root app shell.
  Provides global navigation and language switch for application pages.
  Public invitation route intentionally hides this chrome to preserve presentation mode.
-->
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useI18n } from './core/i18n';
import { useLanguageStore } from './store/language.store';

const { currentLang, t } = useI18n();
const languageStore = useLanguageStore();
const route = useRoute();

// Public invitation view should render as a clean presentation page without app navbar.
const showAppNav = computed(() => !route.path.startsWith('/i/'));

const setLang = (lang) => {
  languageStore.setLanguage(lang);
};
</script>

<template>
  <div class="app-shell">
    <nav v-if="showAppNav" class="app-nav">
      <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
      <RouterLink to="/catalog">{{ t('nav.catalog') }}</RouterLink>
      <RouterLink to="/editor">{{ t('nav.editor') }}</RouterLink>
      <RouterLink to="/i/demo-invitation">{{ t('nav.publicInvitation') }}</RouterLink>

      <div class="lang-switch" aria-label="Language switch">
        <span>[</span>
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': currentLang === 'es' }" @click="setLang('es')">ES</button>
        <span>|</span>
        <button type="button" class="lang-btn" :class="{ 'lang-btn--active': currentLang === 'en' }" @click="setLang('en')">EN</button>
        <span>]</span>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.app-shell { display: grid; gap: 1rem; }
.app-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.lang-switch {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  background: #fff;
}
.lang-btn {
  border: none;
  background: transparent;
  border-radius: 999px;
  padding: 0.2rem 0.45rem;
  cursor: pointer;
}
.lang-btn--active { background: #8b5a7a; color: #fff; }
</style>
