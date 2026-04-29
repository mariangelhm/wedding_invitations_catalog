<!--
  Invitation preview component.
  Renders invitation data directly from store state.
-->
<script setup>
import { computed, onMounted } from 'vue';

import { useBuilderStore } from '../../../../store/builder.store';

const builderStore = useBuilderStore();

// Ensure there is always an invitation object to preview.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

// Dynamic rendering helpers:
// These computed flags update automatically when addons are changed in store.
const hasCountdownAddon = computed(() =>
  builderStore.invitation?.addons.some((addon) => addon.type === 'countdown_wedding') ?? false,
);

const hasMapAddon = computed(() =>
  builderStore.invitation?.addons.some((addon) => addon.type === 'map') ?? false,
);
</script>

<template>
  <section>
    <h2>Invitation Preview</h2>

    <!--
      Dynamic rendering note:
      These values come directly from reactive Pinia state, so preview text updates live
      while user edits fields in the form.
    -->
    <p><strong>Names:</strong> {{ builderStore.invitation?.base.names }}</p>
    <p><strong>Date:</strong> {{ builderStore.invitation?.base.date }}</p>
    <p><strong>Location:</strong> {{ builderStore.invitation?.base.location }}</p>
    <p><strong>Message:</strong> {{ builderStore.invitation?.base.message }}</p>

    <!--
      Conditional addon placeholders:
      Render only when matching addon types exist in invitation.addons.
    -->
    <p v-if="hasCountdownAddon">Countdown enabled</p>
    <p v-if="hasMapAddon">Map enabled</p>
  </section>
</template>
