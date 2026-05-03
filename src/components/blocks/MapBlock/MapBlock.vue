<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './mapBlock.css';

const props = defineProps<{
  locationName: string;
  address: string;
  mapUrl: string;
}>();

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const showTooltip = ref(false);

onMounted(() => {
  // Animate once when block enters viewport.
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
    <header class="map-block__head">
      <h3>Ubicación</h3>
      <button
        class="map-help"
        type="button"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        @click="showTooltip = !showTooltip"
      >
        ℹ️
      </button>
      <div v-if="showTooltip" class="map-tooltip">
        Para obtener el link de Google Maps:<br />
        1. Abre Google Maps<br />
        2. Busca el lugar<br />
        3. Haz clic en 'Compartir'<br />
        4. Copia el enlace
      </div>
    </header>

    <p class="map-location">{{ locationName }}</p>
    <p class="map-address">{{ address }}</p>

    <a class="map-btn" :href="mapUrl" target="_blank" rel="noopener noreferrer">
      Ver en Google Maps
    </a>
  </section>
</template>

<!--
Ejemplo de uso:
<MapBlock
  locationName="Rose Garden Hall"
  address="Santiago, Chile"
  mapUrl="https://maps.google.com/..."
/>
-->
