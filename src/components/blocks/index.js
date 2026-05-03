import CountdownBlock from './CountdownBlock/CountdownBlock.vue';
import MapBlock from './MapBlock/MapBlock.vue';
import TimelineBlock from './TimelineBlock/TimelineBlock.vue';
import StoryBlock from './StoryBlock/StoryBlock.vue';
import RSVPBlock from './RSVPBlock/RSVPBlock.vue';
import GalleryBlock from './GalleryBlock/GalleryBlock.vue';

// Central registry to reuse block components across invitation templates.
// This registry is designed to support future drag & drop assembly flows.
// Each block declares which props are configurable from editor interfaces.
export const blockRegistry = {
  countdown: {
    component: CountdownBlock,
    label: 'Cuenta regresiva',
    draggable: true,
    configurableProps: ['targetDate', 'title', 'variant'],
  },
  map: {
    component: MapBlock,
    label: 'Mapa',
    draggable: true,
    configurableProps: ['locationName', 'address', 'mapUrl'],
  },
  timeline: {
    component: TimelineBlock,
    label: 'Bitácora',
    draggable: true,
    configurableProps: ['title', 'items'],
  },
  story: {
    component: StoryBlock,
    label: 'Historia',
    draggable: true,
    configurableProps: ['title', 'message'],
  },
  rsvp: {
    component: RSVPBlock,
    label: 'Confirmación',
    draggable: true,
    configurableProps: ['title', 'buttonLabel'],
  },
  gallery: {
    component: GalleryBlock,
    label: 'Galería',
    draggable: true,
    configurableProps: ['title', 'images'],
  },
};

export function getBlockConfig(type) {
  return blockRegistry[type] || null;
}
