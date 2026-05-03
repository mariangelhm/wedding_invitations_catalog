<script setup>
import { ref } from 'vue';
import { useI18n } from '../../../core/i18n';
import InvitationPreview from './InvitationPreview.vue';

defineProps({ isOpen: { type: Boolean, default: false } });
const emit = defineEmits(['close']);
const { t } = useI18n();
const selectedView = ref('web');
</script>

<template>
  <div v-if="isOpen" class="editor-preview-overlay" @click.self="emit('close')">
    <div class="editor-preview-modal">
      <div class="editor-preview-header">
        <h3>{{ t('editor.preview') }}</h3>
        <button class="close-btn" @click="emit('close')">{{ t('editor.close') }}</button>
      </div>
      <div class="view-switch"><button :class="{ active: selectedView === 'web' }" @click="selectedView='web'">{{ t('editor.web') }}</button><button :class="{ active: selectedView === 'mobile' }" @click="selectedView='mobile'">{{ t('editor.mobile') }}</button></div>
      <div v-if="selectedView === 'web'" class="web-preview-canvas"><InvitationPreview /></div>
      <div v-else class="mobile-preview-wrap"><div class="modal-phone"><div class="modal-phone-notch"></div><div class="modal-phone-screen"><InvitationPreview /></div></div></div>
    </div>
  </div>
</template>
