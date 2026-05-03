// Autosave composable for builder invitation drafts.
// Watches invitation changes and saves with debounce to avoid excessive network calls.
import { watch } from 'vue';

import { useBuilderStore } from '../../../store/builder.store';
import { saveInvitation } from '../services/invitations.service';

export const useAutosave = () => {
  const builderStore = useBuilderStore();

  // Debounce timer holder.
  // We clear and restart this timer on every change so only the latest change gets saved.
  let debounceTimer = null;

  // Autosave is useful to reduce data-loss risk while users edit long forms.
  // Deep watch is required because invitation contains nested objects (base, styles, addons).
  watch(
    () => builderStore.invitation,
    (invitation) => {
      if (!invitation) return;

      // Debounce explanation:
      // Wait 500ms after the last change before saving.
      // If user types continuously, previous timer is canceled and restarted.
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        saveInvitation(invitation);
      }, 500);
    },
    { deep: true },
  );
};
