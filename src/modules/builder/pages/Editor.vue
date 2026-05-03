<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAutosave } from '../composables/useAutosave';
import BasicEditorForm from '../components/BasicEditorForm.vue';
import InvitationPreview from '../components/InvitationPreview.vue';
import EditorPreviewModal from '../components/EditorPreviewModal.vue';
import { useBuilderStore } from '../../../store/builder.store';
import { templates } from '../../catalog/data/templates';
import { themePresets } from '../data/themePresets';
import { useI18n } from '../../../core/i18n';

useAutosave();
const route = useRoute();
const builderStore = useBuilderStore();
const { t } = useI18n();
const selectedSection = ref('background');
const selectedPreviewDevice = ref('desktop');
const selectedBackgroundTab = ref('themes');
const isPreviewOpen = ref(false);

const sectionCatalog = [
  { id: 'background', icon: '🎨', label: 'Fondo' },
  { id: 'card', icon: '▣', label: 'Tarjeta' },
  { id: 'style', icon: '✒️', label: 'Letras' },
  { id: 'extras', icon: '⧉', label: 'Extras' },
];

const blockOptions = [
  { type: 'countdown_wedding', label: 'Cuenta regresiva boda', description: 'Cuenta regresiva al evento principal.', price: 3000, preview: 'countdown' },
  { type: 'story', label: 'Historia', description: 'Cuenta su historia de amor.', price: 0, preview: 'story' },
  { type: 'gallery', label: 'Galería', description: 'Muestra fotos destacadas.', price: 5000, preview: 'gallery' },
  { type: 'timeline', label: 'Bitácora', description: 'Agenda de momentos del evento.', price: 2000, preview: 'timeline' },
  { type: 'map', label: 'Mapa', description: 'Ubicación y cómo llegar.', price: 3000, preview: 'map' },
  { type: 'countdown_rsvp', label: 'Cuenta regresiva RSVP', description: 'Límite de confirmación.', price: 2500, preview: 'countdown' },
  { type: 'rsvp', label: 'RSVP', description: 'Confirmación de asistencia.', price: 2000, preview: 'rsvp' },
];

const backgroundSwatches = ['#C7355C', '#F97316', '#2563EB', '#16A34A', '#7C3AED', '#111827', '#FBE8EE', '#FFFFFF'];
const titleColorSwatches = ['#111827', '#374151', '#C7355C', '#FFFFFF', '#2E2A24'];
const bodyColorSwatches = ['#111827', '#374151', '#6B7280', '#E5E7EB', '#5F574B'];
const fontStacks = { 'Playfair Display': "'Playfair Display', Georgia, serif", 'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif", Poppins: "'Poppins', Arial, sans-serif", Georgia: 'Georgia, serif', 'Patrick Hand': "'Patrick Hand', cursive", Arial: 'Arial, sans-serif' };
const fontOptions = Object.keys(fontStacks);

const selectedTemplate = computed(() => templates.find((item) => item.id === route.query.templateId) || null);
watch(selectedTemplate, (template) => {
  if (!builderStore.invitation || builderStore.invitation.templateId !== template?.id) builderStore.createDraftInvitation(template);
}, { immediate: true });

const invitation = computed(() => builderStore.invitation);
const orderedBlocks = computed(() => (invitation.value?.blocks || []).slice().sort((a, b) => a.order - b.order));
const mapBlock = computed(() => orderedBlocks.value.find((block) => block.type === 'map'));

const toggleBlockAddon = (item, checked) => {
  // Extras are reusable blocks. Toggling here updates invitation.blocks directly.
  builderStore.toggleBlock(item.type, checked);
};

const applyThemePreset = (preset) => {
  invitation.value.styles.backgroundTheme = preset.id;
  invitation.value.styles.primaryColor = preset.primaryColor;
  invitation.value.styles.secondaryColor = preset.secondaryColor;
  invitation.value.styles.textColor = preset.textColor;
  invitation.value.styles.titleColor = preset.titleColor;
  invitation.value.styles.bodyTextColor = preset.bodyTextColor;
  invitation.value.styles.accentShape = preset.accentShape;
  invitation.value.styles.backgroundGradient = preset.background;
};
</script>

<template>
  <section class="builder-editor-page">
    <header class="builder-toolbar">
      <RouterLink to="/catalog" class="back-link">← {{ t('editor.backToCatalog') }}</RouterLink>
      <div class="toolbar-title">Visual Builder · {{ invitation?.templateName || 'Sin template' }}</div>
    </header>

    <div class="builder-layout">
      <aside class="icon-menu">
        <button v-for="item in sectionCatalog" :key="item.id" class="icon-menu-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">
          <span class="menu-icon">{{ item.icon }}</span><span class="menu-label">{{ item.label }}</span>
        </button>
      </aside>

      <aside class="settings-panel">
        <div v-if="selectedSection === 'background'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: selectedBackgroundTab==='themes' }" @click="selectedBackgroundTab='themes'">Temas</button><button class="tab-btn" :class="{ active: selectedBackgroundTab==='colors' }" @click="selectedBackgroundTab='colors'">Colores</button></div>
          <div v-if="selectedBackgroundTab==='themes'" class="theme-grid"><button v-for="preset in themePresets" :key="preset.id" class="theme-card" :class="{ selected: invitation.styles.backgroundTheme===preset.id }" @click="applyThemePreset(preset)"><span class="theme-preview" :style="{ background: preset.background }"></span><strong>{{ preset.name }}</strong></button></div>
          <div v-else class="swatch-grid"><button v-for="color in backgroundSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation?.styles?.secondaryColor===color }" @click="invitation.styles.secondaryColor = color" /></div>
        </div>
        <div v-else-if="selectedSection === 'card'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="selectedSection === 'style'" class="settings-block">
          <h4>Fuente para nombres</h4>
          <div class="font-card-list"><button v-for="font in fontOptions" :key="`couple-${font}`" class="font-card" :class="{ selected: invitation.styles.coupleFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.coupleFontFamily = font">{{ font }}</button></div>
          <h4>Fuente general</h4>
          <div class="font-card-list"><button v-for="font in fontOptions" :key="`body-${font}`" class="font-card" :class="{ selected: invitation.styles.bodyFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.bodyFontFamily = font">{{ font }}</button></div>
          <h4>Color de nombres/títulos</h4>
          <div class="swatch-grid text-swatches"><button v-for="color in titleColorSwatches" :key="`title-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.titleColor===color }" @click="invitation.styles.titleColor = color" /></div>
          <h4>Color de texto general</h4>
          <div class="swatch-grid text-swatches"><button v-for="color in bodyColorSwatches" :key="`body-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.bodyTextColor===color }" @click="invitation.styles.bodyTextColor = color; invitation.styles.textColor = color" /></div>
        </div>
        <div v-else class="block-list">
          <!-- This is the base for future drag-and-drop ordering in all templates. -->
          <article v-for="block in orderedBlocks" :key="block.id" class="block-card">
            <div class="extra-preview" :class="`extra-preview--${blockOptions.find((i)=>i.type===block.type)?.preview}`"></div>
            <div><h4>{{ blockOptions.find((i)=>i.type===block.type)?.label || block.type }}</h4><p>{{ blockOptions.find((i)=>i.type===block.type)?.description || '' }}</p><small v-if="block.price > 0">${{ block.price }}</small></div>
            <div class="toggle-wrap">
              <label><input type="checkbox" :checked="block.enabled" @change="toggleBlockAddon(block, $event.target.checked)" /> Activar</label>
              <template v-if="block.enabled">
                <button class="mini-btn" @click="builderStore.moveBlockUp(block.id)">↑</button>
                <button class="mini-btn" @click="builderStore.moveBlockDown(block.id)">↓</button>
              </template>
            </div>
          </article>

          <div v-if="mapBlock?.enabled" class="details-card">
            <h4>Configuración de mapa</h4>
            <div class="details-field"><label>Nombre del lugar</label><input v-model="mapBlock.settings.locationName" type="text" /></div>
            <div class="details-field"><label>Dirección</label><input v-model="mapBlock.settings.address" type="text" /></div>
            <div class="details-field"><label>URL normal de Google Maps</label><input v-model="mapBlock.settings.mapUrl" type="text" /></div>
            <div class="details-field"><label>URL de insertar mapa</label><input v-model="mapBlock.settings.embedUrl" type="text" /></div>
          </div>
        </div>
      </aside>

      <main class="canvas-panel"><div class="preview-canvas" :class="selectedPreviewDevice === 'mobile' ? 'preview-canvas--mobile' : 'preview-canvas--desktop'"><InvitationPreview :showTitle="false" :device="selectedPreviewDevice" /></div></main>
    </div>

    <EditorPreviewModal :is-open="isPreviewOpen" @close="isPreviewOpen = false" />
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
