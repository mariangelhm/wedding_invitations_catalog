<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';
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
const selectedBackgroundTab = ref('colors');
const isPreviewOpen = ref(false);

const sectionCatalog = [
  { id: 'background', icon: '🎨', always: true },
  { id: 'card', icon: '▣', always: true },
  { id: 'details', icon: '⚙️', option: 'map' },
  { id: 'style', icon: '✒️', option: 'fonts' },
  { id: 'blocks', icon: '⧉', always: true },
];

const backgroundSwatches = ['#C7355C', '#F97316', '#2563EB', '#16A34A', '#7C3AED', '#111827', '#FBE8EE', '#FFFFFF'];
const textSwatches = ['#111827', '#374151', '#C7355C', '#FFFFFF', '#6B7280'];
const fontStacks = {
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  Poppins: "'Poppins', Arial, sans-serif",
  Georgia: 'Georgia, serif',
  'Patrick Hand': "'Patrick Hand', cursive",
  Arial: 'Arial, sans-serif',
};
const fontOptions = Object.keys(fontStacks);
const blockOptions = [
  { type: 'countdown_wedding', label: 'Cuenta regresiva boda', description: 'Cuenta regresiva al evento principal.', price: 3000 },
  { type: 'countdown_rsvp', label: 'Cuenta regresiva confirmación', description: 'Límite de confirmación RSVP.', price: 2500 },
  { type: 'gallery', label: 'Galería', description: 'Sección de fotos destacadas.', price: 5000 },
  { type: 'map', label: 'Mapa', description: 'Agrega un botón directo a Google Maps.', price: 3000 },
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
  if (['sobre', 'envelope'].includes(selectedSection.value)) selectedSection.value = 'background';
  if (!items.some((item) => item.id === selectedSection.value)) selectedSection.value = items[0]?.id || 'background';
}, { immediate: true });

const orderedBlocks = computed(() => (invitation.value?.blocks || []).slice().sort((a,b)=>a.order-b.order));
const isMapAddonEnabled = computed(() => orderedBlocks.value.some((b)=>b.type==='map' && b.enabled));
const toggleBlockAddon = (item) => {
  builderStore.toggleBlock(item.type);
  if (item.type === 'map') builderStore.toggleAddon('map', item.label, item.price, !invitation.value.addons.some((a)=>a.type==='map'));
};
const applyThemePreset = (preset) => {
  invitation.value.styles.backgroundTheme = preset.id;
  invitation.value.styles.primaryColor = preset.primaryColor;
  invitation.value.styles.secondaryColor = preset.secondaryColor;
  invitation.value.styles.accentShape = preset.accentShape;
  invitation.value.styles.backgroundGradient = preset.background;
  if (preset.textColor) invitation.value.styles.textColor = preset.textColor;
};

</script>

<template>
  <section class="builder-editor-page">
    <header class="builder-toolbar">
      <RouterLink to="/catalog" class="back-link">← {{ t('editor.backToCatalog') }}</RouterLink>
      <div class="toolbar-title">Visual Builder · {{ invitation?.templateName || 'Sin template' }}</div>
      <div class="device-switch" role="group" aria-label="Vista de dispositivo">
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'desktop' }" @click="selectedPreviewDevice = 'desktop'">🖥️ Desktop</button>
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'mobile' }" @click="selectedPreviewDevice = 'mobile'">📱 Mobile</button>
      </div>
    </header>

    <div class="builder-layout">
      <aside class="icon-menu">
        <button v-for="item in availableSections" :key="item.id" class="icon-menu-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">
          <span class="menu-icon">{{ item.icon }}</span><span class="menu-label">{{ t(`editor.sections.${item.id}`) }}</span>
        </button>
      </aside>

      <aside class="settings-panel">
        <div v-if="selectedSection === 'background'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: selectedBackgroundTab==='gallery' }" @click="selectedBackgroundTab='gallery'">Galería</button><button class="tab-btn" :class="{ active: selectedBackgroundTab==='colors' }" @click="selectedBackgroundTab='colors'">Colores</button></div>
          <div v-if="selectedBackgroundTab==='gallery'" class="theme-grid">
            <!-- Theme system: presets apply coordinated color + background decisions for reusable templates. -->
            <button v-for="preset in themePresets" :key="preset.id" class="theme-card" :class="{ selected: invitation.styles.backgroundTheme===preset.id }" @click="applyThemePreset(preset)">
              <span class="theme-preview" :style="{ background: preset.background }"></span>
              <strong>{{ preset.name }}</strong>
            </button>
          </div>
          <div v-else class="swatch-grid">
            <button v-for="color in backgroundSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation?.styles?.secondaryColor===color }" @click="invitation.styles.secondaryColor = color" />
          </div>
        </div>

                <div v-else-if="selectedSection === 'card'" class="settings-block"><BasicEditorForm /></div>

        <div v-else-if="selectedSection === 'details'" class="settings-block">
          <div v-if="isMapAddonEnabled" class="details-card">
            <div class="details-field">
              <label for="mapLocationName">Nombre del lugar</label>
              <input id="mapLocationName" v-model="invitation.mapSettings.locationName" type="text" />
              <small>Ejemplo: Rose Garden Hall</small>
            </div>
            <div class="details-field">
              <label for="mapAddress">Dirección</label>
              <input id="mapAddress" v-model="invitation.mapSettings.address" type="text" />
              <small>Incluye ciudad y referencias importantes.</small>
            </div>
            <div class="details-field">
              <label for="mapUrl">URL de Google Maps</label>
              <input id="mapUrl" v-model="invitation.mapSettings.mapUrl" type="text" placeholder="https://maps.google.com/..." />
              <small>Pega aquí el enlace de compartir de Google Maps.</small>
            </div>
            <div class="help-box">
              <h5>¿Cómo obtener el link?</h5>
              <p>Abre Google Maps, busca la ubicación, presiona Compartir y copia el enlace.</p>
            </div>
          </div>
          <div v-else class="details-empty-card">
            <p><strong>El mapa es un extra opcional.</strong></p>
            <p>Actívalo desde la sección Bloques para configurarlo.</p>
            <button class="btn" type="button" @click="selectedSection = 'blocks'">Ir a Bloques</button>
          </div>
        </div>

        <div v-else-if="selectedSection === 'style'" class="settings-block">
          <h4>Fuente para nombres</h4>
          <div class="font-card-list"><button v-for="font in fontOptions" :key="`couple-${font}`" class="font-card" :class="{ selected: invitation.styles.coupleFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.coupleFontFamily = font">{{ font }}</button></div>
          <h4>Fuente general</h4>
          <div class="font-card-list"><button v-for="font in fontOptions" :key="`body-${font}`" class="font-card" :class="{ selected: invitation.styles.bodyFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.bodyFontFamily = font">{{ font }}</button></div>
          <h4>Color de texto</h4>
          <div class="swatch-grid text-swatches"><button v-for="color in textSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.textColor===color }" @click="invitation.styles.textColor = color" /></div>
        </div>

        <div v-else class="block-list">
          <article v-for="block in orderedBlocks" :key="block.id" class="block-card">
            <div><h4>{{ blockOptions.find((i)=>i.type===block.type)?.label || block.type }}</h4><p>{{ blockOptions.find((i)=>i.type===block.type)?.description || '' }}</p><small v-if="block.price > 0">${{ block.price }}</small></div>
            <div class="toggle-wrap">
              <button class="mini-btn" @click="builderStore.moveBlockUp(block.id)">↑</button>
              <button class="mini-btn" @click="builderStore.moveBlockDown(block.id)">↓</button>
              <label><input type="checkbox" :checked="block.enabled" @change="toggleBlockAddon(block)" /> Activar</label>
            </div>
          </article>
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
