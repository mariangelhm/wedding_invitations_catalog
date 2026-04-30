<!--
  Invitation preview component.
  Delegates rendering to a concrete invitation template.
-->
<script setup>
import { computed, onMounted } from 'vue';

import RomanticTemplate from '../../../invitations/templates/romantic/Template.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

// Ensure there is always an invitation object to preview.
onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

// Dynamic rendering helpers:
// These computed flags update automatically when addons are changed in store.
const hasCountdownAddon = computed(() =>
  builderStore.invitation?.addons.some((addon) => addon.type === 'countdown_wedding') ?? false,
);

const hasMapAddon = computed(() =>
  builderStore.invitation?.addons.some((addon) => addon.type === 'map') ?? false,
);
</script>

<template>
  <section>
    <h2>Invitation Preview</h2>

    <!--
      Template rendering decision:
      InvitationPreview acts as orchestration layer and passes store data
      into the selected presentation template component.
    -->
    <RomanticTemplate
      :names="builderStore.invitation?.base.names"
      :date="builderStore.invitation?.base.date"
      :location="builderStore.invitation?.base.location"
      :message="builderStore.invitation?.base.message"
    />

    <!--
      Conditional addon placeholders:
      Render only when matching addon types exist in invitation.addons.
    -->
    <p v-if="hasCountdownAddon">Countdown enabled</p>
    <p v-if="hasMapAddon">Map enabled</p>
  </section>
</template>
