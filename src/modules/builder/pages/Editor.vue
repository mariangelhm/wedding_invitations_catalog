<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAutosave } from '../composables/useAutosave';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import EditorPreviewModal from '../components/EditorPreviewModal.vue';
import { useBuilderStore } from '../../../store/builder.store';
import { templates } from '../../catalog/data/templates';

useAutosave();
const route = useRoute();
const builderStore = useBuilderStore();
const selectedSection = ref('background');
const selectedPreviewDevice = ref('desktop');
const selectedBackgroundTab = ref('colors');
const isPreviewOpen = ref(false);

const sectionCatalog = [
  { id: 'background', label: 'Fondo', icon: '🎨', always: true },
  { id: 'envelope', label: 'Sobre', icon: '✉️', always: true },
  { id: 'card', label: 'Tarjeta', icon: '▣', always: true },
  { id: 'details', label: 'Detalles', icon: '⚙️', option: 'map' },
  { id: 'style', label: 'Estilo', icon: '✒️', option: 'fonts' },
  { id: 'blocks', label: 'Bloques', icon: '⧉', always: true },
];

const backgroundSwatches = ['#C7355C', '#F97316', '#2563EB', '#16A34A', '#7C3AED', '#111827', '#FBE8EE', '#FFFFFF'];
const textSwatches = ['#111827', '#374151', '#C7355C', '#FFFFFF', '#6B7280'];
const fontOptions = ['Cormorant', 'Playfair Display', 'Poppins', 'Georgia', 'Patrick Hand', 'Arial'];
const blockOptions = [
  { type: 'countdown_wedding', label: 'Cuenta regresiva boda', description: 'Cuenta regresiva al evento principal.', price: 3000 },
  { type: 'countdown_rsvp', label: 'Cuenta regresiva confirmación', description: 'Límite de confirmación RSVP.', price: 2500 },
  { type: 'gallery', label: 'Galería', description: 'Sección de fotos destacadas.', price: 5000 },
  { type: 'map', label: 'Mapa', description: 'Ubicación y acceso al evento.', price: 3000 },
  { type: 'timeline', label: 'Bitácora', description: 'Agenda de momentos del evento.', price: 2000 },
  { type: 'rsvp', label: 'RSVP', description: 'Confirmación de asistencia.', price: 2000 },
];

const selectedTemplate = computed(() => templates.find((item) => item.id === route.query.templateId) || null);
watch(selectedTemplate, (template) => {
  if (!builderStore.invitation || builderStore.invitation.templateId !== template?.id) builderStore.createDraftInvitation(template);
}, { immediate: true });

const invitation = computed(() => builderStore.invitation);
const availableSections = computed(() => {
  const options = invitation.value?.customizableOptions || {};
  return sectionCatalog.filter((item) => item.always || options[item.option] === true);
});
watch(availableSections, (items) => {
  if (!items.some((item) => item.id === selectedSection.value)) selectedSection.value = items[0]?.id || 'background';
}, { immediate: true });

const isAddonEnabled = (type) => invitation.value?.addons?.some((addon) => addon.type === type) ?? false;
const toggleBlockAddon = (item, checked) => builderStore.toggleAddon(item.type, item.label, item.price, checked);
</script>

<template>
  <section class="builder-editor-page">
    <header class="builder-toolbar">
      <div class="toolbar-title">Visual Builder · {{ invitation?.templateName || 'Sin template' }}</div>
      <div class="device-switch" role="group" aria-label="Vista de dispositivo">
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'desktop' }" @click="selectedPreviewDevice = 'desktop'">🖥️ Desktop</button>
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'mobile' }" @click="selectedPreviewDevice = 'mobile'">📱 Mobile</button>
      </div>
    </header>

    <div class="builder-layout">
      <aside class="icon-menu">
        <button v-for="item in availableSections" :key="item.id" class="icon-menu-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">
          <span class="menu-icon">{{ item.icon }}</span><span class="menu-label">{{ item.label }}</span>
        </button>
      </aside>

      <aside class="settings-panel">
        <div v-if="selectedSection === 'background'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: selectedBackgroundTab==='gallery' }" @click="selectedBackgroundTab='gallery'">Galería</button><button class="tab-btn" :class="{ active: selectedBackgroundTab==='colors' }" @click="selectedBackgroundTab='colors'">Colores</button></div>
          <div v-if="selectedBackgroundTab==='colors'" class="swatch-grid">
            <button v-for="color in backgroundSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation?.styles?.backgroundColor===color }" @click="invitation.styles.backgroundColor = color" />
          </div>
          <div v-else class="placeholder-stack"><div class="placeholder-card">Fondo romántico suave</div><div class="placeholder-card">Textura elegante</div><div class="placeholder-card">Upload disponible próximamente</div></div>
        </div>

        <div v-else-if="selectedSection === 'envelope'" class="placeholder-card">Configuración del sobre disponible próximamente</div>
        <div v-else-if="selectedSection === 'card'" class="settings-block"><BasicEditorForm /></div>

        <div v-else-if="selectedSection === 'details'" class="settings-block">
          <label>Nombre del lugar <input v-model="invitation.mapSettings.locationName" type="text" /></label>
          <label>Dirección <input v-model="invitation.mapSettings.address" type="text" /></label>
          <label>URL de Google Maps <input v-model="invitation.mapSettings.mapUrl" type="text" placeholder="https://maps.google.com/..." /></label>
          <p class="hint">Tip: abre Google Maps → Compartir → Copiar enlace.</p>
        </div>

        <div v-else-if="selectedSection === 'style'" class="settings-block">
          <div class="font-card-list"><button v-for="font in fontOptions" :key="font" class="font-card" :class="{ selected: invitation.styles.fontFamily===font }" :style="{ fontFamily: font }" @click="invitation.styles.fontFamily = font">{{ font }}</button></div>
          <div class="swatch-grid text-swatches"><button v-for="color in textSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.textColor===color }" @click="invitation.styles.textColor = color" /></div>
        </div>

        <div v-else class="block-list">
          <article v-for="item in blockOptions" :key="item.type" class="block-card"><div><h4>{{ item.label }}</h4><p>{{ item.description }}</p><small>${{ item.price }}</small></div><label class="toggle-wrap"><input type="checkbox" :checked="isAddonEnabled(item.type)" @change="toggleBlockAddon(item, $event.target.checked)" /><span>Activar</span></label></article>
        </div>
      </aside>

      <main class="canvas-panel">
        <div class="preview-canvas" :class="selectedPreviewDevice === 'mobile' ? 'preview-canvas--mobile' : 'preview-canvas--desktop'">
          <InvitationPreview :showTitle="false" :device="selectedPreviewDevice" />
        </div>
      </main>
    </div>

    <EditorPreviewModal :is-open="isPreviewOpen" @close="isPreviewOpen = false" />
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
