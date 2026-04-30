<!-- Landing page with modern SaaS wedding-invitation presentation. -->
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useI18n } from '../../../core/i18n';
import { useLanguageStore } from '../../../store/language.store';

const router = useRouter();
const { t } = useI18n();
const languageStore = useLanguageStore();

const currentLang = computed(() => languageStore.currentLang);

const goToCatalog = () => router.push('/catalog');
const goToEditor = () => router.push('/editor');
const goToHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
const setLang = (lang) => languageStore.setLanguage(lang);
</script>

<template>
  <main class="landing-page">
    <header class="landing-nav-wrap">
      <nav class="landing-nav">
        <div class="brand">♡ <span>Invita</span>Love</div>

        <ul class="nav-links">
          <li><a href="#" class="active-link">{{ t('navbar.inicio') }}</a></li>
          <li><a href="/catalog">{{ t('navbar.catalogo') }}</a></li>
          <li><button type="button" @click="goToHowItWorks">{{ t('navbar.comoFunciona') }}</button></li>
          <li><a href="#">{{ t('navbar.precios') }}</a></li>
          <li><a href="#">{{ t('navbar.tutoriales') }}</a></li>
        </ul>

        <div class="nav-actions">
          <button class="btn btn-primary" type="button" @click="goToEditor">{{ t('navbar.comenzar') }}</button>
          <div class="lang-switch">
            <button type="button" :class="{ active: currentLang === 'es' }" @click="setLang('es')">ES</button>
            <span>|</span>
            <button type="button" :class="{ active: currentLang === 'en' }" @click="setLang('en')">EN</button>
          </div>
        </div>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-left">
        <p class="hero-badge">❤ {{ t('home.badge') }}</p>
        <h1>
          {{ t('home.titleStart') }}
          <span>{{ t('home.titleHighlight') }}</span>
        </h1>
        <p class="hero-subtitle">{{ t('home.subtitle') }}</p>

        <div class="hero-ctas">
          <button class="btn btn-primary" type="button" @click="goToEditor">{{ t('home.primaryButton') }}</button>
          <button class="btn btn-secondary" type="button" @click="goToCatalog">{{ t('home.secondaryButton') }}</button>
        </div>

        <div class="hero-benefits">
          <span>⚡ {{ t('home.benefits.fast') }}</span>
          <span>🛡️ {{ t('home.benefits.customizable') }}</span>
          <span>🔒 {{ t('home.benefits.secure') }}</span>
        </div>
      </div>

      <div class="hero-right">
        <div class="phone-wrapper">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <p class="mini-kicker">{{ t('phone.label') }}</p>
            <h3>{{ t('phone.names') }}</h3>
            <p>{{ t('phone.date') }}</p>
            <p>{{ t('phone.location') }}</p>
            <p class="mini-message">{{ t('phone.message') }}</p>
            <button class="phone-btn">{{ t('phone.button') }}</button>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how-it-works">
      <h2>{{ t('home.howTitle') }}</h2>
      <div class="steps-grid">
        <article class="step-card">
          <div class="icon-circle">✎</div>
          <h3>1. {{ t('home.steps.personaliza.title') }}</h3>
          <p>{{ t('home.steps.personaliza.description') }}</p>
        </article>
        <article class="step-card">
          <div class="icon-circle">🧩</div>
          <h3>2. {{ t('home.steps.extras.title') }}</h3>
          <p>{{ t('home.steps.extras.description') }}</p>
        </article>
        <article class="step-card">
          <div class="icon-circle">➤</div>
          <h3>3. {{ t('home.steps.link.title') }}</h3>
          <p>{{ t('home.steps.link.description') }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped src="../styles/home.css"></style>
