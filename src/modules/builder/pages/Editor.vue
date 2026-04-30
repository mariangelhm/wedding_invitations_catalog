<!--
  Builder editor workspace.
  Uses a 3-panel professional layout: navigation sidebar, live preview, settings panel.
-->
<script setup>
import { ref } from 'vue';

import { useAutosave } from '../composables/useAutosave';
import AddonsSelector from '../components/AddonsSelector.vue';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import PriceSummary from '../components/PriceSummary.vue';
import SummaryCard from '../components/SummaryCard.vue';

// Enable autosave while users interact with the editor workspace.
useAutosave();

// Left menu tabs define which settings block is shown on the right panel.
const tabs = ['Información', 'Colores', 'Fotos', 'Música', 'Secciones'];
const activeTab = ref('Información');
</script>

<template>
  <section class="editor-page">
    <div class="editor-layout">
      <!--
        LEFT SIDEBAR:
        Vertical menu acts as section navigation for editor settings.
      -->
      <aside class="panel panel-sidebar">
        <h2>Editor</h2>
        <nav class="sidebar-menu">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="menu-item"
            :class="{ 'menu-item--active': activeTab === tab }"
            type="button"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </nav>
      </aside>

      <!--
        CENTER PREVIEW:
        Preview is wrapped in a phone-like device frame for realistic mobile context.
      -->
      <main class="panel panel-preview">
        <h2>Vista previa móvil</h2>
        <div class="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <InvitationPreview />
          </div>
        </div>
      </main>

      <!--
        RIGHT SETTINGS PANEL:
        Content switches by selected tab to keep editing focused.
      -->
      <aside class="panel panel-settings">
        <h2>{{ activeTab }}</h2>

        <div v-if="activeTab === 'Información'" class="settings-block">
          <BasicEditorForm />
        </div>

        <div v-else-if="activeTab === 'Colores'" class="settings-block">
          <p>Configuración de colores (próximamente).</p>
        </div>

        <div v-else-if="activeTab === 'Fotos'" class="settings-block">
          <p>Gestión de fotos y galería (próximamente).</p>
          <AddonsSelector />
        </div>

        <div v-else-if="activeTab === 'Música'" class="settings-block">
          <p>Configuración de música de fondo (próximamente).</p>
        </div>

        <div v-else class="settings-block">
          <p>Configuración de secciones (próximamente).</p>
          <PriceSummary />
          <SummaryCard />
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
