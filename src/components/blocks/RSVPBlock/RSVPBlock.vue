<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './rsvpBlock.css';

/**
 * Reusable RSVP block props.
 * - title: optional heading
 * - buttonLabel: optional call-to-action label
 */
const props = withDefaults(defineProps<{
  title?: string;
  buttonLabel?: string;
}>(), {
  title: '¿Nos acompañas?',
  buttonLabel: 'Confirmar asistencia',
});

const emit = defineEmits<{
  (e: 'confirm', payload: { fullName: string; response: 'confirmed' }): void;
}>();

// Local state handles temporary UI interaction and validation.
const fullName = ref('');
const isFormVisible = ref(false);
const isConfirmed = ref(false);
const errorMessage = ref('');

const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // One-time reveal animation for reusable block rendering contexts.
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  if (rootEl.value) observer.observe(rootEl.value);
});

const openForm = () => {
  isFormVisible.value = true;
  errorMessage.value = '';
};

// Validation + emit only. Backend submission will be wired in future integration.
const submitConfirmation = () => {
  if (!fullName.value.trim()) {
    errorMessage.value = 'Ingresa tu nombre completo';
    return;
  }

  emit('confirm', {
    fullName: fullName.value.trim(),
    response: 'confirmed',
  });

  isConfirmed.value = true;
  errorMessage.value = '';
};
</script>

<template>
  <section ref="rootEl" class="rsvp-block" :class="{ 'is-visible': isVisible }">
    <h3>{{ title }}</h3>

    <button v-if="!isFormVisible && !isConfirmed" type="button" class="rsvp-btn" @click="openForm">
      {{ buttonLabel }}
    </button>

    <div v-else-if="!isConfirmed" class="rsvp-form">
      <label for="rsvpName">Nombre completo</label>
      <input id="rsvpName" v-model="fullName" type="text" placeholder="Escribe tu nombre" />
      <p v-if="errorMessage" class="rsvp-error">{{ errorMessage }}</p>
      <button type="button" class="rsvp-btn" @click="submitConfirmation">Enviar confirmación</button>
    </div>

    <p v-else class="rsvp-success">Gracias por confirmar tu asistencia</p>
  </section>
</template>
