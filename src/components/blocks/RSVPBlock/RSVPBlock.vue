<script setup lang="ts">
import { onMounted, ref } from 'vue';
import './rsvpBlock.css';

const props = withDefaults(defineProps<{ title?: string; buttonLabel?: string; }>(), { title: '¿Nos acompañas?', buttonLabel: 'Confirmar asistencia' });
const emit = defineEmits<{ (e: 'confirm', payload: { fullName: string; attendance: 'yes' | 'no'; guestsCount: number; foodRestrictions: string }): void; }>();

const fullName = ref('');
const attendance = ref<'yes' | 'no'>('yes');
const guestsCount = ref(1);
const foodRestrictions = ref('');
const isFormVisible = ref(false); const isConfirmed = ref(false); const errorMessage = ref('');
const rootEl = ref<HTMLElement | null>(null); const isVisible = ref(false);

onMounted(() => { const observer = new IntersectionObserver((entries) => { const [entry] = entries; if (entry.isIntersecting) { isVisible.value = true; observer.disconnect(); } }, { threshold: 0.2 }); if (rootEl.value) observer.observe(rootEl.value); });
const submitConfirmation = () => { if (!fullName.value.trim()) { errorMessage.value = 'Ingresa tu nombre completo'; return; } emit('confirm', { fullName: fullName.value.trim(), attendance: attendance.value, guestsCount: Number(guestsCount.value) || 0, foodRestrictions: foodRestrictions.value.trim() }); isConfirmed.value = true; errorMessage.value = ''; };
</script>

<template>
  <section ref="rootEl" class="rsvp-block" :class="{ 'is-visible': isVisible }">
    <h3>{{ title }}</h3>
    <button v-if="!isFormVisible && !isConfirmed" type="button" class="rsvp-btn" @click="isFormVisible = true">{{ buttonLabel }}</button>
    <form v-else-if="!isConfirmed" class="rsvp-form" @submit.prevent="submitConfirmation">
      <label for="rsvpName">Nombre y apellido</label>
      <input id="rsvpName" v-model="fullName" type="text" placeholder="Escribe tu nombre" class="rsvp-input" />
      <label for="rsvpAttend">¿Asistirás?</label>
      <select id="rsvpAttend" v-model="attendance" class="rsvp-input"><option value="yes">Sí</option><option value="no">No</option></select>
      <label for="rsvpGuests">Número de acompañantes</label>
      <input id="rsvpGuests" v-model="guestsCount" type="number" min="0" max="8" class="rsvp-input" />
      <label for="rsvpDietary">Restricciones alimenticias</label>
      <input id="rsvpDietary" v-model="foodRestrictions" type="text" placeholder="Opcional" class="rsvp-input" />
      <p v-if="errorMessage" class="rsvp-error">{{ errorMessage }}</p>
      <button type="submit" class="rsvp-btn">Enviar confirmación</button>
    </form>
    <p v-else class="rsvp-success">Gracias por confirmar tu asistencia</p>
  </section>
</template>
