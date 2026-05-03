import CountdownBlock from './CountdownBlock/CountdownBlock.vue';
import CountdownConfig from './CountdownBlock/config';
import MapBlock from './MapBlock/MapBlock.vue';
import MapConfig from './MapBlock/config';
import TimelineBlock from './TimelineBlock/TimelineBlock.vue';
import TimelineConfig from './TimelineBlock/config';
import StoryBlock from './StoryBlock/StoryBlock.vue';
import StoryConfig from './StoryBlock/config';
import RSVPBlock from './RSVPBlock/RSVPBlock.vue';
import RSVPConfig from './RSVPBlock/config';

// Central block registry:
// - Enables future drag-and-drop editor composition.
// - Allows templates/builders to render blocks dynamically by type.
export const blockRegistry = {
  countdown: { component: CountdownBlock, config: CountdownConfig },
  map: { component: MapBlock, config: MapConfig },
  timeline: { component: TimelineBlock, config: TimelineConfig },
  story: { component: StoryBlock, config: StoryConfig },
  rsvp: { component: RSVPBlock, config: RSVPConfig },
};
