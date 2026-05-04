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
const headerScrolled = ref(false); const menuOpen = ref(false); const faqOpen = ref(0);
if (typeof window !== 'undefined') window.addEventListener('scroll', () => { headerScrolled.value = window.scrollY > 24; }, { passive: true });
const themeVars = computed(() => ({ '--template-primary': styles.value.primaryColor || '#303030','--template-secondary': styles.value.secondaryColor || '#F4F1EA','--template-accent': styles.value.accentShape || '#E6E2D8','--template-hero-bg': styles.value.heroBackground,'--template-hero-text': styles.value.heroTextColor || '#FFFFFF','--template-countdown-bg': styles.value.countdownBackground || '#F4F1EA','--template-countdown-number': styles.value.countdownNumberColor || '#303030','--template-countdown-label': styles.value.countdownLabelColor || '#757575','--template-story-bg': styles.value.storyBackground || '#FFFFFF','--template-gallery-bg': styles.value.galleryBackground || '#F4F1EA','--template-event-bg': styles.value.eventBackground || '#FFFFFF','--template-registry-bg': styles.value.registryBackground || '#E6E2D8','--template-rsvp-bg': styles.value.rsvpBackground || '#1A1A1A','--template-title-color': styles.value.titleColor || '#303030','--template-body-color': styles.value.bodyTextColor || '#575757','--template-muted-color': styles.value.mutedTextColor || '#757575','--template-surface': styles.value.surfaceColor || '#FFFFFF','--template-surface-text': styles.value.surfaceTextColor || '#303030','--template-link-color': styles.value.linkColor || '#303030','--template-border-color': styles.value.borderColor || '#E6E2D8','--template-rsvp-text': styles.value.rsvpTextColor || '#FFFFFF','--template-rsvp-input-border': styles.value.rsvpInputBorderColor || '#FFFFFF','--template-rsvp-button-bg': styles.value.rsvpButtonBackground || '#FFFFFF','--template-rsvp-button-text': styles.value.rsvpButtonTextColor || '#1A1A1A'}));
const formattedDate = computed(() => new Date(base.value.date || '2027-06-14T18:00:00').toLocaleDateString('es-CL', { year:'numeric', month:'long', day:'numeric' }));
const initials = computed(() => (base.value.names || 'M & C').split('&').map((p) => p.trim()[0] || '').join(' & ').toUpperCase());
const mapSettings = computed(() => props.invitationData?.mapSettings || {});
const faqs = [{q:'¿Hay código de vestimenta?',a:'Sí, formal elegante.'},{q:'¿Puedo llevar acompañante?',a:'Sí, confirma en RSVP.'},{q:'¿A qué hora inicia?',a:'Revisa la sección de ceremonia.'}];
</script>
<template>
<article class="romantic-template" :style="themeVars">
  <header class="the-header" :class="{ scrolled: headerScrolled }"><div class="header-inner"><div class="brand">{{ initials }}</div><nav class="menu" :class="{ open: menuOpen }"><a href="#story">NUESTRA HISTORIA</a><a href="#details">CUÁNDO Y DÓNDE</a><a href="#registry">REGISTRO</a><a href="#rsvp">RSVP</a></nav><button class="hamburger" @click="menuOpen=!menuOpen">☰</button></div></header>
  <section class="hero"><div class="hero-overlay"></div><div class="hero-content"><h1>{{ base.names || 'María & Carlos' }}</h1><p>SE CASAN · {{ formattedDate }}</p><a href="#rsvp" class="hero-btn">RSVP</a></div></section>
  <section v-if="hasBlock('countdown_wedding')" class="section"><CountdownBlock :target-date="base.date" :title="blockByType('countdown_wedding').settings?.title || 'Cuenta regresiva'" variant="editorial" /></section>
  <section id="story" v-if="hasBlock('story')" class="section section-story"><StoryBlock :title="blockByType('story').settings?.title || 'Nuestra historia'" :message="base.storyMessage || blockByType('story').settings?.message || ''" /></section>
  <section id="details" class="section section-details"><h2>Cuándo y dónde</h2><div class="details-grid"><article><span>◌</span><h3>Ceremonia</h3><p>{{ base.location || 'Lugar' }}</p><a :href="mapSettings.mapUrl" target="_blank">Ver mapa</a></article><article><span>◌</span><h3>Celebración</h3><p>{{ mapSettings.address || base.location }}</p><a :href="mapSettings.mapUrl" target="_blank">Ver mapa</a></article></div></section>
  <section v-if="hasBlock('gallery')" class="section section-gallery"><GalleryBlock :images="props.invitationData?.gallery || []" :title="blockByType('gallery').settings?.title || 'Galería'" integrated /></section>
  <section v-if="hasBlock('map')" class="section"><MapBlock :location-name="mapSettings.locationName || base.location || ''" :address="mapSettings.address || ''" :map-url="mapSettings.mapUrl || ''" :embed-url="mapSettings.embedUrl || ''" /></section>
  <section id="registry" class="section section-registry"><h2>Registro</h2><p>Tu presencia es nuestro mejor regalo.</p></section>
  <section class="section section-faq"><h2>Preguntas frecuentes</h2><article v-for="(item, i) in faqs" :key="item.q" class="faq-item"><button @click="faqOpen = faqOpen === i ? -1 : i">{{ item.q }}</button><p v-if="faqOpen===i">{{ item.a }}</p></article></section>
  <section id="rsvp" class="section section-rsvp"><RSVPBlock :title="blockByType('rsvp').settings?.title || 'Confirma tu asistencia'" :button-label="blockByType('rsvp').settings?.buttonLabel || 'Enviar confirmación'" /></section>
</article>
</template>
