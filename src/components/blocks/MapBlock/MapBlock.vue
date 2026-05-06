<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './mapBlock.css';

type MapBlockData = {
  props?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

const props = defineProps<{
  block?: MapBlockData;
  locationName?: string;
  address?: string;
  mapUrl?: string;
  embedUrl?: string;
}>();

const data = computed(() => ({
  ...(props.block?.settings || {}),
  ...(props.block?.props || {}),
  ...(props.locationName !== undefined ? { locationName: props.locationName } : {}),
  ...(props.address !== undefined ? { address: props.address } : {}),
  ...(props.mapUrl !== undefined ? { mapUrl: props.mapUrl } : {}),
  ...(props.embedUrl !== undefined ? { embedUrl: props.embedUrl } : {}),
}));
const resolvedLocationName = computed(() => String(data.value.locationName || 'Ubicación por definir'));
const resolvedAddress = computed(() => String(data.value.address || 'Dirección por definir'));
const resolvedMapUrl = computed(() => String(data.value.mapUrl || '#'));
const resolvedEmbedUrl = computed(() => String(data.value.embedUrl || ''));

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const showTooltip = ref(false);

onMounted(() => {
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
  <section ref="rootEl" class="map-block" :class="{ 'is-visible': isVisible }">
    <div class="map-pattern" aria-hidden="true"></div>
    <header class="map-block__head">
      <h3>Ubicación</h3>
      <button class="map-help" type="button" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="showTooltip = !showTooltip">ℹ</button>
      <div v-if="showTooltip" class="map-tooltip">Para obtener el link: abre Google Maps, busca el lugar, toca Compartir y copia el enlace.</div>
    </header>

    <p class="map-location">{{ resolvedLocationName }}</p>
    <p class="map-address">{{ resolvedAddress }}</p>
    <div v-if="resolvedEmbedUrl" class="map-embed-wrap">
      <iframe
        class="map-embed"
        :src="resolvedEmbedUrl"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div v-else class="map-fallback-preview" aria-hidden="true"><span>Vista de mapa disponible al pegar una URL de inserción</span></div>
    <a class="map-btn" :href="resolvedMapUrl" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>
  </section>
</template>
