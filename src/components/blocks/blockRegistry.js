import CountdownBlock from './CountdownBlock/CountdownBlock.vue';
import MapBlock from './MapBlock/MapBlock.vue';
import TimelineBlock from './TimelineBlock/TimelineBlock.vue';
import StoryBlock from './StoryBlock/StoryBlock.vue';
import RSVPBlock from './RSVPBlock/RSVPBlock.vue';
import GalleryBlock from './GalleryBlock/GalleryBlock.vue';
import UnsupportedBlock from './UnsupportedBlock.vue';

export const DEBUG_BUILDER = true;

export function debugGroup(label, payload = {}) {
  if (!DEBUG_BUILDER) return;

  try {
    console.group(`[BUILDER DEBUG] ${label}`);
    Object.entries(payload).forEach(([key, value]) => {
      console.log(key, value);
    });
    console.groupEnd();
  } catch (error) {
    console.error(`[BUILDER DEBUG] Failed logging ${label}`, error);
  }
}

export function debugError(label, error, context = {}) {
  console.error(`[BUILDER ERROR] ${label}`, {
    error,
    context,
  });
}

export const BLOCK_TYPE_ALIASES = {
  countdown_wedding: 'countdown',
  countdown_rsvp: 'countdown',
  countdown_confirmation: 'countdown',
  bitacora: 'timeline',
  timeline: 'timeline',
  story: 'story',
  gallery: 'gallery',
  map: 'map',
  rsvp: 'rsvp',
  registry: 'registry',
  music: 'music',
  parallax: 'parallax',
};

export function normalizeBlockType(type) {
  return BLOCK_TYPE_ALIASES[type] || type;
}

// Extras are reusable blocks that can be enabled/ordered across templates.
// This registry is the base for future drag & drop assembly flows in the editor.
// Each block declares which props are configurable from editor interfaces.
export const blockRegistry = {
  countdown: {
    component: CountdownBlock,
    label: 'Cuenta regresiva',
    previewType: 'countdown',
    draggable: true,
    configurableProps: ['targetDate', 'title', 'variant'],
  },
  map: {
    component: MapBlock,
    label: 'Mapa',
    previewType: 'map',
    draggable: true,
    configurableProps: ['locationName', 'address', 'mapUrl', 'embedUrl'],
  },
  timeline: {
    component: TimelineBlock,
    label: 'Bitácora',
    previewType: 'timeline',
    draggable: true,
    configurableProps: ['title', 'items'],
  },
  story: {
    component: StoryBlock,
    label: 'Historia',
    previewType: 'story',
    draggable: true,
    configurableProps: ['title', 'message'],
  },
  rsvp: {
    component: RSVPBlock,
    label: 'Confirmación',
    previewType: 'rsvp',
    draggable: true,
    configurableProps: ['title', 'buttonLabel'],
  },
  gallery: {
    component: GalleryBlock,
    label: 'Galería',
    previewType: 'gallery',
    draggable: true,
    configurableProps: ['title', 'images'],
  },
};

export function resolveBlockComponent(block) {
  try {
    const normalizedType = normalizeBlockType(block?.type);
    const config = blockRegistry[normalizedType];
    const component = config?.component || config;

    if (!component) {
      console.warn('[BUILDER DEBUG] Missing block component', {
        block,
        normalizedType,
        availableTypes: Object.keys(blockRegistry),
      });

      return UnsupportedBlock;
    }

    debugGroup('Resolved block component', {
      id: block?.id,
      type: block?.type,
      normalizedType,
      component,
    });

    return component;
  } catch (error) {
    debugError('resolveBlockComponent failed', error, { block });
    return UnsupportedBlock;
  }
}

export function getBlockConfig(type) {
  return blockRegistry[normalizeBlockType(type)] || null;
}
