import { computed, onMounted, onUnmounted, ref } from 'vue';

/**
 * Reusable countdown composable.
 * Receives a target date string and exposes reactive day/hour/minute/second values.
 */
export function useCountdown(targetDate: string) {
  const now = ref(Date.now());
  let timer: ReturnType<typeof setInterval> | null = null;

  const target = computed(() => new Date(targetDate).getTime());
  const remainingMs = computed(() => target.value - now.value);
  const isExpired = computed(() => remainingMs.value <= 0 || Number.isNaN(remainingMs.value));

  const breakdown = computed(() => {
    if (isExpired.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const totalSeconds = Math.floor(remainingMs.value / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  });

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now();
      if (isExpired.value && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { breakdown, isExpired };
}
