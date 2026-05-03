<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAutosave } from '../composables/useAutosave';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import CustomizableComponentsPanel from '../components/CustomizableComponentsPanel.vue';
import ExpirationBanner from '../components/ExpirationBanner.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import EditorPreviewModal from '../components/EditorPreviewModal.vue';
import PriceSummary from '../components/PriceSummary.vue';
import { useBuilderStore } from '../../../store/builder.store';
import { templates } from '../../catalog/data/templates';

useAutosave();
const route = useRoute();
const builderStore = useBuilderStore();
const selectedSection = ref('info');
const isPreviewOpen = ref(false);

const sectionCatalog = [
  { id: 'info', label: 'Información', always: true },
  { id: 'colors', label: 'Colores', option: 'colors' },
  { id: 'typography', label: 'Tipografías', option: 'fonts' },
  { id: 'photos', label: 'Fotos', option: 'photos' },
  { id: 'music', label: 'Música', option: 'music' },
  { id: 'map', label: 'Mapa', option: 'map' },
  { id: 'components', label: 'Componentes', option: 'components' },
];

const selectedTemplate = computed(() => templates.find((item) => item.id === route.query.templateId) || null);

watch(selectedTemplate, (template) => {
  if (!builderStore.invitation || builderStore.invitation.templateId !== template?.id) {
    builderStore.createDraftInvitation(template);
  }
}, { immediate: true });

const availableSections = computed(() => {
  const options = builderStore.invitation?.customizableOptions || {};
  return sectionCatalog.filter((item) => item.always || options[item.option] === true);
});

watch(availableSections, (items) => {
  if (!items.some((item) => item.id === selectedSection.value)) selectedSection.value = items[0]?.id || 'info';
}, { immediate: true });

const activeSectionLabel = computed(() => availableSections.value.find((s) => s.id === selectedSection.value)?.label || 'Información');
</script>

<template>
  <section class="builder-editor-page">
    <header class="builder-toolbar">Visual Builder · {{ builderStore.invitation?.templateName || 'Sin template' }}</header>
    <div class="builder-layout">
      <aside class="icon-menu">
        <button v-for="item in availableSections" :key="item.id" class="icon-menu-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">{{ item.label }}</button>
      </aside>

      <aside class="settings-panel">
        <h2>{{ activeSectionLabel }}</h2>
        <div v-if="selectedSection === 'info'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="selectedSection === 'colors'" class="settings-block"><label>Primary color <input type="color" v-model="builderStore.invitation.styles.primaryColor" /></label></div>
        <div v-else-if="selectedSection === 'typography'" class="settings-block"><label>Font family <select v-model="builderStore.invitation.styles.fontFamily"><option>Arial</option><option>Georgia</option><option>Playfair Display</option><option>Poppins</option></select></label></div>
        <div v-else-if="selectedSection === 'photos'" class="settings-block"><div class="placeholder-card">Carga de fotos próximamente.</div></div>
        <div v-else-if="selectedSection === 'music'" class="settings-block"><div class="placeholder-card">Música: placeholder (sin integración aún).</div></div>
        <div v-else-if="selectedSection === 'map'" class="settings-block"><label>Ubicación <input type="text" v-model="builderStore.invitation.base.location" placeholder="Dirección o referencia" /></label></div>
        <div v-else class="settings-block"><CustomizableComponentsPanel /></div>

        <div class="summary-block"><PriceSummary /><ExpirationBanner /><button class="btn btn-secondary" @click="isPreviewOpen = true">Vista previa</button></div>
      </aside>

      <main class="canvas-panel">
        <div class="preview-canvas"><InvitationPreview /></div>
      </main>
    </div>

    <EditorPreviewModal :is-open="isPreviewOpen" @close="isPreviewOpen = false" />
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
