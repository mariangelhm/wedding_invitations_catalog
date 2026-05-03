<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import wedding1 from '../../../assets/sample-gallery/wedding-1.jpg';
import wedding2 from '../../../assets/sample-gallery/wedding-2.jpg';
import wedding3 from '../../../assets/sample-gallery/wedding-3.jpg';
import wedding4 from '../../../assets/sample-gallery/wedding-4.jpg';
import './galleryBlock.css';

const props = withDefaults(defineProps<{
  title?: string;
  images?: Array<{ src: string; alt?: string }>
  integrated?: boolean;
}>(), {
  title: 'Nuestros momentos',
  images: () => [],
  integrated: false,
});

const localSampleImages = [
  { src: wedding1, alt: 'Foto principal' },
  { src: wedding2, alt: 'Momento especial' },
  { src: wedding3, alt: 'Nuestra historia' },
  { src: wedding4, alt: 'Celebración' },
];

const normalizedItems = computed(() => {
  const customItems = (props.images || [])
    .map((item, index) => {
      const src = (item?.src || '').trim();
      return {
        src,
        alt: item?.alt || `Imagen ${index + 1}`,
        isRealImage: src.length > 0,
      };
    })
    .filter((item) => item.isRealImage);

  if (customItems.length > 0) {
    return customItems;
  }

  return localSampleImages.map((item) => ({
    ...item,
    isRealImage: Boolean(item.src),
  }));
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
  <section ref="rootEl" class="gallery-block" :class="[{'gallery-block--integrated': integrated}, { 'is-visible': isVisible }]" >
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
