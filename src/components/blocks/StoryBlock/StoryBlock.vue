<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './storyBlock.css';

/**
 * Reusable story block props.
 * - title: optional section title
 * - message: story content text
 */
const props = withDefaults(defineProps<{
  title?: string;
  message: string;
}>(), {
  title: 'Nuestra historia',
});

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // IntersectionObserver enables one-time reveal animation for reusable blocks.
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  if (rootEl.value) observer.observe(rootEl.value);
});
</script>

<template>
  <section ref="rootEl" class="story-block" :class="{ 'is-visible': isVisible }">
    <h3 class="story-title">{{ title }}</h3>
    <p class="story-message">{{ message }}</p>
  </section>
</template>
