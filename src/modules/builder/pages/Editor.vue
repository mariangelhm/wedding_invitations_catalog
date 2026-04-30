<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useAutosave } from '../composables/useAutosave';
import AddonsSelector from '../components/AddonsSelector.vue';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import PriceSummary from '../components/PriceSummary.vue';
import SummaryCard from '../components/SummaryCard.vue';
import CustomizableComponentsPanel from '../components/CustomizableComponentsPanel.vue';
import { useBuilderStore } from '../../../store/builder.store';
import { templates } from '../../catalog/data/templates';

useAutosave();
const route = useRoute();
const builderStore = useBuilderStore();

const activeTab = ref('Información');
const options = computed(() => builderStore.invitation?.customizableOptions || {});
const tabs = computed(() => ['Información', 'Colores', 'Tipografías', 'Fotos', 'Música', 'Mapa', 'Componentes']);

watchEffect(() => {
  const templateId = route.query.templateId;
  if (!builderStore.invitation) {
    const selected = templates.find((item) => item.id === templateId) || null;
    builderStore.createDraftInvitation(selected);
  }
});
</script>

<template>
  <section class="editor-page">
    <div class="editor-layout">
      <aside class="panel panel-sidebar">
        <h2>Editor</h2>
        <p v-if="builderStore.invitation" class="template-context">Estás personalizando: {{ builderStore.invitation.templateName }}</p>
        <nav class="sidebar-menu"><button v-for="tab in tabs" :key="tab" class="menu-item" :class="{ 'menu-item--active': activeTab === tab }" @click="activeTab = tab">{{ tab }}</button></nav>
      </aside>
      <main class="panel panel-preview"><h2>Vista previa móvil</h2><div class="phone-frame"><div class="phone-notch"></div><div class="phone-screen"><InvitationPreview /></div></div></main>
      <aside class="panel panel-settings">
        <h2>{{ activeTab }}</h2>
        <div v-if="activeTab === 'Información'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="activeTab === 'Colores' && options.colors" class="settings-block"><p>Configuración de colores habilitada.</p></div>
        <div v-else-if="activeTab === 'Tipografías'" class="settings-block"><p>Configuración de tipografías habilitada.</p></div>
        <div v-else-if="activeTab === 'Fotos'" class="settings-block"><p>Gestión de fotos habilitada.</p><AddonsSelector /></div>
        <div v-else-if="activeTab === 'Música'" class="settings-block"><p>Música de fondo habilitada.</p></div>
        <div v-else-if="activeTab === 'Mapa'" class="settings-block"><p>Configuración de mapa.</p><AddonsSelector /></div>
        <div v-else class="settings-block"><p>Configuración de componentes.</p><CustomizableComponentsPanel /><PriceSummary /><SummaryCard /></div>
      </aside>
    </div>
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
