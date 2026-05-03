<!-- InvitationPreview resolves templates generically through templateRegistry. -->
<script setup>
import { computed, onMounted } from 'vue';
import RomanticTemplate from '../../invitations/templates/romantic/Template.vue';
import { getTemplateComponent } from '../../invitations/templates';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();

onMounted(() => {
  if (!builderStore.invitation) builderStore.createDraftInvitation();
});

const invitation = computed(() => builderStore.invitation || null);
const activeTemplateComponent = computed(() => getTemplateComponent(invitation.value?.templateComponent));
</script>

<template>
  <section>
    <h2>Invitation Preview</h2>
    <p v-if="!invitation">No invitation selected</p>

    <component
      :is="activeTemplateComponent"
      v-else-if="activeTemplateComponent"
      :invitationData="invitation"
    />

    <RomanticTemplate
      v-else
      :names="invitation?.base?.names"
      :date="invitation?.base?.date"
      :location="invitation?.base?.location"
      :message="invitation?.base?.message"
    />
  </section>
</template>
