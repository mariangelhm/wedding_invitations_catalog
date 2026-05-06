<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCountdown } from './useCountdown';
import './countdownBlock.css';

type CountdownBlockData = {
  props?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

const props = defineProps<{
  block?: CountdownBlockData;
  title?: string;
  targetDate?: string;
  date?: string;
  variant?: 'primary' | 'minimal' | 'editorial';
}>();

const data = computed(() => ({
  ...(props.block?.settings || {}),
  ...(props.block?.props || {}),
  ...(props.title !== undefined ? { title: props.title } : {}),
  ...(props.targetDate !== undefined ? { targetDate: props.targetDate } : {}),
  ...(props.date !== undefined ? { date: props.date } : {}),
  ...(props.variant !== undefined ? { variant: props.variant } : {}),
}));
const resolvedTitle = computed(() => String(data.value.title || 'Cuenta regresiva'));
const resolvedTargetDate = computed(() => String(data.value.targetDate || data.value.date || new Date(Date.now() + 86400000).toISOString()));
const resolvedVariant = computed(() => String(data.value.variant || 'primary'));
const { days, hours, minutes, seconds } = useCountdown(resolvedTargetDate);
const rootEl = ref<HTMLElement | null>(null); const isVisible = ref(false);
onMounted(() => { const observer = new IntersectionObserver((entries) => { const [entry] = entries; if (entry.isIntersecting) { isVisible.value = true; observer.disconnect(); } }, { threshold: 0.2 }); if (rootEl.value) observer.observe(rootEl.value); });
const two = (v:number) => String(v).padStart(2,'0');
</script>

<template>
  <section ref="rootEl" class="countdown-block" :class="[`countdown-block--${resolvedVariant}`, { 'is-visible': isVisible }]">
    <h3 class="countdown-block__title">{{ resolvedTitle }}</h3>
    <div class="countdown-block__grid">
      <div class="countdown-block__item"><span class="countdown-block__number">{{ days }}</span><span class="countdown-block__label">Días</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(hours) }}</span><span class="countdown-block__label">Horas</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(minutes) }}</span><span class="countdown-block__label">Minutos</span></div>
      <div class="countdown-block__item"><span class="countdown-block__number">{{ two(seconds) }}</span><span class="countdown-block__label">Segundos</span></div>
    </div>
  </section>
</template>
