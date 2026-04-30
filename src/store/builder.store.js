import { defineStore } from 'pinia';

export const useBuilderStore = defineStore('builderStore', {
  state: () => ({ basePrice: 20000, invitation: null }),
  getters: {
    totalPrice: (state) => {
      if (!state.invitation) return state.basePrice;
      const addonsTotal = state.invitation.addons.reduce((sum, addon) => sum + addon.price, 0);
      return state.basePrice + addonsTotal;
    },
  },
  actions: {
    // Creates draft invitation with optional template metadata from catalog flow.
    createDraftInvitation(template = null) {
      const id = Date.now();
      const createdAt = new Date();
      const expiresAt = new Date(createdAt);
      expiresAt.setDate(expiresAt.getDate() + 30);

      const invitation = {
        id,
        status: 'draft',
        templateId: template?.id || null,
        templateName: template?.name || 'Invitación base',
        level: template?.level || 'basic',
        basePrice: template?.basePrice || this.basePrice,
        base: { names: '', date: '', location: '', message: '' },
        styles: {
          primaryColor: template?.previewStyle?.accentColor || '#C7355C',
          fontFamily: 'Arial',
        },
        addons: [],
        customizableOptions: template?.customizableOptions || { colors: true, fonts: true, music: true, photos: true, map: true, countdown: true, rsvp: true },
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
