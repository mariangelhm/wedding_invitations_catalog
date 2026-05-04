<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import TimelineBlock from '../../../../components/blocks/TimelineBlock/TimelineBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import './romanticMotionTemplate.css';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });
const menuOpen = ref(false);
const sectionRefs = [];
function setSectionRef(el){ if (el && !sectionRefs.includes(el)) sectionRefs.push(el); }
let observer = null;

const base = computed(() => props.invitationData?.base || {});
const styles = computed(() => props.invitationData?.styles || {});
const fallbackBlocks = [
  { id: 'countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1 },{ id: 'story', type: 'story', enabled: true, order: 2 },{ id: 'gallery', type: 'gallery', enabled: true, order: 3 },{ id: 'timeline', type: 'timeline', enabled: true, order: 4 },{ id: 'map', type: 'map', enabled: true, order: 5 },{ id: 'rsvp', type: 'rsvp', enabled: true, order: 6 },
];
const enabledBlocks = computed(() => {
  const source = Array.isArray(props.invitationData?.blocks) && props.invitationData.blocks.length ? props.invitationData.blocks : fallbackBlocks;
  return source.filter((block) => block.enabled).sort((a, b) => a.order - b.order);
});
if (import.meta.env.DEV) watchEffect(() => console.log('Enabled blocks', enabledBlocks.value));

const names = computed(() => base.value.names || 'María & Carlos');
const initials = computed(() => (names.value.split('&').map((part) => part.trim()[0] || '').join('&')).toUpperCase() || 'M&C');
const weddingDate = computed(() => base.value.date || '2027-06-14T18:00:00');
const formattedDate = computed(() => new Date(weddingDate.value).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }));
const locationName = computed(() => props.invitationData?.mapSettings?.locationName || base.value.location || 'Rose Garden Hall');
const locationAddress = computed(() => props.invitationData?.mapSettings?.address || 'Santiago, Chile');
const mapUrl = computed(() => props.invitationData?.mapSettings?.mapUrl || 'https://maps.google.com');
const embedUrl = computed(() => props.invitationData?.mapSettings?.embedUrl || '');
const storyMessage = computed(() => base.value.storyMessage || 'Nuestra historia está llena de momentos simples, valientes y hermosos que queremos celebrar contigo.');
const timeline = computed(() => props.invitationData?.timeline?.length ? props.invitationData.timeline : [{ time:'17:00', title:'Ceremonia', place:'Jardín principal' },{ time:'19:00', title:'Cena', place:'Salón principal' },{ time:'21:00', title:'Fiesta', place:'Pista de baile' }]);
const gallery = computed(() => props.invitationData?.gallery?.length ? props.invitationData.gallery : [{src:'',alt:'Foto editorial 1'},{src:'',alt:'Foto editorial 2'},{src:'',alt:'Foto editorial 3'}]);

const cssVars = computed(() => ({ '--editorial-bg': styles.value.background || styles.value.backgroundGradient || '#F4F1EA', '--editorial-accent': styles.value.primaryColor || '#B88A44', '--editorial-title': styles.value.titleColor || '#2F2A24', '--editorial-text': styles.value.bodyTextColor || '#3F3A34' }));

onMounted(() => {
  observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer?.unobserve(entry.target); } }); }, { threshold: 0.16 });
  sectionRefs.forEach((el) => observer?.observe(el));
});
onUnmounted(() => observer?.disconnect());
const onRsvp = (payload) => console.log('RSVP payload', payload);
</script>

<template>
  <article class="romantic-motion-editorial" :style="cssVars">
    <!-- TODO: sticky header behavior can be upgraded if needed for nested preview scroll container. -->
    <header class="editorial-header">
      <div class="editorial-brand">{{ initials }}</div>
      <button class="editorial-menu-btn" @click="menuOpen = !menuOpen">☰</button>
      <nav class="editorial-nav" :class="{ open: menuOpen }"><a href="#story">Historia</a><a href="#when">Cuándo y dónde</a><a href="#rsvp">RSVP</a></nav>
    </header>

    <section class="hero-editorial motion-section" :ref="setSectionRef">
      <div class="hero-overlay"></div>
      <CountdownBlock :target-date="weddingDate" title="Cuenta regresiva" variant="minimal" />
      <h1>{{ names }}</h1>
      <p>{{ formattedDate }}</p>
      <p>{{ locationName }}</p>
      <a href="#rsvp" class="hero-cta">Confirmar asistencia</a>
    </section>

    <section id="story" class="story-editorial motion-section" :ref="setSectionRef">
      <div><h2>Nuestra historia</h2><p>{{ storyMessage }}</p></div>
      <div class="story-image"></div>
    </section>

    <section class="gallery-editorial motion-section" :ref="setSectionRef">
      <h2>Galería</h2>
      <div class="gallery-layered">
        <figure class="g-large"><div v-if="!gallery[0]?.src" class="ph">{{ gallery[0]?.alt || 'Foto principal' }}</div><img v-else :src="gallery[0].src" :alt="gallery[0].alt" /></figure>
        <figure class="g-small"><div v-if="!gallery[1]?.src" class="ph">{{ gallery[1]?.alt || 'Foto secundaria' }}</div><img v-else :src="gallery[1].src" :alt="gallery[1].alt" /></figure>
        <figure class="g-small"><div v-if="!gallery[2]?.src" class="ph">{{ gallery[2]?.alt || 'Foto secundaria' }}</div><img v-else :src="gallery[2].src" :alt="gallery[2].alt" /></figure>
      </div>
    </section>

    <section id="when" class="motion-section" :ref="setSectionRef"><TimelineBlock title="Cuándo y dónde" :items="timeline" /></section>
    <section class="motion-section" :ref="setSectionRef"><MapBlock :location-name="locationName" :address="locationAddress" :map-url="mapUrl" :embed-url="embedUrl" /></section>
    <section id="rsvp" class="motion-section" :ref="setSectionRef"><RSVPBlock @confirm="onRsvp" /></section>
  </article>
</template>
