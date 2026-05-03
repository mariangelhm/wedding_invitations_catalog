import { defineStore } from 'pinia';

const defaultCustomizableOptions = {
  colors: true,
  fonts: true,
  photos: true,
  music: false,
  map: true,
  components: true,
};

export const useBuilderStore = defineStore('builderStore', {
  state: () => ({ basePrice: 20000, invitation: null }),
  getters: {
    totalPrice: (state) => {
      if (!state.invitation) return state.basePrice;
      const addonsTotal = state.invitation.addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
      return state.basePrice + addonsTotal;
    },
  },
  actions: {
    createDraftInvitation(template = null) {
      const id = Date.now();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const invitation = {
        id,
        status: 'draft',
        templateId: template?.id || null,
        templateComponent: template?.templateComponent || null,
        templateName: template?.name || 'Invitación base',
        category: template?.category || 'general',
        level: template?.level || 'basic',
        basePrice: template?.basePrice || this.basePrice,
        base: { names: '', date: '', location: '', message: '' },
        styles: {
          primaryColor: template?.previewStyle?.accentColor || '#C7355C',
          secondaryColor: template?.previewStyle?.background || '#FFF1F4',
          backgroundColor: template?.previewStyle?.background || '#FFFFFF',
          textColor: template?.previewStyle?.textColor || '#111827',
          fontFamily: 'Arial',
        },
        addons: [],
        customizableOptions: { ...defaultCustomizableOptions, ...(template?.customizableOptions || {}) },
        timeline: [],
        gallery: [],
        mapSettings: {
          locationName: '',
          address: '',
          mapUrl: '',
        },
        expiresAt,
        createdAt,
      };

      this.basePrice = invitation.basePrice;
      this.invitation = invitation;
      return invitation;
    },

    toggleAddon(type, label, price, checked) {
      if (!this.invitation) return;
      const exists = this.invitation.addons.some((addon) => addon.type === type);
      if (checked && !exists) this.invitation.addons.push({ type, label, price });
      if (!checked) this.invitation.addons = this.invitation.addons.filter((addon) => addon.type !== type);
    },
  },
});
