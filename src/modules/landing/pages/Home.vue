<!-- Public landing page for first-time visitors. -->
<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from '../../../core/i18n';

const router = useRouter();
const { t } = useI18n();

const goToCatalog = () => router.push('/catalog');
const goToHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
</script>

<template>
  <main class="home-page">
    <div class="bg-shape bg-shape--one" aria-hidden="true"></div>
    <div class="bg-shape bg-shape--two" aria-hidden="true"></div>

    <div class="home-container">
      <section class="home-hero">
        <div class="hero-content">
          <h1>{{ t('home.title') }}</h1>
          <p>{{ t('home.subtitle') }}</p>

          <div class="hero-actions">
            <button class="btn btn-primary" type="button" @click="goToCatalog">{{ t('home.start') }}</button>
            <button class="btn btn-secondary" type="button" @click="goToHowItWorks">{{ t('home.howItWorks') }}</button>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="phone-mockup">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <p class="preview-kicker">Wedding Invitation</p>
              <h3>Emma & Liam</h3>
              <p>June 14, 2027</p>
              <p>Rose Garden Hall</p>
              <p class="preview-message">We would love to celebrate with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" class="home-how-it-works">
        <h2>{{ t('home.howItWorks') }}</h2>
        <div class="steps-grid">
          <article class="step-card">
            <h3>1. {{ t('home.steps.customize') }}</h3>
            <p>Fill your invitation details and choose your preferred style.</p>
          </article>
          <article class="step-card">
            <h3>2. {{ t('home.steps.extras') }}</h3>
            <p>Select optional features like gallery, map, or countdown.</p>
          </article>
          <article class="step-card">
            <h3>3. {{ t('home.steps.link') }}</h3>
            <p>Review your invitation and share your public invitation link.</p>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped src="../styles/home.css"></style>
