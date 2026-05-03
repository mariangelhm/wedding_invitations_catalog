<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import StoryBlock from '../../../../components/blocks/StoryBlock/StoryBlock.vue';
import TimelineBlock from '../../../../components/blocks/TimelineBlock/TimelineBlock.vue';
import './romanticMotionTemplate.css';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });

// Function refs must use :ref in template; this collects multiple section nodes safely.
const sectionRefs = [];
function setSectionRef(el) {
  if (el && !sectionRefs.includes(el)) {
    sectionRefs.push(el);
  }
}

let sectionObserver = null;

const base = computed(() => props.invitationData?.base || {});
const styles = computed(() => props.invitationData?.styles || {});
const timeline = computed(() => props.invitationData?.timeline || []);
// Gallery can rely on block-level fallback placeholders when custom images are missing.
const gallery = computed(() => props.invitationData?.gallery || [
  { src: '', alt: 'Foto principal' },
  { src: '', alt: 'Momento especial' },
  { src: '', alt: 'Nuestra historia' },
]);
const addons = computed(() => props.invitationData?.addons || []);

const getAddon = (type) => addons.value.find((addon) => addon.type === type && addon.enabled !== false);

const weddingCountdownAddon = computed(() => getAddon('countdown_wedding'));
const rsvpCountdownAddon = computed(() => getAddon('countdown_rsvp'));
const mapAddon = computed(() => getAddon('map'));

const weddingDate = computed(() => weddingCountdownAddon.value?.settings?.targetDate || base.value.date || '2027-06-14T18:00:00');
const rsvpDate = computed(() => rsvpCountdownAddon.value?.settings?.targetDate || '2027-05-20T23:59:59');
const formattedDate = computed(() => {
  const rawDate = base.value.date || weddingDate.value;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return '14 de junio de 2027';
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
});

const fontStacks = {
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  Poppins: "'Poppins', Arial, sans-serif",
  Georgia: 'Georgia, serif',
  'Patrick Hand': "'Patrick Hand', cursive",
  Arial: 'Arial, sans-serif',
};

const templateVars = computed(() => ({
  '--color-primary': styles.value.primaryColor || '#C7355C',
  '--color-primary-dark': styles.value.titleColor || '#9F1F46',
  '--color-primary-light': styles.value.secondaryColor || '#FFF1F4',
  '--theme-background': styles.value.backgroundGradient || 'linear-gradient(180deg, #fff7fa 0%, #ffffff 100%)',
  '--theme-accent-shape': styles.value.accentShape || '#F7DCE5',
  '--color-text-main': '#111827',
  '--color-text-muted': styles.value.bodyTextColor || '#6B7280',
  '--color-surface': '#FFFFFF',
  '--color-border': '#F4DCE3',
  // Typography application: map selected labels to real CSS stacks so preview changes are always visible.
  '--couple-font-family': fontStacks[styles.value.coupleFontFamily] || "'Playfair Display', Georgia, serif",
  '--body-font-family': fontStacks[styles.value.bodyFontFamily] || 'Arial, sans-serif',
  '--template-text-color': styles.value.textColor || '#111827',
}));

const names = computed(() => base.value.names || 'María & Carlos');
const locationName = computed(() => mapAddon.value?.settings?.locationName || base.value.location || 'Rose Garden Hall');
const locationAddress = computed(() => mapAddon.value?.settings?.address || 'Santiago, Chile');
const locationMapUrl = computed(() => mapAddon.value?.settings?.mapUrl || 'https://maps.google.com');
const storyMessage = computed(() => base.value.message || 'Nos encantaría que seas parte de este momento tan especial.');
const orderedBlocks = computed(() => (props.invitationData?.blocks || []).filter((b) => b.enabled).slice().sort((a,b) => a.order - b.order));


onMounted(() => {
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        sectionObserver?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sectionRefs.forEach((el) => sectionObserver?.observe(el));
});

onUnmounted(() => {
  sectionObserver?.disconnect();
});

const onRsvpConfirm = (payload) => {
  console.log('RSVP confirmed', payload);
};
</script>

<template>
  <article class="romantic-motion-template" :style="templateVars">
    <section :ref="setSectionRef" class="hero motion-section">
      <div class="hero-decor hero-decor--one" aria-hidden="true"></div>
      <div class="hero-decor hero-decor--two" aria-hidden="true"></div>
      <p class="hero-kicker">Nuestra boda</p>
      <h1>{{ names }}</h1>
      <p class="hero-date">{{ formattedDate }}</p>
      <p class="hero-location">{{ locationName }}</p>
      <p class="hero-message">{{ storyMessage }}</p>
    </section>

    <template v-for="block in orderedBlocks" :key="block.id">
    <section v-if="block.type === 'countdown_wedding'" :ref="setSectionRef" class="motion-section flow-section"><CountdownBlock :target-date="weddingDate" title="Faltan para nuestra boda" variant="primary" /></section>
    <section v-else-if="block.type === 'story'" :ref="setSectionRef" class="motion-section flow-section"><StoryBlock title="Nuestra historia" :message="storyMessage" /></section>
    <section v-else-if="block.type === 'gallery'" :ref="setSectionRef" class="motion-section flow-section"><GalleryBlock title="Nuestros momentos" :images="gallery" /></section>
    <section v-else-if="block.type === 'timeline'" :ref="setSectionRef" class="motion-section flow-section"><TimelineBlock title="Bitácora del evento" :items="timeline" /></section>
    <section v-else-if="block.type === 'map' && mapAddon" :ref="setSectionRef" class="motion-section flow-section"><MapBlock :location-name="locationName" :address="locationAddress" :map-url="locationMapUrl" /></section>
    <section v-else-if="block.type === 'countdown_rsvp'" :ref="setSectionRef" class="motion-section flow-section"><CountdownBlock :target-date="rsvpDate" title="Tiempo para confirmar" variant="minimal" /></section>
    <section v-else-if="block.type === 'rsvp'" :ref="setSectionRef" class="motion-section flow-section"><RSVPBlock @confirm="onRsvpConfirm" /></section>
    </template>

  </article>
</template>
