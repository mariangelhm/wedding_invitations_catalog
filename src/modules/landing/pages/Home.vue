<!--
  Landing page with modern SaaS wedding-invitation presentation.
  Includes its own top navigation and hero-focused marketing layout.
-->
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
          <li><a href="#">Inicio</a></li>
          <li><a href="/catalog">Catálogo</a></li>
          <li><button type="button" @click="goToHowItWorks">Cómo funciona</button></li>
          <li><a href="#">Precios</a></li>
          <li><a href="#">Tutoriales</a></li>
        </ul>

        <div class="nav-actions">
          <button class="btn btn-primary" type="button" @click="goToEditor">Comenzar</button>
          <div class="lang-switch">
            <button type="button" :class="{ active: currentLang === 'es' }" @click="setLang('es')">ES</button>
            <span>|</span>
            <button type="button" :class="{ active: currentLang === 'en' }" @click="setLang('en')">EN</button>
          </div>
        </div>
      </nav>
    </header>

    <!--
      Hero uses a two-column desktop layout.
      Left explains value proposition, right shows a modern phone invitation preview.
    -->
    <section class="hero">
      <div class="hero-left">
        <p class="hero-badge">❤ Invitaciones digitales únicas e inolvidables</p>
        <h1>
          Crea tu invitación de boda en
          <span>minutos</span>
        </h1>
        <p class="hero-subtitle">
          Personaliza cada detalle, agrega extras increíbles y comparte tu link con tus invitados.
        </p>

        <div class="hero-ctas">
          <button class="btn btn-primary" type="button" @click="goToEditor">Crear mi invitación</button>
          <button class="btn btn-secondary" type="button" @click="goToCatalog">Ver ejemplos</button>
        </div>

        <div class="hero-benefits">
          <span>⚡ Fácil y rápido</span>
          <span>🛡️ 100% Personalizable</span>
          <span>🔒 Seguro y privado</span>
        </div>
      </div>

      <div class="hero-right">
        <div class="phone-wrapper">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <p class="mini-kicker">NUESTRA BODA</p>
            <h3>María & Carlos</h3>
            <p>14 de Junio, 2027</p>
            <p>Rose Garden Hall</p>
            <p class="mini-message">Nos encantaría que seas parte de este día tan especial.</p>
            <button class="phone-btn">Confirmar asistencia</button>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how-it-works">
      <h2>¿Cómo funciona?</h2>
      <div class="steps-grid">
        <article class="step-card">
          <div class="icon-circle">✎</div>
          <h3>1. Personaliza</h3>
          <p>Completa la información de tu evento y elige tu estilo favorito.</p>
        </article>
        <article class="step-card">
          <div class="icon-circle">🧩</div>
          <h3>2. Agrega extras</h3>
          <p>Añade funcionalidades como galería, mapa, cuenta regresiva y más.</p>
        </article>
        <article class="step-card">
          <div class="icon-circle">➤</div>
          <h3>3. Obtén tu link</h3>
          <p>Revisa tu invitación y compártela con tus invitados.</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped src="../styles/home.css"></style>
