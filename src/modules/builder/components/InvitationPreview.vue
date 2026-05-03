<!--
  Invitation preview component.
  Delegates rendering to a concrete invitation template.
-->
<script setup>
import { computed, onMounted } from 'vue';

import RomanticTemplate from '../../invitations/templates/romantic/Template.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

onMounted(() => {
  if (!builderStore.invitation) {
    builderStore.createDraftInvitation();
  }
});

const selectedTemplateId = computed(() => builderStore.invitation?.templateId || '');
const isRomanticMotion = computed(() => ['romantic-01', 'romantic-motion'].includes(selectedTemplateId.value));
const hasSelectedTemplate = computed(() => Boolean(selectedTemplateId.value));

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

    <RomanticMotionTemplate
      v-if="isRomanticMotion"
      :invitation-data="builderStore.invitation"
    />

    <RomanticTemplate
      v-else
      :names="builderStore.invitation?.base.names"
      :date="builderStore.invitation?.base.date"
      :location="builderStore.invitation?.base.location"
      :message="builderStore.invitation?.base.message"
    />

    <template v-if="!hasSelectedTemplate">
      <p v-if="hasCountdownAddon">Countdown enabled</p>
      <p v-if="hasMapAddon">Map enabled</p>
    </template>
  </section>
</template>
