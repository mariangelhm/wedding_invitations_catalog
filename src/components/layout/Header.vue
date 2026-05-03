<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from '../../core/i18n';
import { useLanguageStore } from '../../store/language.store';

const route = useRoute();
const { currentLang, t } = useI18n();
const languageStore = useLanguageStore();
const setLang = (lang) => languageStore.setLanguage(lang);

const safeT = (key, fallback) => {
  const v = t(key);
  return v === key ? fallback : v;
};
</script>

<template>
  <header class="global-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">InvitaLove</RouterLink>
      <nav class="center-nav">
        <RouterLink to="/" class="nav-link" :class="{ 'is-active': route.path === '/' }">{{ safeT('nav.home', 'Inicio') }}</RouterLink>
        <RouterLink to="/catalog" class="nav-link" :class="{ 'is-active': route.path.startsWith('/catalog') }">{{ safeT('nav.catalog', 'Catálogo') }}</RouterLink>
        <a href="/#how-it-works" class="nav-link">{{ safeT('nav.howItWorks', 'Cómo funciona') }}</a>
        <a href="/#pricing" class="nav-link">{{ safeT('nav.pricing', 'Precios') }}</a>
        <a href="/#tutorials" class="nav-link">{{ safeT('nav.tutorials', 'Tutoriales') }}</a>
      </nav>
      <div class="right-actions">
        <RouterLink to="/catalog" class="start-btn">{{ safeT('nav.start', 'Comenzar') }}</RouterLink>
        <div class="lang-switch"><button :class="{ active: currentLang === 'es' }" @click="setLang('es')">ES</button><span>|</span><button :class="{ active: currentLang === 'en' }" @click="setLang('en')">EN</button></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.global-header { background:#fff; border-bottom:1px solid var(--color-border-soft); position:sticky; top:0; z-index:30; }
.header-inner { max-width:1200px; margin:0 auto; padding:12px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.brand { text-decoration:none; color:var(--color-primary); font-size:1.45rem; font-weight:700; }
.center-nav { display:flex; gap:20px; }
.nav-link { text-decoration:none; color:var(--color-text-main); padding-bottom:4px; border-bottom:2px solid transparent; }
.nav-link:hover,.nav-link.is-active { color:var(--color-primary); border-bottom-color:var(--color-primary); }
.right-actions { display:flex; gap:10px; align-items:center; }
.start-btn { text-decoration:none; border-radius:999px; background:var(--color-primary); color:#fff; padding:9px 14px; font-weight:600; }
.lang-switch { border:1px solid var(--color-border); border-radius:999px; padding:3px 8px; display:flex; gap:4px; }
.lang-switch button { border:none; background:transparent; border-radius:999px; padding:2px 6px; }
.lang-switch button.active { background:var(--color-primary-light); color:var(--color-primary-dark); font-weight:700; }
@media (max-width:768px){ .center-nav{display:none;} .header-inner{padding:10px 12px;} }
</style>
