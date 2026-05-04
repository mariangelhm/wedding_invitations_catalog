<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import StoryBlock from '../../../../components/blocks/StoryBlock/StoryBlock.vue';
import TimelineBlock from '../../../../components/blocks/TimelineBlock/TimelineBlock.vue';
import './romanticMotionTemplate.css';
import wedding1 from '../../../../assets/sample-gallery/wedding-1.jpg';
import wedding2 from '../../../../assets/sample-gallery/wedding-2.jpg';
import wedding3 from '../../../../assets/sample-gallery/wedding-3.jpg';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });
const sectionRefs = []; const setSectionRef = (el) => { if (el && !sectionRefs.includes(el)) sectionRefs.push(el); };
let sectionObserver = null;
const rsvpOpen = ref(false); const rsvpName = ref(''); const rsvpDone = ref(false);

const base = computed(() => props.invitationData?.base || {});
const styles = computed(() => props.invitationData?.styles || {});
const timeline = computed(() => props.invitationData?.timeline || []);
const gallery = computed(() => props.invitationData?.gallery || [{ src: wedding1, alt: 'Foto principal' }, { src: wedding2, alt: 'Momento especial' }, { src: wedding3, alt: 'Nuestra historia' }]);
const orderedBlocks = computed(() => (Array.isArray(props.invitationData?.blocks) ? props.invitationData.blocks : []).filter((b) => b.enabled !== false).slice().sort((a, b) => a.order - b.order));
const getEnabledBlock = (type) => orderedBlocks.value.find((block) => block.type === type);
const weddingCountdownBlock = computed(() => getEnabledBlock('countdown_wedding'));
const rsvpCountdownBlock = computed(() => getEnabledBlock('countdown_rsvp'));
const mapBlock = computed(() => getEnabledBlock('map'));
const weddingDate = computed(() => weddingCountdownBlock.value?.settings?.targetDate || base.value.date || '2027-06-14T18:00:00');
const rsvpDate = computed(() => rsvpCountdownBlock.value?.settings?.targetDate || '2027-05-20T23:59:59');
const formattedDate = computed(() => { const date = new Date(base.value.date || weddingDate.value); return Number.isNaN(date.getTime()) ? '14 de junio de 2027' : date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }); });
const templateVars = computed(() => ({ '--color-primary': styles.value.primaryColor || '#C7355C', '--color-primary-dark': styles.value.titleColor || '#9F1F46', '--color-primary-light': styles.value.secondaryColor || '#FFF1F4', '--theme-background': styles.value.backgroundGradient || 'linear-gradient(180deg,#fff7fa 0%,#fff 100%)', '--theme-accent-shape': styles.value.accentShape || '#F7DCE5', '--color-text-main': styles.value.bodyTextColor || '#111827', '--color-text-muted': styles.value.bodyTextColor || '#6B7280', '--surface': styles.value.surfaceColor || '#FFFFFF', '--surface-text': styles.value.surfaceTextColor || '#1F2937', '--couple-font': "'Playfair Display', Georgia, serif" }));
const names = computed(() => base.value.names || 'María & Carlos');
const locationName = computed(() => mapBlock.value?.settings?.locationName || props.invitationData?.mapSettings?.locationName || base.value.location || 'Rose Garden Hall');
const locationAddress = computed(() => mapBlock.value?.settings?.address || props.invitationData?.mapSettings?.address || 'Santiago, Chile');
const locationMapUrl = computed(() => mapBlock.value?.settings?.mapUrl || props.invitationData?.mapSettings?.mapUrl || 'https://maps.google.com');
const locationEmbedUrl = computed(() => mapBlock.value?.settings?.embedUrl || props.invitationData?.mapSettings?.embedUrl || '');

onMounted(() => {
  sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); sectionObserver?.unobserve(entry.target); } }), { threshold: 0.15 });
  sectionRefs.forEach((el) => sectionObserver?.observe(el));
});
onUnmounted(() => sectionObserver?.disconnect());
const confirmRsvp = () => { if (!rsvpName.value.trim()) return; rsvpDone.value = true; };
</script>

<template>
  <article class="romantic-motion" :style="templateVars">
    <div class="shape shape--a" aria-hidden="true"></div><div class="shape shape--b" aria-hidden="true"></div>
    <section :ref="setSectionRef" class="hero motion-section">
      <p class="hero-kicker">Nuestra boda</p><h1 class="names">{{ names }}</h1><p class="hero-date">{{ formattedDate }}</p><p class="hero-location">{{ locationName }}</p><p class="hero-message">{{ base.heroMessage }}</p>
    </section>
    <template v-for="block in orderedBlocks" :key="block.id">
      <section v-if="block.type==='countdown_wedding'" :ref="setSectionRef" class="motion-section band"><CountdownBlock :target-date="weddingDate" :title="block.settings?.title || 'Faltan para nuestra boda'" variant="primary" /></section>
      <section v-else-if="block.type==='story'" :ref="setSectionRef" class="motion-section story-split"><div><StoryBlock title="Nuestra historia" :message="base.storyMessage" /></div><div class="story-art" aria-hidden="true"></div></section>
      <section v-else-if="block.type==='gallery'" :ref="setSectionRef" class="motion-section gallery-overlap"><GalleryBlock title="Nuestros momentos" :images="gallery" integrated /></section>
      <section v-else-if="block.type==='timeline'" :ref="setSectionRef" class="motion-section band"><TimelineBlock title="Bitácora del evento" :items="timeline" /></section>
      <section v-else-if="block.type==='map'" :ref="setSectionRef" class="motion-section map-integrated"><h3>{{ locationName }}</h3><p>{{ locationAddress }}</p><iframe v-if="locationEmbedUrl" :src="locationEmbedUrl" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe><a :href="locationMapUrl" target="_blank" rel="noopener">Abrir en Google Maps</a></section>
      <section v-else-if="block.type==='countdown_rsvp'" :ref="setSectionRef" class="motion-section"><CountdownBlock :target-date="rsvpDate" :title="block.settings?.title || 'Tiempo para confirmar'" variant="minimal" /></section>
      <section v-else-if="block.type==='rsvp'" :ref="setSectionRef" class="motion-section rsvp-final"><h3>¿Nos acompañas?</h3><button v-if="!rsvpOpen" @click="rsvpOpen=true">Confirmar asistencia</button><div v-else-if="!rsvpDone" class="rsvp-form"><input v-model="rsvpName" type="text" placeholder="Tu nombre completo" /><button @click="confirmRsvp">Enviar confirmación</button></div><p v-else class="success">¡Gracias {{ rsvpName }}! Tu asistencia quedó confirmada.</p></section>
    </template>
  </article>
</template>
