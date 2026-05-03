<script setup>
import { computed } from 'vue';
import { useI18n } from '../../../../core/i18n';

const props = defineProps({
  mapUrl: { type: String, default: '' },
  locationName: { type: String, default: 'Ubicación del evento' },
});

const { currentLang } = useI18n();

// Tooltip guides users to obtain a shareable Google Maps link for MVP map action.
const tooltipText = computed(() =>
  currentLang.value === 'en'
    ? 'Open Google Maps, search the location, click Share and copy the link.'
    : 'Abre Google Maps, busca la ubicación, presiona Compartir y copia el enlace.',
);

const safeMapUrl = computed(() => props.mapUrl || '#');
</script>

<template>
  <section class="map-block-card">
    <div class="map-block-head">
      <h3>{{ locationName }}</h3>
      <span class="map-help" :title="tooltipText">ⓘ</span>
    </div>

    <a class="map-link-btn" :href="safeMapUrl" target="_blank" rel="noopener noreferrer">
      Ver ubicación
    </a>
  </section>
</template>

<style scoped>
.map-block-card { border: 1px solid #E5E7EB; border-radius: 16px; background: #fff; padding: 14px; box-shadow: 0 8px 18px rgba(17,24,39,.08); display: grid; gap: 10px; }
.map-block-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.map-block-head h3 { color: #111827; font-size: 1rem; margin: 0; }
.map-help { color: #C7355C; font-weight: 700; cursor: help; }
.map-link-btn { display: inline-block; width: fit-content; border-radius: 999px; background: #C7355C; color: #fff; text-decoration: none; padding: 8px 14px; }
@media (max-width: 640px) { .map-block-card { padding: 12px; } .map-link-btn { width: 100%; text-align: center; } }
</style>
