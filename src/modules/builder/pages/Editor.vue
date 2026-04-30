<!--
  Builder editor page layout.
  Organizes feature components into semantic left/center/right columns.
-->
<script setup>
import { useAutosave } from '../composables/useAutosave';
import AddonsSelector from '../components/AddonsSelector.vue';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import ExpirationBanner from '../components/ExpirationBanner.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import PriceSummary from '../components/PriceSummary.vue';

// Enable autosave while users interact with the editor workspace.
useAutosave();
</script>

<template>
  <section class="editor-page">
    <div class="editor-container">
      <!--
        Layout decision:
        Left column groups editing controls (form + addons).
        Each control block is wrapped in a card to improve scanning and separation.
      -->
      <aside class="editor-column editor-column-left">
        <div class="editor-card">
          <BasicEditorForm />
        </div>

        <div class="editor-card">
          <AddonsSelector />
        </div>
      </aside>

      <!--
        Center column emphasizes preview output.
        Preview is wrapped in an invitation-like card shell.
      -->
      <main class="editor-column editor-column-center">
        <div class="editor-preview-shell">
          <InvitationPreview />
        </div>
      </main>

      <!--
        Right column contains metadata blocks.
        Price and expiration are separated into individual cards.
      -->
      <aside class="editor-column editor-column-right">
        <div class="editor-card">
          <PriceSummary />
        </div>

        <div class="editor-card">
          <ExpirationBanner />
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
