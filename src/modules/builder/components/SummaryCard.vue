<!--
  Purchase summary card.
  Gives users a clear pricing overview before payment.
-->
<script setup>
import { onMounted } from 'vue';

import Button from '../../../components/ui/Button.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

// Ensure invitation exists so summary can render complete pricing data.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});
</script>

<template>
  <section class="summary-card">
    <h2>Purchase Summary</h2>

    <!-- Main invitation identity and base pricing information. -->
    <p><strong>Invitation name:</strong> {{ builderStore.invitation?.base.names || 'Untitled Invitation' }}</p>
    <p><strong>Base price:</strong> {{ builderStore.basePrice }}</p>

    <!-- Addons list shows optional costs included in the final total. -->
    <div>
      <h3>Add-ons</h3>
      <ul v-if="builderStore.invitation && builderStore.invitation.addons.length > 0">
        <li v-for="addon in builderStore.invitation.addons" :key="addon.type">
          {{ addon.label }}: {{ addon.price }}
        </li>
      </ul>
      <p v-else>No add-ons selected.</p>
    </div>

    <!-- Total is highlighted to improve payment decision clarity. -->
    <p class="summary-total">
      <strong>Total:</strong> {{ builderStore.totalPrice }}
    </p>

    <p class="summary-note">Your invitation will be active for 12 months</p>

    <Button label="Continue to payment" />
  </section>
</template>

<style scoped>
.summary-card {
  display: grid;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.9rem;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
  padding: 1rem;
}

.summary-total {
  font-size: 1.1rem;
  color: #7e4f70;
}

.summary-note {
  font-size: 0.92rem;
  color: #4b5563;
}
</style>
