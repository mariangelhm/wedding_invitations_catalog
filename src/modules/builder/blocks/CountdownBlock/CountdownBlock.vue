<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  targetDate: { type: String, required: true },
  label: { type: String, default: 'Cuenta regresiva' },
});

const now = ref(Date.now());
let timer = null;

// Computes remaining milliseconds between now and target date.
const remainingMs = computed(() => new Date(props.targetDate).getTime() - now.value);
const isExpired = computed(() => remainingMs.value <= 0 || Number.isNaN(remainingMs.value));

// Split remaining time into d/h/m/s for UI cards.
const breakdown = computed(() => {
  if (isExpired.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(remainingMs.value / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
});

onMounted(() => {
  // Update every second to keep countdown synchronized.
  timer = setInterval(() => { now.value = Date.now(); }, 1000);
});

onUnmounted(() => {
  // Prevent memory leaks by clearing interval when block unmounts.
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section class="countdown-card">
    <h3>{{ label }}</h3>
    <p v-if="isExpired" class="expired">El tiempo ha finalizado</p>
    <div v-else class="countdown-grid">
      <article><strong>{{ breakdown.days }}</strong><span>Días</span></article>
      <article><strong>{{ breakdown.hours }}</strong><span>Horas</span></article>
      <article><strong>{{ breakdown.minutes }}</strong><span>Minutos</span></article>
      <article><strong>{{ breakdown.seconds }}</strong><span>Segundos</span></article>
    </div>
  </section>
</template>

<style scoped>
.countdown-card { border: 1px solid #E5E7EB; border-radius: 16px; background: #fff; padding: 16px; box-shadow: 0 8px 18px rgba(17,24,39,.08); }
.countdown-card h3 { color: #C7355C; margin-bottom: 10px; }
.countdown-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.countdown-grid article { border: 1px solid #F3D7E0; border-radius: 12px; padding: 10px; text-align: center; }
.countdown-grid strong { display: block; font-size: 1.2rem; color: #A82B4A; }
.countdown-grid span { color: #6B7280; font-size: 0.82rem; }
.expired { color: #A82B4A; font-weight: 600; }
@media (max-width: 640px){ .countdown-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
</style>
