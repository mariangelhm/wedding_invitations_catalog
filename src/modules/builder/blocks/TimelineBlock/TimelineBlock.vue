<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

// Reusable timeline block:
// receives itinerary items and renders a vertical event sequence.
</script>

<template>
  <section class="timeline-card">
    <h3>Bitácora del evento</h3>

    <div v-if="items.length" class="timeline-list">
      <article v-for="(item, index) in items" :key="`${item.time}-${item.title}-${index}`" class="timeline-item">
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-content">
          <p class="timeline-time">{{ item.time }}</p>
          <p class="timeline-title">{{ item.title }}</p>
          <p class="timeline-place">{{ item.place }}</p>
        </div>
      </article>
    </div>

    <p v-else class="timeline-empty">Sin eventos cargados aún.</p>
  </section>
</template>

<style scoped>
.timeline-card { border: 1px solid #E5E7EB; border-radius: 16px; background: #fff; padding: 16px; box-shadow: 0 8px 18px rgba(17,24,39,.08); }
.timeline-card h3 { margin-bottom: 12px; color: #111827; }
.timeline-list { position: relative; display: grid; gap: 12px; padding-left: 14px; }
.timeline-list::before { content: ''; position: absolute; left: 6px; top: 4px; bottom: 4px; width: 2px; background: #C7355C; }
.timeline-item { display: grid; grid-template-columns: 14px 1fr; gap: 10px; align-items: start; }
.timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: #C7355C; box-shadow: 0 0 0 3px #FBE8EE; margin-top: 4px; }
.timeline-time { color: #A82B4A; font-weight: 700; margin-bottom: 2px; }
.timeline-title { font-weight: 600; color: #111827; margin-bottom: 2px; }
.timeline-place { color: #6B7280; }
.timeline-empty { color: #6B7280; }
@media (max-width: 640px) { .timeline-card { padding: 12px; } }
</style>
