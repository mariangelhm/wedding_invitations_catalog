<!--
  Price summary component.
  Reads pricing data directly from builderStore and displays a live total.
-->
<script setup>
import { onMounted } from 'vue';

import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

// Ensure invitation exists so addon list is always defined in UI.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});
</script>

<template>
  <section class="price-summary">
    <h2>Price Summary</h2>

    <!-- Base price is the fixed starting cost before addons. -->
    <p><strong>Base Price:</strong> {{ builderStore.basePrice }}</p>

    <h3>Selected Add-ons</h3>
    <ul v-if="builderStore.invitation && builderStore.invitation.addons.length > 0">
      <li v-for="addon in builderStore.invitation.addons" :key="addon.type">
        {{ addon.label }}: {{ addon.price }}
      </li>
    </ul>
    <p v-else>No add-ons selected.</p>

    <!--
      totalPrice is a reactive getter in the store.
      It automatically updates when addons are added/removed.
    -->
    <p><strong>Total:</strong> {{ builderStore.totalPrice }}</p>
  </section>
</template>

<style scoped>
/* Intentionally simple presentation only. */
.price-summary {
  display: grid;
  gap: 0.5rem;
  width: min(720px, 100%);
  padding: 1rem;
}

ul {
  margin-left: 1rem;
}
</style>
