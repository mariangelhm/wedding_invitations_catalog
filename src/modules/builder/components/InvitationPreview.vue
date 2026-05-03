<!--
  Invitation preview component.
  We import template components here so this file can act as the single
  orchestration layer that chooses which invitation experience to render.
-->
<script setup>
import { computed, onMounted } from 'vue';

import RomanticTemplate from '../../invitations/templates/romantic/Template.vue';
// Explicit import avoids runtime unresolved-component warnings in preview rendering.
import RomanticMotionTemplate from '../../invitations/templates/romantic-motion/RomanticMotionTemplate.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

const invitation = computed(() => builderStore.invitation || null);

const isRomanticMotionTemplate = computed(() => {
  if (!invitation.value) return false;

  return invitation.value.templateId === 'romantic-01'
    || invitation.value.templateComponent === 'romantic-motion';
});

const hasSelectedTemplate = computed(() => Boolean(invitation.value?.templateId || invitation.value?.templateComponent));

const hasCountdownAddon = computed(() =>
  invitation.value?.addons.some((addon) => addon.type === 'countdown_wedding') ?? false,
);

const hasMapAddon = computed(() =>
  invitation.value?.addons.some((addon) => addon.type === 'map') ?? false,
);
</script>

<template>
  <section>
    <h2>Invitation Preview</h2>

    <p v-if="!invitation">No invitation selected</p>

    <template v-else>
      <RomanticMotionTemplate
        v-if="isRomanticMotionTemplate"
        :invitationData="invitation"
      />

      <RomanticTemplate
        v-else
        :names="invitation?.base.names"
        :date="invitation?.base.date"
        :location="invitation?.base.location"
        :message="invitation?.base.message"
      />

      <template v-if="!hasSelectedTemplate">
        <p v-if="hasCountdownAddon">Countdown enabled</p>
        <p v-if="hasMapAddon">Map enabled</p>
      </template>
    </template>
  </section>
</template>
