<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCountdown } from './useCountdown';
import './countdownBlock.css';

const props = withDefaults(defineProps<{ targetDate: string; title?: string; variant?: 'primary' | 'minimal' | 'editorial'; }>(), { title: '', variant: 'primary' });
const { days, hours, minutes, seconds } = useCountdown(props.targetDate);
const rootEl = ref<HTMLElement | null>(null); const isVisible = ref(false);
onMounted(() => { const observer = new IntersectionObserver((entries) => { const [entry] = entries; if (entry.isIntersecting) { isVisible.value = true; observer.disconnect(); } }, { threshold: 0.2 }); if (rootEl.value) observer.observe(rootEl.value); });
const two = (v:number) => String(v).padStart(2,'0');
</script>

<template>
  <section ref="rootEl" class="countdown-block" :class="[`countdown-block--${variant}`, { 'is-visible': isVisible }]">
    <h3 v-if="title" class="countdown-block__title">{{ title }}</h3>
    <div class="countdown-block__grid">
      <div class="countdown-block__item"><span class="countdown-block__number">{{ days }}</span><span class="countdown-block__label">Días</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(hours) }}</span><span class="countdown-block__label">Horas</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(minutes) }}</span><span class="countdown-block__label">Minutos</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(seconds) }}</span><span class="countdown-block__label">Segundos</span></div>
    </div>
  </section>
</template>
