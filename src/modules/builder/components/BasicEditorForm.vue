<!--
  Basic invitation editor form.
  Focuses on direct store binding (no extra UI complexity).
-->
<script setup>
import { onMounted, computed } from 'vue';

import Input from '../../../components/ui/Input.vue';
import TextArea from '../../../components/ui/TextArea.vue';
import { useBuilderStore } from '../../../store/builder.store';

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
      <!--
        Reusability note:
        Shared Input/TextArea components standardize field UI and v-model behavior,
        so forms across modules stay consistent and easier to maintain.
      -->
      <Input v-model="builderStore.invitation.base.names" label="Names" />
      <Input v-model="builderStore.invitation.base.date" label="Date" />
      <Input v-model="builderStore.invitation.base.location" label="Location" />
      <TextArea v-model="builderStore.invitation.base.message" label="Message" :rows="4" />
    </div>

    
  </section>
</template>

<style scoped>
/* Simple layout only; no unnecessary styling complexity. */
.basic-editor-form {
  display: grid;
  gap: 0.75rem;
  width: min(720px, 100%);
}

.form-fields {
  display: grid;
  gap: 0.75rem;
}

pre {
  background: #f5f5f5;
  padding: 0.75rem;
  overflow: auto;
}
</style>
