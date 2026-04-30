<!-- Landing page with modern SaaS wedding-invitation presentation. -->
<script setup>
import { useRouter } from 'vue-router';

import { useI18n } from '../../../core/i18n';

const router = useRouter();
const { t } = useI18n();
const goToCatalog = () => router.push('/catalog');
const goToEditor = () => router.push('/editor');
const goToHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
</script>

<template>
  <main class="landing-page">
    

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
