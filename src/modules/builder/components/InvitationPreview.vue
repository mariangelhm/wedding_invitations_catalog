<script setup>
import { computed, onMounted } from 'vue';
import RomanticTemplate from '../../invitations/templates/romantic/Template.vue';
import { getTemplateComponent } from '../../invitations/templates';
import { useBuilderStore } from '../../../store/builder.store';

const props = defineProps({
  showTitle: { type: Boolean, default: true },
  device: { type: String, default: 'desktop' },
});

const builderStore = useBuilderStore();
onMounted(() => { if (!builderStore.invitation) builderStore.createDraftInvitation(); });
const invitation = computed(() => builderStore.invitation || null);
const activeTemplateComponent = computed(() => getTemplateComponent(invitation.value?.templateComponent));
</script>

<template>
  <section class="invitation-preview" :class="[`invitation-preview--${device}`]">
    <h2 v-if="showTitle">Invitation Preview</h2>
    <div class="invitation-preview__canvas">
      <p v-if="!invitation">No invitation selected</p>
      <component :is="activeTemplateComponent" v-else-if="activeTemplateComponent" :invitationData="invitation" />
      <RomanticTemplate v-else :names="invitation?.base?.coupleNames || invitation?.base?.names" :date="invitation?.base?.eventDate || invitation?.base?.date" :location="invitation?.base?.locationName || invitation?.base?.location" :message="invitation?.base?.message" />
    </div>
  </section>
</template>

<style scoped>
.invitation-preview{position:relative;overflow:auto;width:100%;max-width:100%}
.invitation-preview__canvas{position:relative;overflow:hidden;width:100%;max-width:100%;isolation:isolate}
.invitation-preview--desktop{max-width:920px;width:100%;margin:0 auto}
.invitation-preview--mobile{max-width:390px;width:100%;margin:0 auto}
</style>
