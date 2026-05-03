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
const getDefaultBlocks = () => defaultBlocks.map((b) => ({ ...b }));

export const useBuilderStore = defineStore('builderStore', {
  state: () => ({ basePrice: 20000, invitation: null }),
  getters: { totalPrice: (state) => !state.invitation ? state.basePrice : state.basePrice + state.invitation.addons.reduce((sum, addon) => sum + (addon.price || 0), 0) },
  actions: {
    createDraftInvitation(template = null) {
      const createdAt = new Date(); const expiresAt = new Date(createdAt); expiresAt.setDate(expiresAt.getDate() + 30);
      const invitation = {
        id: Date.now(), status: 'draft', templateId: template?.id || null, templateComponent: template?.templateComponent || null,
        templateName: template?.name || 'Invitación base', category: template?.category || 'general', level: template?.level || 'basic', basePrice: template?.basePrice || this.basePrice,
        base: { names: '', date: '', location: '', heroMessage: '', storyMessage: '' },
        styles: { primaryColor: template?.previewStyle?.accentColor || '#C7355C', secondaryColor: template?.previewStyle?.background || '#FFF1F4', backgroundTheme: 'blush', coupleFontFamily: 'Playfair Display', bodyFontFamily: 'Arial', textColor: '#111827', titleColor: '#9F1F46', bodyTextColor: '#6B7280', accentShape: '#F7DCE5', backgroundGradient: 'linear-gradient(180deg, #fff7fa 0%, #ffffff 100%)', surfaceColor: '#FFFFFF', surfaceTextColor: '#1F2937' },
        addons: [], blocks: getDefaultBlocks(), customizableOptions: { ...defaultCustomizableOptions, ...(template?.customizableOptions || {}) },
        timeline: [], gallery: [], mapSettings: { locationName: '', address: '', mapUrl: '', embedUrl: '' }, expiresAt, createdAt,
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
    toggleBlock(blockType, enabled = null) {
      const blocks = this.ensureBlocks();
      const b = blocks.find((it) => it.type === blockType);
      if (!b) return;
      b.enabled = typeof enabled === 'boolean' ? enabled : !b.enabled;
    },
    moveBlockUp(blockId) { const items = this.invitation?.blocks; if (!items) return; items.sort((a,b)=>a.order-b.order); const i = items.findIndex((b)=>b.id===blockId); if (i<=0) return; [items[i-1].order, items[i].order] = [items[i].order, items[i-1].order]; },
    moveBlockDown(blockId) { const items = this.invitation?.blocks; if (!items) return; items.sort((a,b)=>a.order-b.order); const i = items.findIndex((b)=>b.id===blockId); if (i<0 || i===items.length-1) return; [items[i+1].order, items[i].order] = [items[i].order, items[i+1].order]; },
  },
});
