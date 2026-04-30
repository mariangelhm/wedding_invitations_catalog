<!--
  Console-only test component for validating builderStore draft creation.
  It runs once on mount and prints the generated invitation object.
-->
<script setup>
import { onMounted } from 'vue';

import { useBuilderStore } from '../../store/builder.store';

const builderStore = useBuilderStore();

// Simple test helper that creates a draft and logs the result to the console.
const runBuilderStoreTest = () => {
  const draft = builderStore.createDraftInvitation();
  console.log('[BuilderStore Test] Draft invitation created:', draft);
};

// Run the test automatically when this component is mounted.
onMounted(() => {
  runBuilderStoreTest();
});
</script>

<template>
  <!-- Intentionally no UI output; this component exists for development console testing only. -->
  <span style="display: none" aria-hidden="true"></span>
</template>
