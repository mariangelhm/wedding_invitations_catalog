<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './timelineBlock.css';

/**
 * Reusable timeline block props:
 * - title: optional heading
 * - items: event itinerary entries
 */
const props = withDefaults(defineProps<{
  title?: string;
  items: Array<{ time: string; title: string; place: string }>;
}>(), {
  title: 'Bitácora del evento',
});

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // IntersectionObserver triggers reveal only once for reusable scroll animations.
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
  <section ref="rootEl" class="timeline-block" :class="{ 'is-visible': isVisible }">
    <h3 class="timeline-title">{{ title }}</h3>

    <div class="timeline-list">
      <article
        v-for="(item, index) in items"
        :key="`${item.time}-${item.title}-${index}`"
        class="timeline-item"
        :style="{ transitionDelay: `${index * 90}ms` }"
      >
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-card">
          <p class="timeline-time">{{ item.time }}</p>
          <p class="timeline-item-title">{{ item.title }}</p>
          <p class="timeline-place">{{ item.place }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
