<script setup>
import { computed, ref } from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import StoryBlock from '../../../../components/blocks/StoryBlock/StoryBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import './romanticMotionTemplate.css';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });
const styles = computed(() => props.invitationData?.styles || {});
const base = computed(() => props.invitationData?.base || {});
const blocks = computed(() => (props.invitationData?.blocks || []).filter((b) => b.enabled));
const hasBlock = (type) => blocks.value.some((b) => b.type === type);
const blockByType = (type) => blocks.value.find((b) => b.type === type) || {};
const mapSettings = computed(() => props.invitationData?.mapSettings || {});
const names = computed(() => base.value.names || 'María & Carlos');
const initials = computed(() => names.value.split('&').map((p) => p.trim()[0] || '').join(' & ').toUpperCase());
const formattedDate = computed(() => new Date(base.value.date || '2027-06-14T18:00:00').toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' }));
const headerScrolled = ref(false); const menuOpen = ref(false); const openFaq = ref(-1);
const faqs = [{q:'¿Puedo llevar acompañante?',a:'Sí, puedes indicarlo en el formulario RSVP.'},{q:'¿Cuál es el código de vestimenta?',a:'Formal elegante.'},{q:'¿Hasta cuándo puedo confirmar?',a:'Hasta una semana antes del evento.'},{q:'¿Hay estacionamiento?',a:'Sí, hay estacionamiento disponible en el lugar.'}];

const themeVars = computed(() => ({ '--template-hero-bg': styles.value.heroBackground || 'linear-gradient(145deg,#6c675c,#2f2e2e)', '--template-hero-text': styles.value.heroTextColor || '#FFFFFF', '--template-story-bg': styles.value.storyBackground || '#FFFFFF', '--template-details-bg': styles.value.eventBackground || '#F4F1EA', '--template-parallax-bg': styles.value.galleryBackground || '#d8d1c4', '--template-rsvp-bg': styles.value.rsvpBackground || '#EFEBE9', '--template-rsvp-text': styles.value.rsvpTextColor || '#2F2E2E', '--template-title': styles.value.titleColor || '#2F2E2E', '--template-body': styles.value.bodyTextColor || '#2F2E2E', '--template-link': styles.value.linkColor || '#2F2E2E', '--template-border': styles.value.borderColor || 'rgba(47,46,46,.2)' }));

const revealRefs = ref([]);
let observer = null;
let removeScrollListener = null;
const setRevealRef = (el) => { if (el && !revealRefs.value.includes(el)) revealRefs.value.push(el); };
onMounted(() => {
  const onScroll = () => { headerScrolled.value = window.scrollY > 16; };
  window.addEventListener('scroll', onScroll, { passive: true });
  removeScrollListener = () => window.removeEventListener('scroll', onScroll);
  onScroll();
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.14 });
  revealRefs.value.forEach((el) => observer?.observe(el));
});
onUnmounted(() => {
  observer?.disconnect();
  removeScrollListener?.();
});
</script>
<template>
<div class="romantic-template" :style="themeVars">
  <header class="romantic-template__header" :class="{ scrolled: headerScrolled }">
    <div class="romantic-template__header-inner">
      <div class="romantic-template__initials">{{ initials }}</div>
      <nav class="romantic-template__nav" :class="{ open: menuOpen }"><a href="#story">NOSOTROS</a><a href="#details">VIAJE Y ESTANCIA</a><a href="#gallery">REGISTRO</a><a href="#map">P&R</a><a href="#rsvp">RSVP</a></nav>
      <button class="romantic-template__hamburger" @click="menuOpen = !menuOpen">☰</button>
    </div>
  </header>
  <section id="home" class="romantic-template__hero"><div class="hero-overlay"></div><div class="hero-content motion-left" :ref="setRevealRef"><p>Nos vamos a casar</p><h1>{{ names.toUpperCase() }}</h1><p>{{ formattedDate }} · {{ base.location || 'Rose Garden Hall' }}</p><a href="#rsvp" class="romantic-btn romantic-btn--ghost">RSVP</a></div></section>
  <section id="story" class="romantic-template__story motion-section" :ref="setRevealRef"><div class="story-copy motion-left" :ref="setRevealRef"><h2 class="romantic-section-title">Nuestra historia</h2><p>{{ base.storyMessage || 'Nuestra historia merece celebrarse contigo.' }}</p></div><div class="story-media motion-right" :ref="setRevealRef"></div></section>
  <section v-if="hasBlock('countdown_wedding')" class="motion-section" :ref="setRevealRef"><CountdownBlock :target-date="base.date" :title="blockByType('countdown_wedding').settings?.title || 'Cuenta regresiva'" variant="editorial" /></section>
  <section id="details" class="romantic-template__details motion-section" :ref="setRevealRef"><h2 class="romantic-section-title">Cuándo y dónde</h2><div class="details-grid"><article><span>◌</span><h3>Ceremonia</h3><p>{{ formattedDate }}</p><p>{{ base.location || mapSettings.locationName }}</p><a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank">VER MAPA</a></article><article><span>◌</span><h3>Celebración</h3><p>{{ formattedDate }}</p><p>{{ mapSettings.address || base.location }}</p><a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank">VER MAPA</a></article></div></section>
  <section id="gallery" class="romantic-template__parallax"><div class="parallax-overlay"></div><p>Cada historia de amor merece celebrarse</p></section>
  <section v-if="hasBlock('gallery')" class="motion-section" :ref="setRevealRef"><GalleryBlock :images="props.invitationData?.gallery || []" :title="blockByType('gallery').settings?.title || 'Galería'" integrated /></section>
  <section id="rsvp" class="romantic-template__rsvp motion-section" :ref="setRevealRef"><h2 class="romantic-section-title">Confirma tu asistencia</h2><RSVPBlock :title="blockByType('rsvp').settings?.title || 'Confirma tu asistencia'" :button-label="blockByType('rsvp').settings?.buttonLabel || 'Enviar confirmación'" /></section>
  <section id="map" class="romantic-template__map-faq motion-section" :ref="setRevealRef"><div><MapBlock v-if="hasBlock('map')" :location-name="mapSettings.locationName || base.location || ''" :address="mapSettings.address || ''" :map-url="mapSettings.mapUrl || ''" :embed-url="mapSettings.embedUrl || ''" /></div><div class="faq"><h2 class="romantic-section-title">Preguntas frecuentes</h2><article v-for="(item, i) in faqs" :key="item.q" class="faq-item"><button @click="openFaq = openFaq === i ? -1 : i"><span>{{ item.q }}</span><span>{{ openFaq === i ? '−' : '+' }}</span></button><p v-if="openFaq===i">{{ item.a }}</p></article></div></section>
  <footer class="romantic-template__footer"><p>{{ initials }}</p><p>{{ formattedDate }}</p><p>Gracias por ser parte de nuestra historia</p></footer>
</div>
</template>
