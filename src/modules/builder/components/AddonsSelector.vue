<script setup>
import { computed, onMounted } from 'vue';
import { useBuilderStore } from '../../../../store/builder.store';

const builderStore = useBuilderStore();
const AVAILABLE_ADDONS = [
  { type: 'countdown_wedding', label: 'Cuenta regresiva', price: 3000, option: 'countdown' },
  { type: 'map', label: 'Mapa', price: 3000, option: 'map' },
  { type: 'gallery', label: 'Fotos', price: 5000, option: 'photos' },
  { type: 'music', label: 'Música', price: 2500, option: 'music' },
];

onMounted(() => { if (!builderStore.invitation) builderStore.createDraftInvitation(); });
const allowedAddons = computed(() => AVAILABLE_ADDONS.filter((a) => builderStore.invitation?.customizableOptions?.[a.option] !== false));
const isAddonSelected = (type) => builderStore.invitation?.addons.some((a) => a.type === type);
const toggleAddon = (addon, checked) => {
  if (!builderStore.invitation) return;
  if (checked && !isAddonSelected(addon.type)) builderStore.invitation.addons.push(addon);
  if (!checked) builderStore.invitation.addons = builderStore.invitation.addons.filter((a) => a.type !== addon.type);
};
</script>
<template>
  <section class="addons-selector"><h2>Add-ons</h2><div v-if="builderStore.invitation" class="addons-list"><label v-for="addon in allowedAddons" :key="addon.type" class="addon-item"><input type="checkbox" :checked="isAddonSelected(addon.type)" @change="toggleAddon(addon, $event.target.checked)"/><span>{{ addon.label }} ({{ addon.price }})</span></label></div></section>
</template>
