<script setup>
import { ref } from 'vue';

const props = defineProps({
  buttonLabel: { type: String, default: 'Confirmar asistencia' },
});

const emit = defineEmits(['confirm']);
const fullName = ref('');
const isConfirmed = ref(false);
const showForm = ref(false);
const errorMessage = ref('');

const openForm = () => {
  showForm.value = true;
  errorMessage.value = '';
};

// Future backend integration point:
// currently this block only validates and emits RSVP payload.
const handleConfirm = () => {
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
  <section class="rsvp-card">
    <button v-if="!showForm && !isConfirmed" class="rsvp-btn" type="button" @click="openForm">
      {{ buttonLabel }}
    </button>

    <div v-else-if="!isConfirmed" class="rsvp-form">
      <label for="rsvpFullName">Nombre completo</label>
      <input id="rsvpFullName" v-model="fullName" type="text" placeholder="Escribe tu nombre" />
      <p v-if="errorMessage" class="rsvp-error">{{ errorMessage }}</p>
      <button class="rsvp-btn" type="button" @click="handleConfirm">Confirmar asistencia</button>
    </div>

    <p v-else class="rsvp-success">Gracias por confirmar tu asistencia</p>
  </section>
</template>

<style scoped>
.rsvp-card { border: 1px solid #E5E7EB; border-radius: 16px; background: #fff; padding: 16px; box-shadow: 0 8px 18px rgba(17,24,39,.08); display: grid; gap: 10px; }
.rsvp-form { display: grid; gap: 8px; }
.rsvp-form label { color: #111827; font-weight: 600; }
.rsvp-form input { border: 1px solid #E5E7EB; border-radius: 10px; padding: 9px 10px; }
.rsvp-btn { border: none; border-radius: 999px; background: #C7355C; color: #fff; padding: 9px 14px; width: fit-content; cursor: pointer; }
.rsvp-error { color: #B91C1C; font-size: 0.9rem; }
.rsvp-success { color: #047857; font-weight: 600; }
@media (max-width: 640px) { .rsvp-btn { width: 100%; text-align: center; } }
</style>
