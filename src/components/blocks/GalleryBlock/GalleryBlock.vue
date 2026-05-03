<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './galleryBlock.css';

const props = withDefaults(defineProps<{
  title?: string;
  images?: Array<{ src: string; alt?: string }>;
}>(), {
  title: 'Nuestros momentos',
  images: () => [],
});

// Fallback behavior:
// - invalid/empty image sources render graceful placeholders (never broken images)
// - if no valid images are provided, a full default placeholder set is rendered
const defaultImages = [
  { src: '', alt: 'Foto principal' },
  { src: '', alt: 'Momento especial' },
  { src: '', alt: 'Nuestra historia' },
];

const normalizedItems = computed(() => {
  const safeItems = (props.images || []).map((item, index) => {
    const src = (item?.src || '').trim();
    return {
      src,
      alt: item?.alt || `Imagen ${index + 1}`,
      isRealImage: src.length > 0,
    };
  });

  const hasAtLeastOneImage = safeItems.some((item) => item.isRealImage);
  if (!hasAtLeastOneImage) {
    return defaultImages.map((item) => ({ ...item, isRealImage: false }));
  }

  return safeItems.map((item, index) => item.isRealImage
    ? item
    : { src: '', alt: item.alt || defaultImages[index % defaultImages.length].alt, isRealImage: false });
});

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
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

    <div class="gallery-grid">
      <article
        v-for="(image, index) in normalizedItems"
        :key="`${image.alt}-${index}`"
        class="gallery-item"
        :class="[{ 'gallery-item--main': index === 0 }, { 'gallery-item--placeholder': !image.isRealImage }]"
        :style="{ transitionDelay: `${index * 80}ms` }"
      >
        <img v-if="image.isRealImage" :src="image.src" :alt="image.alt" />
        <div v-else class="placeholder-card">
          <span class="placeholder-icon">✦</span>
          <span>{{ image.alt }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
