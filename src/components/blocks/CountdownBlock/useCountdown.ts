import { computed, onMounted, onUnmounted, ref, unref, type MaybeRef } from 'vue';

/**
 * Reusable countdown composable.
 * Receives a target date string and exposes reactive day/hour/minute/second values.
 */
export function useCountdown(targetDate: MaybeRef<string>) {
  const now = ref(Date.now());
  let timer: ReturnType<typeof setInterval> | null = null;

  const target = computed(() => new Date(unref(targetDate)).getTime());
  const remainingMs = computed(() => target.value - now.value);
  const isExpired = computed(() => remainingMs.value <= 0 || Number.isNaN(remainingMs.value));

  const breakdown = computed(() => {
    if (isExpired.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const totalSeconds = Math.max(0, Math.floor(remainingMs.value / 1000));
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

  const days = computed(() => breakdown.value.days);
  const hours = computed(() => breakdown.value.hours);
  const minutes = computed(() => breakdown.value.minutes);
  const seconds = computed(() => breakdown.value.seconds);

  return { days, hours, minutes, seconds, isExpired };
}
