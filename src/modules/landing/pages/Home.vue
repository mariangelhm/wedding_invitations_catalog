<!--
  Public landing page for first-time visitors.
  Uses a centered hero and clear step cards to guide users into the editor flow.
-->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// CTA action: send users to the invitation editor page.
const goToEditor = () => {
  router.push('/editor');
};
</script>

<template>
  <main class="home-page">
    <div class="home-container">
      <!--
        Hero section layout decision:
        Keep content centered with strong hierarchy (title -> subtitle -> CTA)
        to make the primary action obvious.
      -->
      <section class="home-hero">
        <h1>Create your wedding invitation in minutes</h1>
        <p>Customize, pay and get your link instantly</p>
        <button type="button" @click="goToEditor">Start now</button>
      </section>

      <!--
        How-it-works section layout decision:
        Present each step as a card so scanning is easier on desktop and mobile.
      -->
      <section class="home-how-it-works">
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
