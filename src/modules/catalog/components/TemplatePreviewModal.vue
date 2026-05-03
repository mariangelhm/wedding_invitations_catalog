<script setup>
import { ref, watch } from 'vue';
import { useI18n } from '../../../core/i18n';

const props = defineProps({ template: { type: Object, default: null }, isOpen: { type: Boolean, default: false }, initialView: { type: String, default: 'web' } });
const emit = defineEmits(['close', 'customize']);
const { t } = useI18n();
const activeView = ref(props.initialView);
watch(() => props.initialView, (v) => { activeView.value = v || 'web'; });
</script>

<template>
  <div v-if="isOpen" class="preview-modal-overlay" @click.self="emit('close')">
    <div class="preview-modal">
      <button class="modal-close" @click="emit('close')">{{ t('previewModal.close') }}</button>
      <div class="view-switch">
        <button :class="{ active: activeView === 'web' }" @click="activeView = 'web'">{{ t('previewModal.web') }}</button>
        <button :class="{ active: activeView === 'mobile' }" @click="activeView = 'mobile'">{{ t('previewModal.mobile') }}</button>
      </div>

      <div v-if="template" class="modal-preview-area" :class="{ mobile: activeView === 'mobile' }">
        <div v-if="activeView === 'web'" class="preview-shell" :style="{ background: template.previewStyle.background }">
          <div class="mini-invitation large" :style="{ color: template.previewStyle.textColor, borderColor: template.previewStyle.accentColor }">
            <p class="mini-kicker">{{ template.name }}</p><h3>María &amp; Carlos</h3><div class="mini-divider" :style="{ background: template.previewStyle.accentColor }">❤</div><p class="mini-date">16 · Noviembre · 2026 · Rose Garden Hall</p>
          </div>
        </div>
        <div v-else class="phone-wrapper"><div class="phone-notch"></div><div class="phone-screen"><div class="mini-invitation" :style="{ color: template.previewStyle.textColor, borderColor: template.previewStyle.accentColor }"><p class="mini-kicker">{{ template.name }}</p><h3>María &amp; Carlos</h3><div class="mini-divider" :style="{ background: template.previewStyle.accentColor }">❤</div><p class="mini-date">16 · Noviembre · 2026</p></div></div></div>
      </div>

      <div class="modal-footer"><p>{{ t('previewModal.helper') }}</p><button class="btn btn-primary" @click="emit('customize')">{{ t('previewModal.customize') }}</button></div>
    </div>
  </div>
</template>
