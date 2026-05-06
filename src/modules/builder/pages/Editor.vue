<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
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
const router = useRouter();
const builderStore = useBuilderStore();
const { t } = useI18n();
const selectedSection = ref('background');
const selectedPreviewDevice = ref('desktop');
const backgroundTab = ref('themes');
const selectedTypographyTab = ref('names');
const isPreviewOpen = ref(false);
const isCheckoutModalOpen = ref(false);
const draggingBlockId = ref(null);
const dropTargetBlockId = ref(null);

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

const backgroundSolids = [
  '#FFFFFF', '#FDFDFD', '#F7F7F5', '#F4F1EA', '#EFEBE9',
  '#FAF3F0', '#FDECEF', '#F8E1E7', '#F2D7DD', '#E8E3DB',
  '#D8C7B0', '#F2EFE9', '#EAF1ED', '#DDE7E1', '#EAF2F8',
  '#DCE8F2', '#F4EDE4', '#FFF7ED', '#F5E6D3', '#111827',
  '#1A1A1A', '#2F2E2E', '#354F52', '#2C3E50', '#3A332E',
];
const backgroundOptions = [
  ...backgroundSolids.map((value) => ({ type: 'solid', label: value, value })),
  { type: 'gradient', label: 'Marfil suave', value: 'linear-gradient(180deg, #FFFFFF 0%, #F4F1EA 100%)' },
  { type: 'gradient', label: 'Rosa editorial', value: 'linear-gradient(135deg, #FAF3F0 0%, #FFFFFF 55%, #F8E1E7 100%)' },
  { type: 'gradient', label: 'Arena cálida', value: 'linear-gradient(135deg, #F6F1EA 0%, #E8E3DB 100%)' },
  { type: 'gradient', label: 'Salvia suave', value: 'linear-gradient(135deg, #F2EFE9 0%, #DDE7E1 100%)' },
  { type: 'gradient', label: 'Noche elegante', value: 'linear-gradient(135deg, #111827 0%, #2F2E2E 100%)' },
  { type: 'texture', label: 'Papel editorial', value: 'radial-gradient(circle at 20% 20%, rgba(166,124,82,.10), transparent 30%), linear-gradient(180deg, #F7F7F5, #EFEBE9)' },
  { type: 'texture', label: 'Formas suaves', value: 'radial-gradient(circle at 12% 18%, rgba(181,131,141,.22), transparent 22%), radial-gradient(circle at 86% 12%, rgba(166,124,82,.14), transparent 24%), linear-gradient(180deg, #FFFFFF, #F4F1EA)' },
  { type: 'texture', label: 'Lino claro', value: 'repeating-linear-gradient(45deg, rgba(166,124,82,.05) 0 1px, transparent 1px 7px), linear-gradient(180deg, #F7F7F5, #FFFFFF)' },
  { type: 'texture', label: 'Dusty Rose', value: 'radial-gradient(circle at 18% 12%, rgba(194,91,108,.16), transparent 24%), linear-gradient(180deg, #FAF3F0, #FFFFFF)' },
];
const letterColorSwatches = [
  '#000000', '#111827', '#1A1A1A', '#2F2E2E', '#3A332E',
  '#4A3F35', '#57534E', '#6B4242', '#7A2E45', '#9F1239',
  '#A61E4D', '#BE3455', '#C25B6C', '#A67C52', '#B5838D',
  '#C5A059', '#D4A373', '#354F52', '#2C3E50', '#1F4E5F',
  '#84A59D', '#5B6C5D', '#6D5D6E', '#8A7A68', '#FFFFFF',
  '#F7F7F5', '#EFEBE9', '#F8E1E7', '#E8E3DB', '#DDE7E1',
];
const titleColorSwatches = letterColorSwatches;
const bodyColorSwatches = letterColorSwatches;
const fontStacks = {
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  'Libre Baskerville': "'Libre Baskerville', Georgia, serif",
  Merriweather: "'Merriweather', Georgia, serif",
  Lora: "'Lora', Georgia, serif",
  Poppins: "'Poppins', Arial, sans-serif",
  Montserrat: "'Montserrat', Arial, sans-serif",
  Raleway: "'Raleway', Arial, sans-serif",
  Nunito: "'Nunito', Arial, sans-serif",
  Georgia: 'Georgia, serif',
  'Patrick Hand': "'Patrick Hand', cursive",
  'Dancing Script': "'Dancing Script', cursive",
  'Great Vibes': "'Great Vibes', cursive",
  Arial: 'Arial, sans-serif',
};
const fontOptions = Object.keys(fontStacks);

const selectedTemplate = computed(() => templates.find((item) => item.id === route.query.templateId) || null);
watch(selectedTemplate, (template) => {
  if (!builderStore.invitation || builderStore.invitation.templateId !== template?.id) builderStore.createDraftInvitation(template);
}, { immediate: true });

const invitation = computed(() => builderStore.invitation);
const orderedBlocks = computed(() => (invitation.value?.blocks || []).slice().sort((a, b) => a.order - b.order));
const selectedExtras = computed(() => orderedBlocks.value.filter((block) => block.enabled && !block.included && (block.price || 0) > 0));

const formatPrice = (value = 0) => `$${Number(value || 0).toLocaleString('es-CL')}`;
const goToCheckout = () => {
  if (router.getRoutes().some((item) => item.path === '/checkout')) {
    router.push('/checkout');
    return;
  }
  console.log('go to checkout');
};

const toggleBlockAddon = (item, event) => {
  builderStore.toggleBlock(item.id, event?.target?.checked);
};
const updateMapBlockProp = (key, value) => { if (mapBlock.value) builderStore.updateBlockProps(mapBlock.value.id, { [key]: value }); };
const onDragStart = (block) => { if (!block.enabled) return; draggingBlockId.value = block.id; };
const onDropOver = (block) => { if (!block.enabled || !draggingBlockId.value || draggingBlockId.value === block.id) return; dropTargetBlockId.value = block.id; };
const onDropBlock = (targetBlock) => {
  if (!draggingBlockId.value || !targetBlock?.id || draggingBlockId.value === targetBlock.id) return;
  builderStore.reorderBlocks(draggingBlockId.value, targetBlock.id);
  draggingBlockId.value = null;
  dropTargetBlockId.value = null;
};
const onDragEnd = () => { draggingBlockId.value = null; dropTargetBlockId.value = null; };

const applyThemePreset = (preset) => {
  builderStore.applyTheme(preset.id);
};
</script>

<template>
  <section class="builder-editor-page">
    <header class="builder-toolbar">
      <RouterLink to="/catalog" class="back-link">← {{ t('editor.backToCatalog') }}</RouterLink>
      <div class="toolbar-title">Visual Builder · {{ invitation?.templateName || 'Sin template' }}</div>
      <div class="device-switch">
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'desktop' }" type="button" @click="selectedPreviewDevice = 'desktop'">🖥️ Web</button>
        <button class="device-btn" :class="{ active: selectedPreviewDevice === 'mobile' }" type="button" @click="selectedPreviewDevice = 'mobile'">📱 Mobile</button>
      </div>
    </header>

    <div class="builder-layout">
      <aside class="icon-menu editor-sidebar">
        <div class="icon-menu-top editor-sidebar__menu">
          <button v-for="item in sectionCatalog" :key="item.id" class="icon-menu-item" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">
            <span class="menu-icon">{{ item.icon }}</span><span class="menu-label">{{ item.label }}</span>
          </button>
        </div>
        <div class="icon-menu-bottom editor-sidebar__summary">
          <div class="compact-total">
            <span>Total</span>
            <strong>{{ formatPrice(builderStore.totalPrice).replace('.000', 'k') }}</strong>
          </div>
          <button class="done-btn" type="button" @click="isCheckoutModalOpen = true">Listo</button>
        </div>
      </aside>

      <aside class="settings-panel">
        <div class="mobile-section-tabs" role="tablist" aria-label="Secciones del editor">
          <button v-for="item in sectionCatalog" :key="`mobile-${item.id}`" class="mobile-tab-btn" :class="{ active: selectedSection === item.id }" @click="selectedSection = item.id">
            {{ item.label }}
          </button>
        </div>
        <div v-if="selectedSection === 'background'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: backgroundTab==='themes' }" @click="backgroundTab='themes'">Temas</button><button class="tab-btn" :class="{ active: backgroundTab==='colors' }" @click="backgroundTab='colors'">Colores</button></div>
          <div v-if="backgroundTab==='themes'" class="theme-grid">
            <button v-for="preset in themePresets" :key="preset.id" class="theme-card" :class="{ selected: invitation.styles.themeId===preset.id || invitation.styles.backgroundTheme===preset.id }" @click="applyThemePreset(preset)">
              <div class="theme-main">
                <strong>{{ preset.name }}</strong>
                <small>{{ preset.description }}</small>
              </div>
              <div class="theme-palette">
                <span v-for="(tone, idx) in preset.palette" :key="`${preset.id}-${idx}`" :style="{ background: tone }"></span>
              </div>
              <span v-if="invitation.styles.themeId===preset.id || invitation.styles.backgroundTheme===preset.id" class="theme-check">✓</span>
            </button>
          </div>
          <div v-else class="background-option-grid">
            <button
              v-for="option in backgroundOptions"
              :key="option.value"
              class="background-option-card"
              :class="{ selected: invitation?.styles?.colors?.backgroundColor===option.value || invitation?.styles?.secondaryColor===option.value }"
              type="button"
              @click="builderStore.updateStyleColor('backgroundColor', option.value)"
            >
              <span class="background-option-preview" :style="{ background: option.value }"></span>
              <span>{{ option.label }}</span>
              <small>{{ option.type === 'solid' ? 'Color sólido' : 'Textura suave' }}</small>
            </button>
          </div>
        </div>
        <div v-else-if="selectedSection === 'card'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="selectedSection === 'style'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: selectedTypographyTab==='names' }" @click="selectedTypographyTab='names'">Nombres</button><button class="tab-btn" :class="{ active: selectedTypographyTab==='headings' }" @click="selectedTypographyTab='headings'">Títulos</button><button class="tab-btn" :class="{ active: selectedTypographyTab==='general' }" @click="selectedTypographyTab='general'">General</button></div>
          <template v-if="selectedTypographyTab==='names'">
            <h4>Fuente para nombres</h4>
            <div class="font-card-list"><button v-for="font in fontOptions" :key="`couple-${font}`" class="font-card" :class="{ selected: invitation.styles.fonts?.namesFont===font || invitation.styles.coupleFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="builderStore.updateStyleFont('namesFont', font)">{{ font }}</button></div>
            <h4>Color de nombres</h4>
            <div class="swatch-grid text-swatches"><button v-for="color in letterColorSwatches" :key="`names-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.colors?.namesColor===color || invitation.styles.namesColor===color }" @click="builderStore.updateStyleColor('namesColor', color)" /></div>
          </template>
          <template v-else-if="selectedTypographyTab==='headings'">
            <h4>Fuente para títulos</h4>
            <div class="font-card-list"><button v-for="font in fontOptions" :key="`heading-${font}`" class="font-card" :class="{ selected: invitation.styles.fonts?.headingsFont===font }" :style="{ fontFamily: fontStacks[font] }" @click="builderStore.updateStyleFont('headingsFont', font)">{{ font }}</button></div>
            <h4>Color de títulos</h4>
            <div class="swatch-grid text-swatches"><button v-for="color in titleColorSwatches" :key="`title-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.colors?.titleColor===color || invitation.styles.titleColor===color }" @click="builderStore.updateStyleColor('titleColor', color)" /></div>
          </template>
          <template v-else>
            <h4>Fuente general</h4>
            <div class="font-card-list"><button v-for="font in fontOptions" :key="`body-${font}`" class="font-card" :class="{ selected: invitation.styles.fonts?.bodyFont===font || invitation.styles.bodyFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="builderStore.updateStyleFont('bodyFont', font)">{{ font }}</button></div>
            <h4>Color de texto general</h4>
            <div class="swatch-grid text-swatches"><button v-for="color in bodyColorSwatches" :key="`body-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.colors?.bodyColor===color || invitation.styles.bodyTextColor===color }" @click="builderStore.updateStyleColor('bodyColor', color)" /></div>
          </template>
        </div>
        <div v-else class="block-list">
          <!-- This is the base for future drag-and-drop ordering in all templates. -->
          <article v-for="block in orderedBlocks" :key="block.id" class="block-card" :class="{ 'is-active': block.enabled, 'is-inactive': !block.enabled, 'is-dragging': draggingBlockId === block.id, 'is-drop-target': dropTargetBlockId === block.id }" :draggable="block.enabled" @dragstart="onDragStart(block)" @dragover.prevent="onDropOver(block)" @drop="onDropBlock(block)" @dragend="onDragEnd">
            <div class="block-head">
              <div class="extra-preview" :class="`extra-preview--${blockOptions.find((i)=>i.type===block.type)?.preview}`"></div>
              <div class="block-head-meta">
                <h4>{{ block.label || blockOptions.find((i)=>i.type===block.type)?.label || block.type }}</h4>
                <small v-if="block.included" class="price-badge price-badge--free">Incluido</small>
                <small v-else-if="block.price > 0" class="price-badge">${{ block.price }}</small>
                <small v-else class="price-badge price-badge--free">Sin costo</small>
              </div>
            </div>
            <p class="block-description">{{ block.description || blockOptions.find((i)=>i.type===block.type)?.description || '' }}</p>
            <div class="block-footer">
              <label class="switch" :aria-label="`Activar ${block.type}`">
                <input type="checkbox" :checked="block.enabled" @change="toggleBlockAddon(block, $event)" />
                <span class="switch-slider"></span>
              </label>
              <span class="status-label">{{ block.enabled ? 'Activo' : 'Inactivo' }}</span>
              <div v-if="block.enabled" class="move-actions">
                <button class="mini-btn" @click="builderStore.updateBlockOrder(block.id, 'up')">↑</button>
                <button class="mini-btn" @click="builderStore.updateBlockOrder(block.id, 'down')">↓</button>
              </div>
            </div>
          </article>
        </div>
      </aside>

      <main class="canvas-panel"><div class="preview-container"><div class="preview-inner"><div class="preview-canvas" :class="selectedPreviewDevice === 'mobile' ? 'preview-canvas--mobile' : 'preview-canvas--desktop'"><InvitationPreview :showTitle="false" :device="selectedPreviewDevice" /></div></div></div></main>
    </div>

    <EditorPreviewModal :is-open="isPreviewOpen" @close="isPreviewOpen = false" />
    
    <div v-if="isCheckoutModalOpen" class="checkout-modal-overlay" @click.self="isCheckoutModalOpen = false">
      <article class="checkout-modal-card" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title">
        <h3 id="checkout-modal-title">Resumen de tu invitación</h3>
        <ul class="checkout-lines">
          <li><span>Template</span><strong>{{ invitation?.templateName || 'Sin template' }}</strong></li>
          <li><span>Precio base</span><strong>{{ formatPrice(invitation?.basePrice || builderStore.basePrice) }}</strong></li>
          <li v-if="invitation?.duration"><span>Duración</span><strong>{{ invitation.duration }}</strong></li>
          <li class="line-title">Extras seleccionados</li>
          <li v-for="item in selectedExtras" :key="item.id"><span>{{ item.type }}</span><strong>{{ formatPrice(item.price) }}</strong></li>
          <li v-if="selectedExtras.length === 0"><span>Sin extras con costo</span><strong>{{ formatPrice(0) }}</strong></li>
          <li class="line-total"><span>Total</span><strong>{{ formatPrice(builderStore.totalPrice) }}</strong></li>
        </ul>
        <div class="checkout-actions">
          <button type="button" class="checkout-cancel" @click="isCheckoutModalOpen = false">Cancelar</button>
          <button type="button" class="checkout-primary" @click="goToCheckout">Ir a pagar</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped src="../styles/editor.css"></style>
