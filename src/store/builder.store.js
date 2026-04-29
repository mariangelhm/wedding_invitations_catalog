// Pinia store responsible for creating and holding a working invitation draft.
import { defineStore } from 'pinia';

export const useBuilderStore = defineStore('builderStore', {
  // State keeps the currently active invitation model in memory.
  state: () => ({
    // basePrice: starting price for an invitation before optional addons.
    basePrice: 20000,

    // invitation: full invitation draft object.
    // Starts as null because no draft exists until createDraftInvitation() is called.
    invitation: null,
  }),

  getters: {
    // totalPrice is reactive: it recalculates whenever basePrice or addons change.
    totalPrice: (state) => {
      // If invitation is not initialized yet, total is just the base price.
      if (!state.invitation) return state.basePrice;

      // Sum all selected addon prices from invitation.addons.
      const addonsTotal = state.invitation.addons.reduce((sum, addon) => sum + addon.price, 0);

      // Final total = base invitation price + selected addons.
      return state.basePrice + addonsTotal;
    },
  },

  actions: {
    // Creates a new invitation draft with sensible defaults for the builder module.
    createDraftInvitation() {
      // Use current timestamp as a simple unique identifier for local draft creation.
      const id = Date.now();

      // Build a fresh invitation model.
      const invitation = {
        // id: unique identifier for this draft invitation record.
        id,

        // status: lifecycle state of the invitation. "draft" means editable and not finalized.
        status: 'draft',

        // base: core invitation content entered by users.
        base: {
          // names: names of the people represented on the invitation.
          names: '',

          // date: event date string (format to be defined later by product needs).
          date: '',

          // location: event venue/location text shown on the invitation.
          location: '',

          // message: personalized invitation message/body text.
          message: '',
        },

        // styles: visual customization properties for invitation rendering.
        styles: {
          // primaryColor: key accent/text color used in templates.
          primaryColor: '#000000',

          // fontFamily: default font family used to render invitation text.
          fontFamily: 'Arial',
        },

        // addons: optional enhancements/features selected for the invitation (none by default).
        addons: [],

        // expiresAt: optional expiration date for the draft; null indicates no expiration set.
        expiresAt: null,

        // createdAt: timestamp capturing when this draft was first created.
        createdAt: new Date(),
      };

      // Persist the new draft in global state so all modules can access it.
      this.invitation = invitation;

      // Return the created invitation for immediate usage by callers.
      return invitation;
    },
  },
});
