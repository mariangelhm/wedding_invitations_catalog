<script setup>
import { computed } from 'vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

const optionalItems = [
  { key: 'colors', label: 'Colores', description: 'Personaliza paleta principal', addonType: null, price: 0 },
  { key: 'fonts', label: 'Tipografías', description: 'Elige familia tipográfica', addonType: null, price: 0 },
  { key: 'photos', label: 'Fotos', description: 'Galería de fotos de la pareja', addonType: 'gallery', price: 5000 },
  { key: 'music', label: 'Música', description: 'Reproductor de música de fondo', addonType: 'music', price: 4000 },
  { key: 'map', label: 'Mapa', description: 'Ubicación del evento', addonType: 'map', price: 3000 },
  { key: 'countdown_wedding', label: 'Countdown boda', description: 'Cuenta regresiva para el evento', addonType: 'countdown_wedding', price: 3000 },
  { key: 'countdown_rsvp', label: 'Countdown RSVP', description: 'Cuenta regresiva para confirmar', addonType: 'countdown_rsvp', price: 2000 },
];

const availableItems = computed(() => optionalItems.filter((item) => builderStore.invitation?.customizableOptions?.[item.key] || item.addonType === null));
const isSelected = (type) => builderStore.invitation?.addons?.some((a) => a.type === type);
const onToggle = (item, checked) => { if (item.addonType) builderStore.toggleAddon(item.addonType, item.label, item.price, checked); };
</script>

<template>
  <section class="custom-components-panel">
    <h3>Componentes personalizables</h3>
    <div class="component-card static"><strong>Textos básicos</strong><p>Fecha, dirección y mensaje siempre incluidos.</p></div>
    <label v-for="item in availableItems" :key="item.key" class="component-card">
      <div>
        <strong>{{ item.label }}</strong>
        <p>{{ item.description }}</p>
        <small v-if="item.price">+ {{ item.price }}</small>
      </div>
      <input type="checkbox" :disabled="!item.addonType" :checked="item.addonType ? isSelected(item.addonType) : true" @change="onToggle(item, $event.target.checked)" />
    </label>
  </section>
</template>
