<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './timelineBlock.css';

type TimelineItem = { time?: string; title?: string; place?: string; location?: string };
type TimelineBlockData = {
  props?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

/**
 * Reusable timeline block props:
 * - title: optional heading
 * - items: event itinerary entries
 */
const props = defineProps<{
  block?: TimelineBlockData;
  title?: string;
  items?: TimelineItem[];
}>();

const data = computed(() => ({
  ...(props.block?.settings || {}),
  ...(props.block?.props || {}),
  ...(props.title !== undefined ? { title: props.title } : {}),
  ...(props.items !== undefined ? { items: props.items } : {}),
}));
const fallbackItems = [
  { time: '17:00', title: 'Ceremonia', place: 'Lugar por definir' },
  { time: '19:00', title: 'Celebración', place: 'Lugar por definir' },
  { time: '21:00', title: 'Fiesta', place: 'Lugar por definir' },
];
const resolvedTitle = computed(() => String(data.value.title || 'Bitácora del evento'));
const resolvedItems = computed(() => {
  const items = Array.isArray(data.value.items) ? data.value.items as TimelineItem[] : [];
  return items.length ? items : fallbackItems;
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
    <h3 class="timeline-title">{{ resolvedTitle }}</h3>

    <div class="timeline-list">
      <article
        v-for="(item, index) in resolvedItems"
        :key="`${item.time}-${item.title}-${index}`"
        class="timeline-item"
        :style="{ transitionDelay: `${index * 90}ms` }"
      >
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-card">
          <p class="timeline-time">{{ item.time || 'Hora por definir' }}</p>
          <p class="timeline-item-title">{{ item.title || `Momento ${index + 1}` }}</p>
          <p class="timeline-place">{{ item.place || item.location || 'Lugar por definir' }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
