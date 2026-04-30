<!--
  Reusable global header.
  Uses i18n keys so labels are translated from the shared dictionary.
-->
<script setup>
import { useRoute } from 'vue-router';

import { useI18n } from '../../core/i18n';
import { useLanguageStore } from '../../store/language.store';

const route = useRoute();
const { currentLang, t } = useI18n();
const languageStore = useLanguageStore();

// Language switch delegates to centralized Pinia store persistence logic.
const setLang = (lang) => languageStore.setLanguage(lang);
</script>

<template>
  <header class="global-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="InvitaLove home">InvitaLove</RouterLink>

      <nav class="center-nav" aria-label="Main navigation">
        <RouterLink to="/" class="nav-link" :class="{ 'is-active': route.path === '/' }">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/catalog" class="nav-link" :class="{ 'is-active': route.path.startsWith('/catalog') }">{{ t('nav.catalog') }}</RouterLink>
        <RouterLink to="/editor" class="nav-link" :class="{ 'is-active': route.path.startsWith('/editor') }">{{ t('nav.editor') }}</RouterLink>
        <RouterLink to="/i/demo-invitation" class="nav-link" :class="{ 'is-active': route.path.startsWith('/i/') }">{{ t('nav.publicInvitation') }}</RouterLink>
      </nav>

      <div class="right-actions">
        <RouterLink to="/editor" class="start-btn">{{ t('nav.start') }}</RouterLink>

        <div class="lang-switch" aria-label="Language switch">
          <button type="button" :class="{ active: currentLang === 'es' }" @click="setLang('es')">ES</button>
          <span>|</span>
          <button type="button" :class="{ active: currentLang === 'en' }" @click="setLang('en')">EN</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.global-header {
  background: #fff;
  border-bottom: 1px solid var(--color-border-soft);
  position: sticky;
  top: 0;
  z-index: 30;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.brand {
  text-decoration: none;
  color: var(--color-primary);
  font-size: 1.45rem;
  font-weight: 700;
}
.center-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-link {
  text-decoration: none;
  color: var(--color-text-main);
  font-weight: 500;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color .2s ease, border-color .2s ease;
}
.nav-link:hover,
.nav-link.is-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
.right-actions { display: flex; align-items: center; gap: 10px; }
.start-btn {
  text-decoration: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  padding: 9px 14px;
  font-weight: 600;
}
.start-btn:hover { background: var(--color-primary-dark); }
.lang-switch {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #fff;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.lang-switch button {
  border: none;
  background: transparent;
  padding: 2px 6px;
  border-radius: 999px;
  cursor: pointer;
}
.lang-switch button.active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 700;
}

/* Mobile rule: keep logo/start/language visible, hide center links for now. */
@media (max-width: 768px) {
  .center-nav { display: none; }
  .header-inner { padding: 10px 12px; }
  .brand { font-size: 1.2rem; }
  .start-btn { padding: 8px 11px; font-size: 0.9rem; }
}
</style>
