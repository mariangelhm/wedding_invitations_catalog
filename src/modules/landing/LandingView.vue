<!--
  Landing module root view.
  Shows app title and mounts the builder editor page layout.
-->
<script setup>
import { useAutosave } from '../builder/composables/useAutosave';
import Editor from '../builder/pages/Editor.vue';

// Enable autosave for invitation edits while this page is mounted.
useAutosave();
</script>

<template>
  <section class="landing-view">
    <h1>Wedding Invitation Builder App</h1>
    <Editor />
  </section>
</template>

<style scoped>
/* Keep outer page framing simple. */
.landing-view {
  min-height: 100vh;
  display: grid;
  gap: 1rem;
  align-content: start;
  padding: 1.5rem;
}
</style>
