<!--
  Add-ons selector for invitation customization.
  Provides simple checkbox toggles backed by Pinia state.
-->
<script setup>
import { computed, onMounted } from 'vue';

import { useBuilderStore } from '../../../../store/builder.store';

const builderStore = useBuilderStore();

// Static add-ons catalog used by the builder.
const AVAILABLE_ADDONS = [
  { type: 'countdown_wedding', label: 'Wedding Countdown', price: 3000 },
  { type: 'map', label: 'Map', price: 3000 },
  { type: 'gallery', label: 'Gallery', price: 5000 },
];

// Ensure invitation state exists before users interact with checkboxes.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

// Utility: returns true when an addon type already exists in invitation.addons.
const isAddonSelected = (type) => {
  if (!builderStore.invitation) return false;
  return builderStore.invitation.addons.some((addon) => addon.type === type);
};

// Handles add/remove behavior for checkbox toggles.
const toggleAddon = (addon, checked) => {
  if (!builderStore.invitation) return;

  if (checked) {
    // Add only if this addon type is not already present to avoid duplicates.
    if (!isAddonSelected(addon.type)) {
      builderStore.invitation.addons.push(addon);
    }
    return;
  }

  // Remove addon by type when unchecked.
  builderStore.invitation.addons = builderStore.invitation.addons.filter(
    (selectedAddon) => selectedAddon.type !== addon.type,
  );
};

// JSON preview for debugging selected add-ons state.
const selectedAddonsJson = computed(() => {
  if (!builderStore.invitation) return '[]';
  return JSON.stringify(builderStore.invitation.addons, null, 2);
});
</script>

<template>
  <section class="addons-selector">
    <h2>Add-ons</h2>

    <div v-if="builderStore.invitation" class="addons-list">
      <label v-for="addon in AVAILABLE_ADDONS" :key="addon.type" class="addon-item">
        <input
          type="checkbox"
          :checked="isAddonSelected(addon.type)"
          @change="toggleAddon(addon, $event.target.checked)"
        />
        <span>{{ addon.label }} ({{ addon.price }})</span>
      </label>
    </div>

    <h3>Selected Add-ons JSON</h3>
    <pre>{{ selectedAddonsJson }}</pre>
  </section>
</template>

<style scoped>
/* Keep styles basic and functional-only. */
.addons-selector {
  display: grid;
  gap: 0.75rem;
  width: min(720px, 100%);
  padding: 1rem;
}

.addons-list {
  display: grid;
  gap: 0.5rem;
}

.addon-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

pre {
  background: #f5f5f5;
  padding: 0.75rem;
  overflow: auto;
}
</style>
