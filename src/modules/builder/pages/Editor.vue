<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useAutosave } from '../composables/useAutosave';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import CustomizableComponentsPanel from '../components/CustomizableComponentsPanel.vue';
import ExpirationBanner from '../components/ExpirationBanner.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import PriceSummary from '../components/PriceSummary.vue';
import { useBuilderStore } from '../../../store/builder.store';
import { templates } from '../../catalog/data/templates';
import { useI18n } from '../../../core/i18n';

useAutosave();
const route = useRoute();
const builderStore = useBuilderStore();
const { currentLang } = useI18n();

const selectedSection = ref('info');
const sections = computed(() => [
  { id: 'info', es: 'Información', en: 'Information' },
  { id: 'colors', es: 'Colores', en: 'Colors' },
  { id: 'typography', es: 'Tipografías', en: 'Typography' },
  { id: 'photos', es: 'Fotos', en: 'Photos' },
  { id: 'music', es: 'Música', en: 'Music' },
  { id: 'map', es: 'Mapa', en: 'Map' },
  { id: 'components', es: 'Componentes', en: 'Components' },
]);
const sectionLabel = (item) => (currentLang.value === 'en' ? item.en : item.es);

watchEffect(() => {
  if (!builderStore.invitation) {
    const selected = templates.find((item) => item.id === route.query.templateId) || null;
    builderStore.createDraftInvitation(selected);
  }
});
</script>

<template>
  <section class="editor-page">
    <div class="editor-grid">
      <aside class="editor-panel menu-panel">
        <h2>Editor</h2>
        <div class="section-menu">
          <button v-for="item in sections" :key="item.id" class="section-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">{{ sectionLabel(item) }}</button>
        </div>
      </aside>

      <main class="editor-panel preview-panel">
        <h2>Vista previa</h2>
        <div class="preview-canvas"><InvitationPreview /></div>
      </main>

      <aside class="editor-panel settings-panel">
        <h2>{{ sectionLabel(sections.find((s) => s.id === selectedSection) || sections[0]) }}</h2>
        <div v-if="selectedSection === 'info'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="selectedSection === 'colors'" class="settings-block"><label>Primary color <input type="color" v-model="builderStore.invitation.styles.primaryColor" /></label></div>
        <div v-else-if="selectedSection === 'typography'" class="settings-block"><label>Font family <select v-model="builderStore.invitation.styles.fontFamily"><option>Arial</option><option>Georgia</option><option>Playfair Display</option><option>Poppins</option></select></label></div>
        <div v-else-if="selectedSection === 'photos'" class="settings-block"><div class="placeholder-card">Carga de fotos disponible próximamente.</div></div>
        <div v-else-if="selectedSection === 'music'" class="settings-block"><div class="placeholder-card">Configuración de música próximamente. Estado: {{ builderStore.invitation.addons.some((a)=>a.type==='music') ? 'Activa' : 'Inactiva' }}</div></div>
        <div v-else-if="selectedSection === 'map'" class="settings-block"><label>Ubicación / enlace mapa <input type="text" v-model="builderStore.invitation.base.location" placeholder="https://maps..." /></label></div>
        <div v-else class="settings-block"><CustomizableComponentsPanel /></div>

        <div class="summary-block"><PriceSummary /><ExpirationBanner /><div class="summary-actions"><button class="btn btn-primary">Guardar</button><button class="btn btn-secondary">Vista previa</button></div></div>
      </aside>
    </div>
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
