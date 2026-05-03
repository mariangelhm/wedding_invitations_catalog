<script setup>
import { computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';

const route = useRoute();
const isEditorRoute = computed(() => route.path.startsWith('/editor'));

watch(isEditorRoute, (active) => {
  // Prevent page-level scroll while editor is open; panels handle their own scroll.
  document.body.style.overflow = active ? 'hidden' : '';
}, { immediate: true });

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="app-layout">
    <Header v-if="!isEditorRoute" />
    <main class="app-main" :class="{ 'app-main--editor': isEditorRoute }">
      <router-view />
    </main>
    <Footer v-if="!isEditorRoute" />
  </div>
</template>

<style scoped>
.app-layout { min-height: 100vh; display: grid; grid-template-rows: 1fr; }
.app-main { min-height: 0; }
.app-main--editor { height: 100vh; overflow: hidden; }
</style>
