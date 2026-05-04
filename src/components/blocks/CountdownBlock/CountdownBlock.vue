<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCountdown } from './useCountdown';
import './countdownBlock.css';

/**
 * CountdownBlock props.
 * - targetDate: ISO date string to count down to.
 * - title: optional heading.
 * - variant: visual style preset.
 */
const props = withDefaults(defineProps<{
  targetDate: string;
  title?: string;
  variant?: 'primary' | 'minimal' | 'editorial';
}>(), {
  title: '',
  variant: 'primary',
});

const { days, hours, minutes, seconds } = useCountdown(props.targetDate);
const rootEl = ref<HTMLElement | null>(null);
const isVisible = ref(false);

onMounted(() => {
  // Animate block once when it enters viewport.
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  if (rootEl.value) observer.observe(rootEl.value);
});
</script>

<template>
  <section ref="rootEl" class="countdown-block" :class="[`countdown-block--${variant}`, { 'is-visible': isVisible }]">
    <h3 v-if="title" class="countdown-title">{{ title }}</h3>

    <div class="countdown-grid">
      <article class="time-cell"><span class="time-value">{{ days }}</span><span class="time-label">Días</span></article>
      <article class="time-cell"><span class="time-value">{{ hours }}</span><span class="time-label">Horas</span></article>
      <article class="time-cell"><span class="time-value">{{ minutes }}</span><span class="time-label">Minutos</span></article>
      <article class="time-cell"><span class="time-value">{{ seconds }}</span><span class="time-label">Segundos</span></article>
    </div>
  </section>
</template>

<!--
Example usage:
<CountdownBlock
  targetDate="2027-06-14T00:00:00"
  title="Faltan para nuestra boda"
/>
-->
