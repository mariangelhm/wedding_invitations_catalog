<!--
  Expiration information banner.
  Shows invitation expiration date and remaining days.
-->
<script setup>
import { computed, onMounted } from 'vue';

import { useBuilderStore } from '../../../../store/builder.store';

const builderStore = useBuilderStore();

// Ensure we always have invitation data to evaluate expiration.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

// Parse expiration date from store model to a Date instance.
const expirationDate = computed(() => {
  if (!builderStore.invitation?.expiresAt) return null;
  return new Date(builderStore.invitation.expiresAt);
});

// Date logic:
// Difference in milliseconds converted to full remaining days (rounded up)
// so partial day still counts as 1 day remaining for user clarity.
const daysRemaining = computed(() => {
  if (!expirationDate.value) return null;

  const now = new Date();
  const diffMs = expirationDate.value.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
});

// Show warning when remaining time is below 3 days.
const isNearExpiration = computed(() => {
  if (daysRemaining.value === null) return false;
  return daysRemaining.value < 3;
});
</script>

<template>
  <section>
    <h2>Expiration</h2>
    <p><strong>Expires At:</strong> {{ expirationDate ? expirationDate.toLocaleString() : 'N/A' }}</p>
    <p><strong>Days Remaining:</strong> {{ daysRemaining ?? 'N/A' }}</p>
    <p v-if="isNearExpiration">⚠️ Warning: This draft is close to expiration.</p>
  </section>
</template>
