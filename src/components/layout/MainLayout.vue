<!--
  Main app layout.
  Provides shared navbar (when applicable), page content slot, and global footer.
-->
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useI18n } from '../../core/i18n';
import { useLanguageStore } from '../../store/language.store';
import Footer from './Footer.vue';

const { currentLang, t } = useI18n();
const languageStore = useLanguageStore();
const route = useRoute();

// Home and public invitation pages use dedicated presentation headers.
const showAppNav = computed(() => route.path !== '/' && !route.path.startsWith('/i/'));
const setLang = (lang) => languageStore.setLanguage(lang);
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

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-shell { display: grid; gap: 1rem; min-height: 100vh; }
.app-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}
.lang-switch {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--color-border);
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
.lang-btn--active { background: var(--color-primary); color: #fff; }
</style>
