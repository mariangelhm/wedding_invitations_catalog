<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';

const route = useRoute();
const isEditorRoute = computed(() => route.path.startsWith('/editor'));
</script>

<template>
  <div class="app-layout">
    <Header v-if="!isEditorRoute" />
    <main class="app-main">
      <router-view />
    </main>
    <Footer v-if="!isEditorRoute" />
  </div>
</template>

<style scoped>
.app-layout { min-height: 100vh; display: grid; grid-template-rows: 1fr; }
</style>
