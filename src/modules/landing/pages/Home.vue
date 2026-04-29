<!--
  Public landing page for first-time visitors.
  Uses a modern SaaS-style hero with clear CTA actions.
-->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCatalog = () => {
  router.push('/catalog');
};

const goToHowItWorks = () => {
  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <main class="home-page">
    <!-- Decorative soft background shapes for a light SaaS visual layer. -->
    <div class="bg-shape bg-shape--one" aria-hidden="true"></div>
    <div class="bg-shape bg-shape--two" aria-hidden="true"></div>

    <div class="home-container">
      <!--
        Hero layout decision:
        Two columns on desktop to balance messaging (left) and visual proof (right).
        Stacks on mobile for readability and progressive scanning.
      -->
      <section class="home-hero">
        <div class="hero-content">
          <h1>Create your wedding invitation in minutes</h1>
          <p>Customize, pay and get your link instantly</p>

          <div class="hero-actions">
            <button class="btn btn-primary" type="button" @click="goToCatalog">Ver catálogo</button>
            <button class="btn btn-secondary" type="button" @click="goToHowItWorks">Cómo funciona</button>
          </div>
        </div>

        <!-- Right visual: phone mockup with invitation preview placeholder. -->
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
        <h2>How it works</h2>
        <div class="steps-grid">
          <article class="step-card">
            <h3>1. Customize</h3>
            <p>Fill your invitation details and choose your preferred style.</p>
          </article>
          <article class="step-card">
            <h3>2. Add extras</h3>
            <p>Select optional features like gallery, map, or countdown.</p>
          </article>
          <article class="step-card">
            <h3>3. Get your link</h3>
            <p>Review your invitation and share your public invitation link.</p>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped src="../styles/home.css"></style>
