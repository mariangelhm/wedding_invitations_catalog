<!--
  Public landing page for first-time visitors.
  Explains value proposition and guides users to the editor flow.
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
    <!-- Hero section: communicates primary product promise and conversion action. -->
    <section class="home-hero">
      <h1>Create your wedding invitation in minutes</h1>
      <p>Customize, pay and get your link instantly</p>
      <button type="button" @click="goToEditor">Start now</button>
    </section>

    <!-- How it works section: simple 3-step overview of user journey. -->
    <section class="home-how-it-works">
      <h2>How it works</h2>
      <ol>
        <li>Customize</li>
        <li>Add extras</li>
        <li>Get your link</li>
      </ol>
    </section>
  </main>
</template>

<style scoped src="../styles/home.css"></style>
