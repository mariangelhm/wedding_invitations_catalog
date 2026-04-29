<!--
  Basic invitation editor form.
  Focuses on direct store binding (no extra UI complexity).
-->
<script setup>
import { onMounted, computed } from 'vue';

import { useBuilderStore } from '../../../../store/builder.store';

// Use the Pinia builder store as the single source of truth for invitation data.
const builderStore = useBuilderStore();

// Ensure a draft invitation exists before binding form inputs.
// This allows v-model to always target defined fields on invitation.base.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

// Computed helper for safe JSON preview in template.
const invitationJson = computed(() => JSON.stringify(builderStore.invitation, null, 2));
</script>

<template>
  <section class="basic-editor-form">
    <h2>Basic Invitation Editor</h2>

    <!--
      Reactivity note:
      Pinia store state is reactive. Because invitation/base fields are reactive,
      template reads and writes stay in sync automatically.
    -->
    <div v-if="builderStore.invitation" class="form-fields">
      <label>
        Names
        <!--
          v-model note:
          v-model creates two-way binding between this input and
          builderStore.invitation.base.names.
          Typing here immediately mutates store state and updates all consumers.
        -->
        <input v-model="builderStore.invitation.base.names" type="text" />
      </label>

      <label>
        Date
        <input v-model="builderStore.invitation.base.date" type="text" />
      </label>

      <label>
        Location
        <input v-model="builderStore.invitation.base.location" type="text" />
      </label>

      <label>
        Message
        <textarea v-model="builderStore.invitation.base.message" rows="4"></textarea>
      </label>
    </div>

    <h3>Current Invitation JSON</h3>
    <pre>{{ invitationJson }}</pre>
  </section>
</template>

<style scoped>
/* Simple layout only; no unnecessary styling complexity. */
.basic-editor-form {
  display: grid;
  gap: 0.75rem;
  width: min(720px, 100%);
  padding: 1rem;
}

.form-fields {
  display: grid;
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.25rem;
}

input,
textarea {
  padding: 0.5rem;
}

pre {
  background: #f5f5f5;
  padding: 0.75rem;
  overflow: auto;
}
</style>
