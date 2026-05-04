import { defineStore } from 'pinia';

const defaultCustomizableOptions = { colors: true, fonts: true, photos: true, music: false, map: true, components: true };
// Typography values are stored as font labels; template maps labels to CSS stacks.
// titleColor styles couple names/headings, while bodyTextColor styles general body text.

const defaultBlocks = [
  { id: 'block-countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1, price: 3000, settings: {} },
  { id: 'block-story', type: 'story', enabled: true, order: 2, price: 0, settings: {} },
  { id: 'block-gallery', type: 'gallery', enabled: true, order: 3, price: 5000, settings: {} },
  { id: 'block-timeline', type: 'timeline', enabled: true, order: 4, price: 2000, settings: {} },
  { id: 'block-map', type: 'map', enabled: false, order: 5, price: 3000, settings: {} },
  { id: 'block-countdown-rsvp', type: 'countdown_rsvp', enabled: true, order: 6, price: 2500, settings: {} },
  { id: 'block-rsvp', type: 'rsvp', enabled: true, order: 7, price: 2000, settings: {} },
];
const romanticDefaultBlocks = [
  { id: 'countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1, price: 3000, settings: { targetDate: '2027-06-14T18:00:00', title: 'Faltan para nuestra boda' } },
  { id: 'story', type: 'story', enabled: true, order: 2, price: 0, settings: {} },
  { id: 'gallery', type: 'gallery', enabled: true, order: 3, price: 5000, settings: {} },
  { id: 'timeline', type: 'timeline', enabled: true, order: 4, price: 2000, settings: {} },
  { id: 'map', type: 'map', enabled: true, order: 5, price: 3000, settings: {} },
  { id: 'countdown-rsvp', type: 'countdown_rsvp', enabled: true, order: 6, price: 2000, settings: { targetDate: '2027-05-20T23:59:59', title: 'Tiempo para confirmar' } },
  { id: 'rsvp', type: 'rsvp', enabled: true, order: 7, price: 0, settings: {} },
];
const getDefaultBlocks = () => defaultBlocks.map((b) => ({ ...b }));
const createDefaultBlock = (blockType, invitation = null) => {
  const baseDate = invitation?.base?.date || '2027-06-14T18:00:00';
  const storyMessage = invitation?.base?.storyMessage || '';
  const gallery = invitation?.gallery || [];
  const timeline = invitation?.timeline || [];
  const mapSettings = invitation?.mapSettings || { locationName: '', address: '', mapUrl: '', embedUrl: '' };
  const blockCatalog = {
    countdown_wedding: { id: 'countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1, price: 3000, label: 'Cuenta regresiva boda', description: 'Cuenta regresiva al evento principal.', settings: { targetDate: baseDate, title: 'Faltan para nuestra boda', variant: 'editorial' } },
    story: { id: 'story', type: 'story', enabled: true, order: 2, price: 0, label: 'Historia', description: 'Cuenta su historia de amor.', settings: { title: 'Nuestra historia', message: storyMessage } },
    gallery: { id: 'gallery', type: 'gallery', enabled: true, order: 3, price: 5000, label: 'Galería', description: 'Muestra fotos destacadas.', settings: { title: 'Nuestros momentos', images: gallery } },
    timeline: { id: 'timeline', type: 'timeline', enabled: true, order: 4, price: 2000, label: 'Bitácora', description: 'Agenda del evento.', settings: { title: 'Cuándo y dónde', items: timeline } },
    map: { id: 'map', type: 'map', enabled: true, order: 5, price: 3000, label: 'Mapa', description: 'Ubicación del evento.', settings: { ...mapSettings } },
    countdown_rsvp: { id: 'countdown-rsvp', type: 'countdown_rsvp', enabled: true, order: 6, price: 2000, label: 'Cuenta regresiva confirmación', description: 'Tiempo restante para confirmar.', settings: { targetDate: '2027-05-20T23:59:59', title: 'Tiempo para confirmar', variant: 'editorial' } },
    rsvp: { id: 'rsvp', type: 'rsvp', enabled: true, order: 7, price: 0, label: 'RSVP', description: 'Confirmación de asistencia.', settings: { title: 'Confirma tu asistencia', buttonLabel: 'Enviar confirmación' } },
  };
  if (!blockCatalog[blockType]) return null;
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${blockType}-${Date.now()}`;
  return { ...blockCatalog[blockType], id: uniqueId };
};
const getRomanticDefaults = () => ({
  base: {
    names: 'María & Carlos',
    date: '2027-06-14T18:00:00',
    location: 'Rose Garden Hall',
    heroMessage: 'Nos encantaría que seas parte de este día tan especial.',
    storyMessage: 'Nuestra historia está llena de momentos simples, valientes y hermosos que queremos celebrar contigo.',
  },
  timeline: [
    { time: '17:00', title: 'Ceremonia', place: 'Jardín principal' },
    { time: '19:00', title: 'Cena', place: 'Salón principal' },
    { time: '21:00', title: 'Fiesta', place: 'Pista de baile' },
  ],
  gallery: [
    { src: '', alt: 'Foto principal' },
    { src: '', alt: 'Momento especial' },
    { src: '', alt: 'Nuestra historia' },
    { src: '', alt: 'Celebración' },
  ],
  mapSettings: {
    locationName: 'Rose Garden Hall',
    address: 'Santiago, Chile',
    mapUrl: 'https://maps.google.com',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1789740216627!2d-70.65865812458385!3d-33.44464339721427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a7b81bab67%3A0x7cf5cd1956dd49f7!2sTorre%20Entel!5e0!3m2!1ses-419!2scl!4v1777782339212!5m2!1ses-419!2scl',
  },
  blocks: romanticDefaultBlocks.map((b) => ({ ...b })),
});

export const useBuilderStore = defineStore('builderStore', {
  state: () => ({ basePrice: 20000, invitation: null }),
  getters: {
    enabledBlocksPrice: (state) => !state.invitation ? 0 : (state.invitation.blocks || []).filter((block) => block.enabled !== false).reduce((sum, block) => sum + (block.price || 0), 0),
    totalPrice() { return (this.invitation?.basePrice || this.basePrice) + this.enabledBlocksPrice; },
  },
  actions: {
    createDraftInvitation(template = null) {
      const createdAt = new Date(); const expiresAt = new Date(createdAt); expiresAt.setDate(expiresAt.getDate() + 30);
      const romanticDefaults = template?.id === 'romantic-01' ? getRomanticDefaults() : null;
      const invitation = {
        id: Date.now(), status: 'draft', templateId: template?.id || null, templateComponent: template?.templateComponent || null,
        templateName: template?.name || 'Invitación base', category: template?.category || 'general', level: template?.level || 'basic', basePrice: template?.basePrice || this.basePrice,
        base: romanticDefaults?.base || { names: '', date: '', location: '', heroMessage: '', storyMessage: '' },
        styles: { primaryColor: template?.previewStyle?.accentColor || '#303030', secondaryColor: template?.previewStyle?.background || '#F4F1EA', backgroundTheme: 'editorialClassic', coupleFontFamily: 'Playfair Display', bodyFontFamily: 'Arial', textColor: '#575757', titleColor: '#303030', bodyTextColor: '#575757', accentShape: '#E6E2D8', background: '#F4F1EA', backgroundGradient: '#F4F1EA', surfaceColor: '#FFFFFF', surfaceTextColor: '#303030', mutedTextColor: '#757575' },
        addons: [], blocks: romanticDefaults?.blocks || getDefaultBlocks(), customizableOptions: { ...defaultCustomizableOptions, ...(template?.customizableOptions || {}) },
        timeline: romanticDefaults?.timeline || [], gallery: romanticDefaults?.gallery || [], mapSettings: romanticDefaults?.mapSettings || { locationName: '', address: '', mapUrl: '', embedUrl: '' }, expiresAt, createdAt,
      };
      this.basePrice = invitation.basePrice; this.invitation = invitation; return invitation;
    },
    toggleAddon(type, label, price, checked) { if (!this.invitation) return; const exists = this.invitation.addons.some((a) => a.type === type); if (checked && !exists) this.invitation.addons.push(type === 'map' ? { type, label, price, enabled: true, settings: { ...this.invitation.mapSettings } } : { type, label, price, enabled: true }); if (!checked) this.invitation.addons = this.invitation.addons.filter((a) => a.type !== type); },
    ensureBlocks() {
      if (!this.invitation) return [];
      if (!Array.isArray(this.invitation.blocks) || this.invitation.blocks.length === 0) this.invitation.blocks = getDefaultBlocks();
      return this.invitation.blocks;
    },
    // Extras are reusable blocks shared by templates.
    // This ordered blocks API is the base for future drag & drop support.
    normalizeBlockOrders() {
      const blocks = this.ensureBlocks();
      blocks.sort((a, b) => (a.order || 0) - (b.order || 0));
      blocks.forEach((block, index) => { block.order = index + 1; });
    },
    toggleBlock(blockType) {
      const blocks = this.ensureBlocks();
      const b = blocks.find((it) => it.type === blockType);
      if (b) {
        // We do NOT delete blocks from invitation.blocks.
        // Keeping the block object preserves order/settings and allows instant re-enable in preview.
        b.enabled = !b.enabled;
        this.normalizeBlockOrders();
        return;
      }
      // If a block is missing (legacy data), recreate from defaults instead of silently failing.
      const recreated = createDefaultBlock(blockType, this.invitation);
      if (!recreated) return;
      const lastOrder = blocks.length ? Math.max(...blocks.map((item) => item.order || 0)) : 0;
      recreated.order = lastOrder + 1;
      recreated.enabled = true;
      blocks.push(recreated);
      this.normalizeBlockOrders();
    },
    moveBlockUp(blockId) { const items = this.invitation?.blocks; if (!items) return; items.sort((a,b)=>a.order-b.order); const i = items.findIndex((b)=>b.id===blockId); if (i<=0) return; [items[i-1].order, items[i].order] = [items[i].order, items[i-1].order]; },
    moveBlockDown(blockId) { const items = this.invitation?.blocks; if (!items) return; items.sort((a,b)=>a.order-b.order); const i = items.findIndex((b)=>b.id===blockId); if (i<0 || i===items.length-1) return; [items[i+1].order, items[i].order] = [items[i].order, items[i+1].order]; },
    reorderBlocks(draggedBlockId, targetBlockId) {
      const items = this.invitation?.blocks;
      if (!items?.length || !draggedBlockId || !targetBlockId || draggedBlockId === targetBlockId) return;
      const ordered = items.slice().sort((a, b) => a.order - b.order);
      const draggedIndex = ordered.findIndex((item) => item.id === draggedBlockId);
      const targetIndex = ordered.findIndex((item) => item.id === targetBlockId);
      if (draggedIndex < 0 || targetIndex < 0) return;
      const [dragged] = ordered.splice(draggedIndex, 1);
      ordered.splice(targetIndex, 0, dragged);
      ordered.forEach((item, index) => { item.order = index + 1; });
      this.invitation.blocks = ordered;
    },
  },
});
