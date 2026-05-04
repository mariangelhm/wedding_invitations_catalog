<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import './romanticMotionTemplate.css';
import wedding1 from '../../../../assets/sample-gallery/wedding-1.jpg';
import wedding2 from '../../../../assets/sample-gallery/wedding-2.jpg';
import wedding3 from '../../../../assets/sample-gallery/wedding-3.jpg';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });

const sectionRefs = [];
const revealItemRefs = [];
function setSectionRef(el) { if (el && !sectionRefs.includes(el)) sectionRefs.push(el); }
function setRevealItemRef(el) { if (el && !revealItemRefs.includes(el)) revealItemRefs.push(el); }
let observer = null;

const base = computed(() => props.invitationData?.base || {});
const styles = computed(() => props.invitationData?.styles || {});
const fallbackBlocks = [
  { id: 'countdown-wedding', type: 'countdown_wedding', enabled: true, order: 1 },
  { id: 'story', type: 'story', enabled: true, order: 2 },
  { id: 'gallery', type: 'gallery', enabled: true, order: 3 },
  { id: 'timeline', type: 'timeline', enabled: true, order: 4 },
  { id: 'map', type: 'map', enabled: true, order: 5 },
  { id: 'countdown-rsvp', type: 'countdown_rsvp', enabled: true, order: 6 },
  { id: 'rsvp', type: 'rsvp', enabled: true, order: 7 },
];
const enabledBlocks = computed(() => {
  const source = Array.isArray(props.invitationData?.blocks) && props.invitationData.blocks.length ? props.invitationData.blocks : fallbackBlocks;
  return source.filter((block) => block.enabled).sort((a, b) => a.order - b.order);
});
const sourceBlocks = computed(() => Array.isArray(props.invitationData?.blocks) ? props.invitationData.blocks : fallbackBlocks);

const names = computed(() => base.value.names || 'María & Carlos');
const weddingDate = computed(() => sourceBlocks.value.find((b) => b.type === 'countdown_wedding')?.settings?.targetDate || base.value.date || '2027-06-14T18:00:00');
const rsvpDate = computed(() => sourceBlocks.value.find((b) => b.type === 'countdown_rsvp')?.settings?.targetDate || '2027-05-20T23:59:59');
const locationName = computed(() => props.invitationData?.mapSettings?.locationName || base.value.location || 'Rose Garden Hall');
const locationAddress = computed(() => props.invitationData?.mapSettings?.address || 'Santiago, Chile');
const mapUrl = computed(() => props.invitationData?.mapSettings?.mapUrl || 'https://maps.google.com');
const embedUrl = computed(() => props.invitationData?.mapSettings?.embedUrl || '');
const heroMessage = computed(() => base.value.heroMessage || 'Nos encantaría que seas parte de este día tan especial.');
const storyMessage = computed(() => base.value.storyMessage || 'Nuestra historia está llena de momentos simples, valientes y hermosos que queremos celebrar contigo.');
const timeline = computed(() => props.invitationData?.timeline?.length ? props.invitationData.timeline : [
  { time: '17:00', title: 'Ceremonia', place: 'Jardín principal' },
  { time: '19:00', title: 'Cena', place: 'Salón principal' },
  { time: '21:00', title: 'Fiesta', place: 'Pista de baile' },
]);
const gallery = computed(() => props.invitationData?.gallery?.length ? props.invitationData.gallery : [
  { src: wedding1, alt: 'Foto principal' },
  { src: wedding2, alt: 'Momento especial' },
  { src: wedding3, alt: 'Nuestra historia' },
]);

const formattedDate = computed(() => {
  const date = new Date(weddingDate.value);
  if (Number.isNaN(date.getTime())) return '14 de junio de 2027';
  return date.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const fontStacks = { 'Playfair Display': "'Playfair Display', Georgia, serif", 'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif", Lora: "'Lora', Georgia, serif", Poppins: "'Poppins', Arial, sans-serif", Montserrat: "'Montserrat', Arial, sans-serif", Arial: 'Arial, sans-serif' };
const templateVars = computed(() => ({
  '--color-primary': styles.value.primaryColor || '#C7355C',
  '--color-primary-dark': styles.value.titleColor || '#9F1F46',
  '--color-primary-soft': styles.value.secondaryColor || '#FFF1F4',
  '--color-text-main': styles.value.bodyTextColor || '#1F2937',
  '--inv-background': styles.value.backgroundGradient || 'linear-gradient(180deg, #fff6f9 0%, #fff 40%, #fff8fb 100%)',
  '--couple-font-family': fontStacks[styles.value.coupleFontFamily] || "'Playfair Display', Georgia, serif",
  '--body-font-family': fontStacks[styles.value.bodyFontFamily] || 'Arial, sans-serif',
}));

const showRsvpInput = ref(false);
const guestName = ref('');
const rsvpSent = ref(false);
const confirmRsvp = () => {
  if (!guestName.value.trim()) return;
  rsvpSent.value = true;
};

const calculateCountdown = (targetDate) => {
  const now = Date.now();
  const diff = Math.max(0, new Date(targetDate).getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
};
const weddingCountdown = computed(() => calculateCountdown(weddingDate.value));
const rsvpCountdown = computed(() => calculateCountdown(rsvpDate.value));
if (import.meta.env.DEV) {
  watchEffect(() => {
    console.log('Enabled blocks', enabledBlocks.value);
  });
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  [...sectionRefs, ...revealItemRefs].forEach((el) => observer?.observe(el));
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
  <article class="romantic-motion" :style="templateVars">
    <div class="bg-layer one" aria-hidden="true"></div>
    <div class="bg-layer two" aria-hidden="true"></div>

    <section :ref="setSectionRef" class="motion-section hero">
      <p class="hero-kicker">Nuestra boda</p>
      <h1 class="names">{{ names }}</h1>
      <p class="meta">{{ formattedDate }}</p>
      <p class="meta">{{ locationName }}</p>
      <p class="hero-message">{{ heroMessage }}</p>
    </section>

    <section v-for="block in enabledBlocks" :key="block.id || block.type" :ref="setSectionRef" class="motion-section section" :class="{ 'section-band': ['countdown_wedding','timeline'].includes(block.type), compact: block.type === 'countdown_rsvp', 'story-split': block.type === 'story', 'gallery-wrap': block.type === 'gallery', 'rsvp-final': block.type === 'rsvp' }">
      <template v-if="block.type === 'countdown_wedding'">
        <h2>Faltan para nuestra boda</h2>
        <div class="count-grid"><div><strong>{{ weddingCountdown.days }}</strong><span>Días</span></div><div><strong>{{ weddingCountdown.hours }}</strong><span>Horas</span></div><div><strong>{{ weddingCountdown.minutes }}</strong><span>Min</span></div></div>
      </template>
      <template v-else-if="block.type === 'story'">
        <div><h2>Nuestra historia</h2><p>{{ storyMessage }}</p></div>
        <div class="story-panel" aria-hidden="true"><span>Desde el primer “sí”, todo cambió.</span></div>
      </template>
      <template v-else-if="block.type === 'gallery'">
        <h2>Nuestros momentos</h2>
        <div class="gallery-layered"><figure v-for="(item, index) in gallery.slice(0,3)" :key="`${item.alt}-${index}`" :ref="setRevealItemRef" class="motion-item" :style="{ '--delay': `${index * 120}ms` }"><img v-if="item.src" :src="item.src" :alt="item.alt" /><div v-else class="placeholder">{{ item.alt }}</div></figure></div>
      </template>
      <template v-else-if="block.type === 'timeline'">
        <h2>Bitácora del evento</h2>
        <div class="timeline"><article v-for="(item, index) in timeline" :key="`${item.time}-${index}`" :ref="setRevealItemRef" class="timeline-item motion-item" :style="{ '--delay': `${index * 120}ms` }"><span class="dot"></span><p class="time">{{ item.time }}</p><h3>{{ item.title }}</h3><p>{{ item.place }}</p></article></div>
      </template>
      <template v-else-if="block.type === 'map'">
        <h2>Cómo llegar</h2><p>{{ locationName }} · {{ locationAddress }}</p>
        <div v-if="embedUrl" class="map-frame"><iframe :src="embedUrl" width="100%" height="320" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <div v-else class="map-fallback">Ubicación disponible en Google Maps.</div><a :href="mapUrl" target="_blank" rel="noreferrer" class="map-btn">Abrir en Google Maps</a>
      </template>
      <template v-else-if="block.type === 'countdown_rsvp'">
        <h2>Tiempo para confirmar</h2>
        <div class="count-grid compact"><div><strong>{{ rsvpCountdown.days }}</strong><span>Días</span></div><div><strong>{{ rsvpCountdown.hours }}</strong><span>Horas</span></div><div><strong>{{ rsvpCountdown.minutes }}</strong><span>Min</span></div></div>
      </template>
      <template v-else-if="block.type === 'rsvp'">
        <h2>¿Nos acompañas?</h2><p>Tu presencia hará este día todavía más inolvidable.</p>
        <button v-if="!showRsvpInput" class="cta" type="button" @click="showRsvpInput = true">Confirmar asistencia</button>
        <div v-else class="rsvp-form"><input v-model="guestName" type="text" placeholder="Nombre y apellido" /><button class="cta" type="button" @click="confirmRsvp">Enviar confirmación</button></div>
        <p v-if="rsvpSent" class="success">¡Gracias {{ guestName }}! Tu confirmación fue enviada.</p>
      </template>
    </section>
  </article>
</template>
