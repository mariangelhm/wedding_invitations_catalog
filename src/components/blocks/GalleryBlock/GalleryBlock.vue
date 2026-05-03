<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './galleryBlock.css';

/**
 * Reusable gallery block props.
 * - title: optional heading
 * - images: optional photo collection
 */
const props = withDefaults(defineProps<{
  title?: string;
  images?: Array<{ src: string; alt?: string }>;
}>(), {
  title: 'Nuestros momentos',
  images: () => [],
});

// Fallback: render elegant placeholders when no image data exists.
const hasImages = computed(() => props.images.length > 0);
const displayItems = computed(() => (hasImages.value ? props.images : [
  { src: '', alt: 'Placeholder 1' },
  { src: '', alt: 'Placeholder 2' },
  { src: '', alt: 'Placeholder 3' },
]));

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // One-time reveal animation for reusable drag/drop-rendered blocks.
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  if (rootEl.value) observer.observe(rootEl.value);
});
</script>

<template>
  <section ref="rootEl" class="gallery-block" :class="{ 'is-visible': isVisible }">
    <h3 class="gallery-title">{{ title }}</h3>

    <div class="gallery-grid" :class="{ 'is-placeholder': !hasImages }">
      <article
        v-for="(image, index) in displayItems"
        :key="`${image.alt}-${index}`"
        class="gallery-item"
        :class="{ 'gallery-item--main': index === 0 }"
        :style="{ transitionDelay: `${index * 80}ms` }"
      >
        <img v-if="hasImages" :src="image.src" :alt="image.alt || `Imagen ${index + 1}`" />
        <div v-else class="placeholder-card">{{ image.alt }}</div>
      </article>
    </div>
  </section>
</template>
