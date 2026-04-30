<!--
  Root app shell.
  Provides simple global navigation links and language switching.
-->
<script setup>
import { useI18n } from './core/i18n';

const { currentLang, toggleLanguage } = useI18n();
</script>

<template>
  <div class="app-shell">
    <nav class="app-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalog">Catalog</RouterLink>
      <RouterLink to="/editor">Editor</RouterLink>
      <RouterLink to="/i/demo-invitation">Public Invitation</RouterLink>

      <!--
        Simple language switch control.
        It toggles global language store between ES and EN.
      -->
      <button class="lang-toggle" type="button" @click="toggleLanguage">[ {{ currentLang.toUpperCase() }} ] ES | EN</button>
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
.lang-toggle {
  margin-left: auto;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  background: #fff;
  cursor: pointer;
}
</style>
