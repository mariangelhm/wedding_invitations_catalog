<script setup>
import { computed, defineComponent, h } from 'vue';
import './style.css';
import { romanticWeddingConfig } from './config';

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });

// Reusable presentational blocks (no business logic) for template composition.
const CountdownBlock = defineComponent({ props: { label: String, targetDate: String }, setup(p) { return () => h('section', { class: 'rw-card' }, [h('h3', p.label || 'Cuenta regresiva'), h('p', { class: 'rw-meta' }, p.targetDate || '-')]); } });
const StoryBlock = defineComponent({ props: { storyMessage: String }, setup(p) { return () => h('section', { class: 'rw-card' }, [h('h3', 'Nuestra historia'), h('p', { class: 'rw-story' }, p.storyMessage || romanticWeddingConfig.fallbackStory)]); } });
const TimelineBlock = defineComponent({ props: { timeline: Array }, setup(p) { return () => h('section', { class: 'rw-card' }, [h('h3', 'Bitácora del día'), h('div', { class: 'rw-timeline' }, (p.timeline || []).map((i) => h('article', { class: 'rw-timeline-item' }, [h('strong', i.time), h('p', i.title), h('small', i.place)])))]); } });
const MapBlock = defineComponent({ props: { mapUrl: String, locationName: String }, setup(p) { return () => h('section', { class: 'rw-card' }, [h('h3', 'Ubicación'), h('p', p.locationName || romanticWeddingConfig.fallbackLocation), h('a', { href: p.mapUrl || '#', target: '_blank', rel: 'noopener' }, 'Ver mapa')]); } });
const RSVPBlock = defineComponent({ setup() { return () => h('section', { class: 'rw-card' }, [h('h3', 'Confirmación de asistencia'), h('label', 'Nombre completo'), h('input', { type: 'text', placeholder: 'Ingresa tu nombre' }), h('button', { class: 'rw-btn', type: 'button' }, 'Confirmar asistencia')]); } });

const data = computed(() => ({
  coupleNames: props.invitationData.coupleNames || romanticWeddingConfig.fallbackNames,
  weddingDate: props.invitationData.weddingDate || romanticWeddingConfig.fallbackDate,
  locationName: props.invitationData.locationName || romanticWeddingConfig.fallbackLocation,
  mapUrl: props.invitationData.mapUrl || '#',
  storyMessage: props.invitationData.storyMessage || romanticWeddingConfig.fallbackStory,
  confirmationDeadline: props.invitationData.confirmationDeadline || romanticWeddingConfig.fallbackDate,
  timeline: props.invitationData.timeline || [],
}));
</script>

<template>
  <div class="rw-shell">
    <!-- Hero section -->
    <section class="rw-hero rw-card"><h1>{{ data.coupleNames }}</h1><p class="rw-meta">{{ data.weddingDate }}</p><p class="rw-meta">{{ data.locationName }}</p><p class="rw-story">Celebremos juntos un día inolvidable.</p></section>
    <!-- Wedding countdown -->
    <CountdownBlock label="Cuenta regresiva para la boda" :target-date="data.weddingDate" />
    <!-- Story section -->
    <StoryBlock :story-message="data.storyMessage" />
    <!-- Timeline section -->
    <TimelineBlock :timeline="data.timeline" />
    <!-- Map section -->
    <MapBlock :map-url="data.mapUrl" :location-name="data.locationName" />
    <!-- Confirmation countdown section -->
    <CountdownBlock :label="romanticWeddingConfig.confirmLabel" :target-date="data.confirmationDeadline" />
    <!-- RSVP section -->
    <RSVPBlock />
  </div>
</template>
