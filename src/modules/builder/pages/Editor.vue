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

const backgroundSwatches = ['#C7355C', '#F97316', '#2563EB', '#16A34A', '#7C3AED', '#111827', '#FBE8EE', '#FFFFFF'];
const titleColorSwatches = ['#111827', '#374151', '#4B5563', '#6B7280', '#C7355C', '#B76E79', '#9A6B4F', '#B88A44', '#D4AF37', '#FFFFFF', '#F8FAFC', '#1F2937'];
const bodyColorSwatches = ['#111827', '#374151', '#4B5563', '#6B7280', '#C7355C', '#B76E79', '#9A6B4F', '#B88A44', '#D4AF37', '#FFFFFF', '#F8FAFC', '#1F2937'];
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
const mapBlock = computed(() => orderedBlocks.value.find((block) => block.type === 'map'));
const selectedExtras = computed(() => orderedBlocks.value.filter((block) => block.enabled && (block.price || 0) > 0));

const formatPrice = (value = 0) => `$${Number(value || 0).toLocaleString('es-CL')}`;
const goToCheckout = () => {
  if (router.getRoutes().some((item) => item.path === '/checkout')) {
    router.push('/checkout');
    return;
  }
  console.log('go to checkout');
};

const toggleBlockAddon = (item) => {
  // Toggle enabled flag only. Blocks are never deleted so they can be re-enabled immediately.
  builderStore.toggleBlock(item.type);
};
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
  invitation.value.styles.backgroundTheme = preset.id;
  invitation.value.styles.primaryColor = preset.primaryColor;
  invitation.value.styles.secondaryColor = preset.secondaryColor;
  invitation.value.styles.background = preset.background;
  invitation.value.styles.titleColor = preset.titleColor;
  invitation.value.styles.bodyTextColor = preset.bodyTextColor;
  invitation.value.styles.accentShape = preset.accentShape;
  invitation.value.styles.backgroundGradient = preset.background;
  invitation.value.styles.surfaceColor = preset.surfaceColor;
  invitation.value.styles.surfaceTextColor = preset.surfaceTextColor;
  invitation.value.styles.mutedTextColor = preset.mutedTextColor;
  // Keep legacy key synced for components still reading textColor.
  invitation.value.styles.textColor = preset.bodyTextColor;
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
            <button v-for="preset in themePresets" :key="preset.id" class="theme-card" :class="{ selected: invitation.styles.backgroundTheme===preset.id }" @click="applyThemePreset(preset)">
              <div class="theme-main">
                <strong>{{ preset.name }}</strong>
                <small>{{ preset.description }}</small>
              </div>
              <div class="theme-palette">
                <span v-for="(tone, idx) in preset.palette" :key="`${preset.id}-${idx}`" :style="{ background: tone }"></span>
              </div>
              <span v-if="invitation.styles.backgroundTheme===preset.id" class="theme-check">✓</span>
            </button>
          </div>
          <div v-else class="swatch-grid"><button v-for="color in backgroundSwatches" :key="color" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation?.styles?.secondaryColor===color }" @click="invitation.styles.secondaryColor = color" /></div>
        </div>
        <div v-else-if="selectedSection === 'card'" class="settings-block"><BasicEditorForm /></div>
        <div v-else-if="selectedSection === 'style'" class="settings-block">
          <div class="tab-row"><button class="tab-btn" :class="{ active: selectedTypographyTab==='names' }" @click="selectedTypographyTab='names'">Nombres</button><button class="tab-btn" :class="{ active: selectedTypographyTab==='general' }" @click="selectedTypographyTab='general'">General</button></div>
          <template v-if="selectedTypographyTab==='names'">
            <h4>Fuente para nombres</h4>
            <div class="font-card-list"><button v-for="font in fontOptions" :key="`couple-${font}`" class="font-card" :class="{ selected: invitation.styles.coupleFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.coupleFontFamily = font">{{ font }}</button></div>
            <h4>Color de nombres/títulos</h4>
            <div class="swatch-grid text-swatches"><button v-for="color in titleColorSwatches" :key="`title-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.titleColor===color }" @click="invitation.styles.titleColor = color" /></div>
          </template>
          <template v-else>
            <h4>Fuente general</h4>
            <div class="font-card-list"><button v-for="font in fontOptions" :key="`body-${font}`" class="font-card" :class="{ selected: invitation.styles.bodyFontFamily===font }" :style="{ fontFamily: fontStacks[font] }" @click="invitation.styles.bodyFontFamily = font">{{ font }}</button></div>
            <h4>Color de texto general</h4>
            <div class="swatch-grid text-swatches"><button v-for="color in bodyColorSwatches" :key="`body-${color}`" class="color-swatch" :style="{ background: color }" :class="{ selected: invitation.styles.bodyTextColor===color }" @click="invitation.styles.bodyTextColor = color; invitation.styles.textColor = color" /></div>
          </template>
        </div>
        <div v-else class="block-list">
          <!-- This is the base for future drag-and-drop ordering in all templates. -->
          <article v-for="block in orderedBlocks" :key="block.id" class="block-card" :class="{ 'is-active': block.enabled, 'is-inactive': !block.enabled, 'is-dragging': draggingBlockId === block.id, 'is-drop-target': dropTargetBlockId === block.id }" :draggable="block.enabled" @dragstart="onDragStart(block)" @dragover.prevent="onDropOver(block)" @drop="onDropBlock(block)" @dragend="onDragEnd">
            <div class="block-head">
              <div class="extra-preview" :class="`extra-preview--${blockOptions.find((i)=>i.type===block.type)?.preview}`"></div>
              <div class="block-head-meta">
                <h4>{{ block.label || blockOptions.find((i)=>i.type===block.type)?.label || block.type }}</h4>
                <small v-if="block.price > 0" class="price-badge">${{ block.price }}</small>
                <small v-else class="price-badge price-badge--free">Incluido</small>
              </div>
            </div>
            <p class="block-description">{{ block.description || blockOptions.find((i)=>i.type===block.type)?.description || '' }}</p>
            <div class="block-footer">
              <label class="switch" :aria-label="`Activar ${block.type}`">
                <input type="checkbox" :checked="block.enabled" @change="toggleBlockAddon(block)" />
                <span class="switch-slider"></span>
              </label>
              <span class="status-label">{{ block.enabled ? 'Activo' : 'Inactivo' }}</span>
              <div v-if="block.enabled" class="move-actions">
                <button class="mini-btn" @click="builderStore.moveBlockUp(block.id)">↑</button>
                <button class="mini-btn" @click="builderStore.moveBlockDown(block.id)">↓</button>
              </div>
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

      <section class="checkout-summary-panel">
        <div class="compact-total">
          <span>Total</span>
          <strong>{{ formatPrice(builderStore.totalPrice) }}</strong>
        </div>
        <button class="done-btn" type="button" @click="isCheckoutModalOpen = true">Listo</button>
      </section>

      <main class="canvas-panel"><div class="preview-canvas" :class="selectedPreviewDevice === 'mobile' ? 'preview-canvas--mobile' : 'preview-canvas--desktop'"><InvitationPreview :showTitle="false" :device="selectedPreviewDevice" /></div></main>
    </div>

    <EditorPreviewModal :is-open="isPreviewOpen" @close="isPreviewOpen = false" />
    <div class="editor-mobile-summary">
      <div class="compact-total">
        <span>Total</span>
        <strong>{{ formatPrice(builderStore.totalPrice).replace('.000', 'k') }}</strong>
      </div>
      <button class="done-btn" type="button" @click="isCheckoutModalOpen = true">Listo</button>
    </div>
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
