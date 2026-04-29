<!--
  Landing module root view.
  Displays a placeholder message for the initial app screen.
-->
<script setup>
// Imports a non-visual component that performs a one-time console test of builder store behavior.
import BuilderStoreConsoleTest from '../builder/BuilderStoreConsoleTest.vue';
</script>

<template>
  <section class="landing-view">
    <h1>Wedding Invitation Builder App</h1>
    <BuilderStoreConsoleTest />
  </section>
</template>

<style scoped>
/* Minimal section layout for the landing view content. */
.landing-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
</style>
