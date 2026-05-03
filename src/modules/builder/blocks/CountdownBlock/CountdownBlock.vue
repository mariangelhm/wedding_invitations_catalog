<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  targetDate: { type: String, required: true },
  label: { type: String, default: '' },
});

const now = ref(Date.now());
let timer = null;

// Calculate remaining milliseconds from current time to target date.
const remainingMs = computed(() => new Date(props.targetDate).getTime() - now.value);
const isExpired = computed(() => remainingMs.value <= 0 || Number.isNaN(remainingMs.value));

const breakdown = computed(() => {
  if (isExpired.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(remainingMs.value / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
});

const stopTimer = () => {
  // Clear interval to avoid memory leaks and unnecessary updates after expiration.
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

watch(isExpired, (expired) => {
  if (expired) stopTimer();
});

onUnmounted(() => stopTimer());
</script>

<template>
  <section class="countdown-card">
    <h3 v-if="label">{{ label }}</h3>

    <p v-if="isExpired" class="expired">El evento ha comenzado</p>

    <div v-else class="countdown-grid">
      <article class="time-box"><strong>{{ breakdown.days }}</strong><span>días</span></article>
      <article class="time-box"><strong>{{ breakdown.hours }}</strong><span>horas</span></article>
      <article class="time-box"><strong>{{ breakdown.minutes }}</strong><span>min</span></article>
      <article class="time-box"><strong>{{ breakdown.seconds }}</strong><span>seg</span></article>
    </div>
  </section>
</template>

<style scoped>
.countdown-card {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-primary-light);
  padding: 16px;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
}
.countdown-card h3 { color: var(--color-primary); margin-bottom: 10px; }
.countdown-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.time-box { background: #fff; border-radius: 12px; padding: 10px; text-align: center; }
.time-box strong { display: block; font-size: 1.2rem; color: var(--color-primary-dark); font-weight: 700; }
.time-box span { color: #6B7280; font-size: 0.82rem; }
.expired { color: var(--color-primary-dark); font-weight: 600; }
@media (max-width: 640px) { .countdown-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
