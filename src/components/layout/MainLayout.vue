<!--
  Main app layout.
  Centralizes shared Header + routed page content + global Footer.
-->
<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="app-shell">
    <Header />

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
