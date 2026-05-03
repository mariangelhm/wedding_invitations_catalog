<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="app-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-layout { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; }
</style>
