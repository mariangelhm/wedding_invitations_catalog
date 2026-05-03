<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import StoryBlock from '../../../../components/blocks/StoryBlock/StoryBlock.vue';
import TimelineBlock from '../../../../components/blocks/TimelineBlock/TimelineBlock.vue';
import './romanticMotionTemplate.css';
import wedding1 from '../../../../assets/sample-gallery/wedding-1.jpg';
import wedding2 from '../../../../assets/sample-gallery/wedding-2.jpg';
import wedding3 from '../../../../assets/sample-gallery/wedding-3.jpg';
import wedding4 from '../../../../assets/sample-gallery/wedding-4.jpg';

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
  { src: wedding1, alt: 'Foto principal' },
  { src: wedding2, alt: 'Momento especial' },
  { src: wedding3, alt: 'Nuestra historia' },
  { src: wedding4, alt: 'Celebración' },
]);
const fallbackBlocks = [
  { id: 'block-countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1, settings: {} },
  { id: 'block-story', type: 'story', enabled: true, order: 2, settings: {} },
  { id: 'block-gallery', type: 'gallery', enabled: true, order: 3, settings: {} },
  { id: 'block-timeline', type: 'timeline', enabled: true, order: 4, settings: {} },
  { id: 'block-map', type: 'map', enabled: false, order: 5, settings: {} },
  { id: 'block-countdown-rsvp', type: 'countdown_rsvp', enabled: true, order: 6, settings: {} },
  { id: 'block-rsvp', type: 'rsvp', enabled: true, order: 7, settings: {} },
];

const orderedBlocks = computed(() => {
  const source = Array.isArray(props.invitationData?.blocks) && props.invitationData.blocks.length
    ? props.invitationData.blocks
    : fallbackBlocks;
  return source.filter((b) => b.enabled !== false).slice().sort((a, b) => a.order - b.order);
});
const getEnabledBlock = (type) => orderedBlocks.value.find((block) => block.type === type);
const weddingCountdownBlock = computed(() => getEnabledBlock('countdown_wedding'));
const rsvpCountdownBlock = computed(() => getEnabledBlock('countdown_rsvp'));
const mapBlock = computed(() => getEnabledBlock('map'));

const weddingDate = computed(() => weddingCountdownBlock.value?.settings?.targetDate || base.value.date || '2027-06-14T18:00:00');
const rsvpDate = computed(() => rsvpCountdownBlock.value?.settings?.targetDate || '2027-05-20T23:59:59');
const formattedDate = computed(() => {
  const rawDate = base.value.date || weddingDate.value;
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return '14 de junio de 2027';
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
});

const fontStacks = {
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  'Libre Baskerville': "'Libre Baskerville', Georgia, serif",
  Merriweather: "'Merriweather', Georgia, serif",
  Lora: "'Lora', Georgia, serif",
  Poppins: "'Poppins', Arial, sans-serif",
  Montserrat: "'Montserrat', Arial, sans-serif",
  Raleway: "'Raleway', Arial, sans-serif",
  Nunito: "'Nunito', Arial, sans-serif",
  Georgia: 'Georgia, serif',
  'Patrick Hand': "'Patrick Hand', cursive",
  'Dancing Script': "'Dancing Script', cursive",
  'Great Vibes': "'Great Vibes', cursive",
  Arial: 'Arial, sans-serif',
};

const templateVars = computed(() => ({
  '--color-primary': styles.value.primaryColor || '#C7355C',
  '--color-primary-dark': styles.value.titleColor || '#9F1F46',
  '--section-heading-color': styles.value.titleColor || '#9F1F46',
  '--color-primary-light': styles.value.secondaryColor || '#FFF1F4',
  '--theme-background': styles.value.backgroundGradient || 'linear-gradient(180deg, #fff7fa 0%, #ffffff 100%)',
  '--theme-accent-shape': styles.value.accentShape || '#F7DCE5',
  '--color-text-main': styles.value.bodyTextColor || '#111827',
  '--color-text-muted': styles.value.bodyTextColor || '#6B7280',
  '--color-surface': '#FFFFFF',
  '--color-border': '#F4DCE3',
  // Typography application: map selected labels to real CSS stacks so preview changes are always visible.
  '--couple-font-family': fontStacks[styles.value.coupleFontFamily] || "'Playfair Display', Georgia, serif",
  '--body-font-family': fontStacks[styles.value.bodyFontFamily] || 'Arial, sans-serif',
  '--template-text-color': styles.value.bodyTextColor || styles.value.textColor || '#111827',
}));

const names = computed(() => base.value.names || 'María & Carlos');
const locationName = computed(() => mapBlock.value?.settings?.locationName || props.invitationData?.mapSettings?.locationName || base.value.location || 'Rose Garden Hall');
const locationAddress = computed(() => mapBlock.value?.settings?.address || props.invitationData?.mapSettings?.address || 'Santiago, Chile');
const locationMapUrl = computed(() => mapBlock.value?.settings?.mapUrl || props.invitationData?.mapSettings?.mapUrl || 'https://maps.google.com');
const locationEmbedUrl = computed(() => mapBlock.value?.settings?.embedUrl || props.invitationData?.mapSettings?.embedUrl || '');
const heroMessage = computed(() => base.value.heroMessage || 'Nos encantaría que seas parte de este día especial.');
const storyMessage = computed(() => base.value.storyMessage || 'Nuestra historia está llena de momentos simples, valientes y hermosos que queremos celebrar contigo.');
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
      <h1 class="romantic-motion__couple-names">{{ names }}</h1>
      <p class="hero-date">{{ formattedDate }}</p>
      <p class="hero-location">{{ locationName }}</p>
      <p class="hero-message">{{ heroMessage }}</p>
    </section>

    <template v-for="block in orderedBlocks" :key="block.id">
    <section v-if="block.type === 'countdown_wedding'" :ref="setSectionRef" class="motion-section flow-section"><CountdownBlock :target-date="weddingDate" title="Faltan para nuestra boda" variant="primary" /></section>
    <section v-else-if="block.type === 'story'" :ref="setSectionRef" class="motion-section flow-section"><StoryBlock title="Nuestra historia" :message="storyMessage" /></section>
    <section v-else-if="block.type === 'gallery'" :ref="setSectionRef" class="motion-section flow-section"><GalleryBlock title="Nuestros momentos" :images="gallery" /></section>
    <section v-else-if="block.type === 'timeline'" :ref="setSectionRef" class="motion-section flow-section"><TimelineBlock title="Bitácora del evento" :items="timeline" /></section>
    <section v-else-if="block.type === 'map'" :ref="setSectionRef" class="motion-section flow-section"><MapBlock :location-name="locationName" :address="locationAddress" :map-url="locationMapUrl" :embed-url="locationEmbedUrl" /></section>
    <section v-else-if="block.type === 'countdown_rsvp'" :ref="setSectionRef" class="motion-section flow-section"><CountdownBlock :target-date="rsvpDate" title="Tiempo para confirmar" variant="minimal" /></section>
    <section v-else-if="block.type === 'rsvp'" :ref="setSectionRef" class="motion-section flow-section"><RSVPBlock @confirm="onRsvpConfirm" /></section>
    </template>

  </article>
</template>
