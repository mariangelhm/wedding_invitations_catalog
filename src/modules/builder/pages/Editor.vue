<!--
  Builder editor page layout.
  Organizes feature components into semantic left/center/right columns.
-->
<script setup>
import AddonsSelector from '../components/AddonsSelector.vue';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import ExpirationBanner from '../components/ExpirationBanner.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import PriceSummary from '../components/PriceSummary.vue';
</script>

<template>
  <section class="editor-page">
    <!--
      Layout decision:
      Left column groups editing controls (form + addons).
      Center column is dedicated to live preview.
      Right column groups meta information (price + expiration).
    -->
    <aside class="editor-column editor-column-left">
      <BasicEditorForm />
      <AddonsSelector />
    </aside>

    <main class="editor-column editor-column-center">
      <InvitationPreview />
    </main>

    <aside class="editor-column editor-column-right">
      <PriceSummary />
      <ExpirationBanner />
    </aside>
  </section>
</template>

<style scoped>
/*
  Structure-first responsive layout:
  - Mobile-first: stacked single column for narrow screens.
  - Desktop: switches to 3 columns for parallel editing + preview + metadata.
*/
.editor-page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
}

.editor-column {
  display: grid;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .editor-page {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: start;
  }
}
</style>
