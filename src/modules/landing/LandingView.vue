<!--
  Landing module root view.
  Shows the app title and core builder module components.
-->
<script setup>
import AddonsSelector from '../builder/components/AddonsSelector.vue';
import BasicEditorForm from '../builder/components/BasicEditorForm.vue';
import PriceSummary from '../builder/components/PriceSummary.vue';
</script>

<template>
  <section class="landing-view">
    <h1>Wedding Invitation Builder App</h1>
    <BasicEditorForm />
    <AddonsSelector />
    <PriceSummary />
  </section>
</template>

<style scoped>
/* Minimal page layout for the landing screen. */
.landing-view {
  min-height: 100vh;
  display: grid;
  gap: 1rem;
  align-content: start;
  justify-items: center;
  padding: 1.5rem;
}
</style>
