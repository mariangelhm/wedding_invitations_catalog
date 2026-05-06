<script setup>
import * as Vue from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import { blockRegistry as reusableBlockRegistry, getBlockConfig } from '../../../../components/blocks/index.js';
import { romanticMotionConfig } from './romanticMotion.config';
import './romanticMotionTemplate.css';

const { computed, nextTick, ref, watch } = Vue;

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });

const UnsupportedBlock = {
  props: { block: { type: Object, default: () => ({}) } },
  template: `<section class="unsupported-block"><strong>Extra no soportado</strong><span>{{ block?.type || block?.id || 'desconocido' }}</span></section>`,
};
const blockRegistry = Object.fromEntries(Object.entries(reusableBlockRegistry).map(([type, config]) => [type, config.component]));

const templateDefaults = romanticMotionConfig.defaults;
const sampleImages = romanticMotionConfig.sampleImages;

const fallbackEditorialTokens = {
  pageBg: '#F4F1EA',
  sectionBg: '#FFFFFF',
  sectionAltBg: '#F4F1EA',
  heroBg: 'linear-gradient(135deg, #4D4A43 0%, #303030 100%)',
  heroOverlay: 'rgba(0,0,0,0.30)',
  heroText: '#FFFFFF',
  titleText: '#303030',
  bodyText: '#575757',
  mutedText: '#757575',
  accent: '#303030',
  accentContrast: '#FFFFFF',
  surfaceBg: '#FFFFFF',
  surfaceText: '#303030',
  border: '#E6E2D8',
  buttonBg: '#303030',
  buttonText: '#FFFFFF',
  buttonHoverBg: '#1A1A1A',
  buttonHoverText: '#FFFFFF',
  rsvpBg: '#EFEBE9',
  rsvpText: '#2F2E2E',
  footerBg: '#1A1A1A',
  footerText: '#FFFFFF',
  quoteBg: '#E8E3DB',
  quoteBackground: 'linear-gradient(135deg, #4D4A43 0%, #303030 100%)',
  quoteOverlay: 'rgba(0,0,0,0.25)',
  quoteText: '#FFFFFF',
  heroButtonBorder: '#FFFFFF',
  heroButtonText: '#FFFFFF',
  heroButtonHoverBg: '#FFFFFF',
  heroButtonHoverText: '#1A1A1A',
};

const base = computed(() => ({ ...templateDefaults.base, ...(props.invitationData?.base || {}) }));
const defaultDetails = computed(() => ({
  ceremony: {
    title: templateDefaults.details.ceremony?.title || templateDefaults.details.ceremonyTitle || 'Ceremonia',
    dateTime: templateDefaults.details.ceremony?.dateTime || templateDefaults.details.ceremonyDate || base.value.eventDate || '2027-06-14T18:00',
    location: templateDefaults.details.ceremony?.location || templateDefaults.details.ceremonyLocation || 'Rose Garden Hall',
  },
  reception: {
    title: templateDefaults.details.reception?.title || templateDefaults.details.receptionTitle || 'Celebración',
    dateTime: templateDefaults.details.reception?.dateTime || templateDefaults.details.receptionDate || base.value.eventDate || '2027-06-14T21:00',
    location: templateDefaults.details.reception?.location || templateDefaults.details.receptionLocation || 'Santiago, Chile',
  },
}));
const details = computed(() => ({ ...templateDefaults.details, ...(props.invitationData?.details || {}) }));
const ceremony = computed(() => ({
  ...defaultDetails.value.ceremony,
  ...(props.invitationData?.details?.ceremony || {}),
  title: props.invitationData?.details?.ceremony?.title ?? props.invitationData?.details?.ceremonyTitle ?? defaultDetails.value.ceremony.title,
  dateTime: props.invitationData?.details?.ceremony?.dateTime ?? props.invitationData?.details?.ceremonyDate ?? defaultDetails.value.ceremony.dateTime,
  location: props.invitationData?.details?.ceremony?.location ?? props.invitationData?.details?.ceremonyLocation ?? defaultDetails.value.ceremony.location,
}));
const reception = computed(() => ({
  ...defaultDetails.value.reception,
  ...(props.invitationData?.details?.reception || {}),
  title: props.invitationData?.details?.reception?.title ?? props.invitationData?.details?.receptionTitle ?? defaultDetails.value.reception.title,
  dateTime: props.invitationData?.details?.reception?.dateTime ?? props.invitationData?.details?.receptionDate ?? defaultDetails.value.reception.dateTime,
  location: props.invitationData?.details?.reception?.location ?? props.invitationData?.details?.receptionLocation ?? defaultDetails.value.reception.location,
}));
const userMap = computed(() => ({ ...templateDefaults.map, ...(props.invitationData?.mapSettings || {}), ...(props.invitationData?.map || {}) }));
const faqItems = computed(() => (Array.isArray(props.invitationData?.faq) && props.invitationData.faq.length ? props.invitationData.faq : templateDefaults.faq).map((item, index) => ({
  id: item.id || `faq-${index + 1}`,
  question: item.question || item.q || '',
  answer: item.answer || item.a || '',
})));
const userImages = computed(() => ({ ...templateDefaults.images, ...(props.invitationData?.images || {}) }));
const styles = computed(() => props.invitationData?.styles || {});
const tokens = computed(() => ({ ...fallbackEditorialTokens, ...(styles.value?.themeTokens || {}) }));
const styleColors = computed(() => styles.value?.colors || {});
const styleFonts = computed(() => styles.value?.fonts || {});
const allBlocks = computed(() => props.invitationData?.blocks || []);
const enabledBlocks = computed(() => allBlocks.value
  .filter((block) => block.enabled === true)
  .slice()
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)));
const findBlockByTypeOrId = (type, id) => allBlocks.value.find((block) => block.id === id || block.type === type) || null;
const countdownBlock = computed(() => findBlockByTypeOrId('countdown_wedding', 'countdown-wedding') || findBlockByTypeOrId('countdown', 'countdown-main'));
const storyBlock = computed(() => findBlockByTypeOrId('story', 'story'));
const galleryBlock = computed(() => findBlockByTypeOrId('gallery', 'gallery'));
const mapBlock = computed(() => findBlockByTypeOrId('map', 'map'));
const rsvpBlock = computed(() => findBlockByTypeOrId('rsvp', 'rsvp'));
const mapBlockSettings = computed(() => mapBlock.value?.settings || {});
const withoutEmptyValues = (value) => Object.fromEntries(Object.entries(value || {}).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null && entryValue !== ''));
const mapSettings = computed(() => ({ ...userMap.value, ...withoutEmptyValues(mapBlockSettings.value) }));
const generatedMapEmbedUrl = computed(() => {
  const query = mapSettings.value.address || base.value.locationAddress || mapSettings.value.locationName || base.value.locationName;
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : templateDefaults.map.embedUrl;
});
const resolvedMapEmbedUrl = computed(() => mapSettings.value.embedUrl || generatedMapEmbedUrl.value);
const galleryImages = computed(() => {
  const configuredImages = galleryBlock.value?.settings?.images;
  if (Array.isArray(configuredImages) && configuredImages.some((image) => image?.src)) return configuredImages;
  return Array.isArray(userImages.value.galleryImages) && userImages.value.galleryImages.length
    ? userImages.value.galleryImages
    : sampleImages.map((src, index) => ({ src, alt: `Foto de boda ${index + 1}` }));
});
const imageSrc = (field, fallbackIndex) => userImages.value?.[field] || sampleImages[fallbackIndex];

const fixedBlockIds = ['countdown-main', 'countdown-wedding', 'story', 'gallery', 'map', 'rsvp'];
const fixedBlockTypes = ['countdown', 'countdown_wedding', 'story', 'gallery', 'map', 'rsvp'];
const dynamicExtraBlocks = computed(() => (props.invitationData?.blocks || [])
  .filter((block) => block.enabled === true)
  .filter((block) => !fixedBlockIds.includes(block.id) && !fixedBlockTypes.includes(block.type))
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)));
const blockComponent = (type) => blockRegistry[type] || getBlockConfig(type)?.component || UnsupportedBlock;
const blockProps = (block) => ({ ...(block.props || {}), ...(block.settings || {}) });

const names = computed(() => base.value.coupleNames || base.value.names || templateDefaults.base.coupleNames);
const nameParts = computed(() => names.value.split('&').map((part) => part.trim()).filter(Boolean));
const initials = computed(() => nameParts.value.map((part) => part[0] || '').join(' & ').toUpperCase() || 'M & C');
const eventLocation = computed(() => base.value.locationName || base.value.location || mapSettings.value.locationName || templateDefaults.base.locationName);
const eventAddress = computed(() => base.value.locationAddress || mapSettings.value.address || eventLocation.value);
const eventDate = computed(() => base.value.eventDate || base.value.date || templateDefaults.base.eventDate);
const countdownTargetDate = computed(() => base.value.countdownTargetDate || eventDate.value);
const hasTime = (value) => /T\d{2}:\d{2}/.test(String(value || ''));
const formatEventDateTime = (value) => {
  const dateValue = value || eventDate.value;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue || '';
  const formatted = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  if (!hasTime(dateValue)) return formatted;
  const time = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${formatted} · ${time}`;
};
const formattedDate = computed(() => formatEventDateTime(eventDate.value));
const ceremonyDate = computed(() => formatEventDateTime(ceremony.value.dateTime || eventDate.value));
const receptionDate = computed(() => formatEventDateTime(reception.value.dateTime || eventDate.value));
const activePreviewTarget = computed(() => props.invitationData?.activePreviewTarget || null);

const hasCustomBackground = computed(() => Boolean(styleColors.value.backgroundColor));
const themeVars = computed(() => {
  const backgroundColor = styleColors.value.backgroundColor || tokens.value.pageBg;

  return {
  '--theme-page-bg': backgroundColor,
  '--theme-section-bg': styleColors.value.backgroundColor || tokens.value.sectionBg,
  '--theme-section-alt-bg': styleColors.value.backgroundColor || tokens.value.sectionAltBg,
  '--theme-hero-bg': tokens.value.heroBg,
  '--theme-hero-overlay': tokens.value.heroOverlay,
  '--theme-hero-text': tokens.value.heroText,
  '--theme-title-text': styleColors.value.titleColor || tokens.value.titleText,
  '--theme-body-text': styleColors.value.bodyColor || tokens.value.bodyText,
  '--theme-muted-text': tokens.value.mutedText,
  '--theme-accent': styleColors.value.accentColor || tokens.value.accent,
  '--theme-accent-contrast': tokens.value.accentContrast,
  '--theme-surface-bg': tokens.value.surfaceBg,
  '--theme-surface-text': tokens.value.surfaceText,
  '--theme-border': tokens.value.border,
  '--theme-button-bg': styleColors.value.buttonColor || tokens.value.buttonBg,
  '--theme-button-text': styleColors.value.buttonTextColor || tokens.value.buttonText,
  '--theme-button-hover-bg': tokens.value.buttonHoverBg,
  '--theme-button-hover-text': tokens.value.buttonHoverText,
  '--theme-rsvp-bg': tokens.value.rsvpBg,
  '--theme-rsvp-text': tokens.value.rsvpText,
  '--theme-footer-bg': tokens.value.footerBg,
  '--theme-footer-text': tokens.value.footerText,
  '--theme-hero-button-border': tokens.value.heroButtonBorder,
  '--theme-hero-button-text': tokens.value.heroButtonText,
  '--theme-hero-button-hover-bg': tokens.value.heroButtonHoverBg,
  '--theme-hero-button-hover-text': tokens.value.heroButtonHoverText,
  '--theme-quote-bg': tokens.value.quoteBackground || tokens.value.quoteBg || tokens.value.sectionAltBg,
  '--theme-quote-text': tokens.value.quoteText || tokens.value.heroText,
  '--theme-quote-overlay': tokens.value.quoteOverlay || tokens.value.heroOverlay,
  '--custom-page-bg': backgroundColor,
  '--custom-section-bg': styleColors.value.backgroundColor || tokens.value.sectionBg || '#FFFFFF',
  '--custom-section-alt-bg': styleColors.value.backgroundColor || tokens.value.sectionAltBg || '#F4F1EA',
  '--custom-title-color': styleColors.value.titleColor || tokens.value.titleText || '#303030',
  '--custom-names-color': styleColors.value.namesColor || styleColors.value.titleColor || tokens.value.titleText || '#303030',
  '--custom-body-color': styleColors.value.bodyColor || tokens.value.bodyText || '#575757',
  '--custom-accent-color': styleColors.value.accentColor || tokens.value.accent || '#303030',
  '--custom-button-bg': styleColors.value.buttonColor || tokens.value.buttonBg || '#303030',
  '--custom-button-text': styleColors.value.buttonTextColor || tokens.value.buttonText || '#FFFFFF',
  '--font-names': styleFonts.value.namesFont || styles.value.coupleFontFamily || 'Playfair Display',
  '--font-headings': styleFonts.value.headingsFont || 'Playfair Display',
  '--font-body': styleFonts.value.bodyFont || styles.value.bodyFontFamily || 'Montserrat',
  '--template-title-color': styleColors.value.titleColor || tokens.value.titleText,
  '--template-body-color': styleColors.value.bodyColor || tokens.value.bodyText,
  '--template-muted-color': tokens.value.mutedText,
  '--template-countdown-number': tokens.value.titleText,
  '--template-countdown-label': tokens.value.mutedText,
  '--template-rsvp-bg': tokens.value.rsvpBg,
  '--template-rsvp-text': tokens.value.rsvpText,
  '--template-primary': tokens.value.accent,
  '--template-accent': tokens.value.accent,
  '--template-surface': tokens.value.surfaceBg,
  '--template-surface-text': tokens.value.surfaceText,
  '--template-border-color': tokens.value.border,
  '--template-link-color': tokens.value.accent,
};
});

const headerScrolled = ref(false);
const menuOpen = ref(false);
const openFaq = ref(-1);
const templateRoot = ref(null);
const revealRefs = ref([]);
let observer = null;
let removeScrollListener = null;

const setRevealRef = (el) => {
  if (el && !revealRefs.value.includes(el)) revealRefs.value.push(el);
};


watch(activePreviewTarget, async (target) => {
  if (!target || !templateRoot.value) return;
  await nextTick();
  const section = templateRoot.value.querySelector(`[data-preview-target="${target}"]`);
  if (!section) return;
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, { flush: 'post' });

const getTemplateScrollParent = () => {
  let parent = templateRoot.value?.parentElement;

  while (parent) {
    const overflowY = window.getComputedStyle(parent).overflowY;
    if (/(auto|scroll|overlay)/.test(overflowY)) return parent;
    parent = parent.parentElement;
  }

  return window;
};

Vue.onMounted(() => {
  const scrollParent = getTemplateScrollParent();
  const onScroll = () => {
    headerScrolled.value = scrollParent === window ? window.scrollY > 16 : scrollParent.scrollTop > 16;
  };

  scrollParent.addEventListener('scroll', onScroll, { passive: true });
  removeScrollListener = () => scrollParent.removeEventListener('scroll', onScroll);
  onScroll();

  if (sampleImages.some((image) => !image)) {
    console.error('Romantic Motion sample images failed to load', sampleImages);
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealRefs.value.forEach((el) => observer?.observe(el));
});

Vue.onUnmounted(() => {
  observer?.disconnect();
  removeScrollListener?.();
});
</script>

<template>
  <div class="romantic-template-viewport">
    <div ref="templateRoot" class="romantic-template" :class="{ 'has-custom-background': hasCustomBackground }" :style="themeVars">
    <header class="romantic-template__header" :class="{ scrolled: headerScrolled }">
      <div class="romantic-template__header-inner romantic-template__container">
        <a class="romantic-template__initials romantic-template__logo" href="#home">{{ initials }}</a>
        <nav class="romantic-template__nav" :class="{ open: menuOpen }" aria-label="Navegación de la invitación">
          <a href="#story" @click="menuOpen = false">Nosotros</a>
          <a href="#details" @click="menuOpen = false">Detalles</a>
          <a href="#gallery" @click="menuOpen = false">Momentos</a>
          <a href="#map" @click="menuOpen = false">P&R</a>
          <a href="#rsvp" @click="menuOpen = false">RSVP</a>
        </nav>
        <button class="romantic-template__hamburger romantic-template__mobile-toggle" type="button" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <section id="home" class="romantic-template__hero hero" data-preview-target="hero" :class="{ 'is-preview-focused': activePreviewTarget === 'hero' }">
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="romantic-template__hero-grid romantic-template__container">
        <div class="romantic-template__hero-content motion-left" :ref="setRevealRef">
          <p class="eyebrow romantic-template__hero-eyebrow">Nos vamos a casar</p>
          <h1 class="romantic-template__hero-names">{{ names }}</h1>
          <div class="hero-divider" aria-hidden="true"></div>
          <p class="hero-meta">{{ formattedDate }} · {{ eventLocation }}</p>
          <p class="hero-message">{{ base.message }}</p>
          <a href="#rsvp" class="romantic-btn romantic-btn--ghost">Confirmar asistencia</a>
        </div>
        <div class="romantic-template__hero-media motion-right" :ref="setRevealRef">
          <div class="romantic-template__hero-circle" aria-hidden="true"></div>
          <img :src="imageSrc('heroImage', 0)" alt="Retrato editorial de boda" />
          <div class="romantic-template__hero-caption">{{ initials }}</div>
        </div>
      </div>
      <span class="hero-scroll-indicator" aria-hidden="true"></span>
    </section>

    <section v-if="storyBlock?.enabled" id="story" class="romantic-template__story story motion-section" data-preview-target="story" :class="{ 'is-preview-focused': activePreviewTarget === 'story' }" :ref="setRevealRef">
      <div class="romantic-template__story-grid romantic-template__container">
        <div class="romantic-template__story-content motion-left" :ref="setRevealRef">
          <p class="eyebrow">Nuestra historia</p>
          <h2 class="romantic-section-title romantic-template__section-title romantic-template__story-title">Un sí para celebrar con quienes más queremos</h2>
          <p>{{ storyBlock?.settings?.message || base.storyMessage || templateDefaults.base.storyMessage }}</p>
        </div>
        <div class="romantic-template__story-media motion-right" :ref="setRevealRef">
          <img :src="imageSrc('storyImage', 1)" alt="Momento romántico de la pareja" />
          <div class="story-monogram">{{ initials }}</div>
        </div>
      </div>
    </section>

    <!-- TODO: Move this pattern to a reusable ParallaxBlock extra later. Props should be: imageUrl, height, overlayOpacity, mobileHeight, backgroundPosition. -->
    <section
      class="romantic-parallax motion-section" data-preview-target="story"
      :ref="setRevealRef"
      :style="{ '--parallax-image': `url(${imageSrc('parallaxImage', 3)})` }"
      aria-label="Imagen destacada de la pareja"
    ></section>

    <section v-if="countdownBlock?.enabled" class="romantic-template__countdown romantic-section motion-section" data-preview-target="countdown" :class="{ 'is-preview-focused': activePreviewTarget === 'countdown' }" :ref="setRevealRef">
      <CountdownBlock
        :block="countdownBlock"
        v-bind="blockProps(countdownBlock)"
        :target-date="countdownBlock?.settings?.targetDate || countdownTargetDate"
        :title="countdownBlock?.settings?.title || 'Cuenta regresiva'"
        variant="editorial"
      />
    </section>

    <section id="details" class="romantic-template__details details motion-section" data-preview-target="details" :class="{ 'is-preview-focused': activePreviewTarget === 'details' }" :ref="setRevealRef">
      <div class="section-heading romantic-template__container">
        <p class="eyebrow">Cuándo y dónde</p>
        <h2 class="romantic-section-title romantic-template__section-title">Todo lo importante para acompañarnos</h2>
      </div>
      <div class="romantic-template__details-grid romantic-template__container">
        <div class="romantic-template__details-list">
          <article class="romantic-template__detail-card">
            <span>01</span>
            <h3 class="romantic-template__detail-title">{{ ceremony.title }}</h3>
            <p>{{ ceremonyDate }}</p>
            <p>{{ ceremony.location || eventLocation }}</p>
            <a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank" rel="noreferrer">Ver mapa</a>
          </article>
          <article class="romantic-template__detail-card romantic-template__detail-card--accent">
            <span>02</span>
            <h3 class="romantic-template__detail-title">{{ reception.title }}</h3>
            <p>{{ receptionDate }}</p>
            <p>{{ reception.location || eventAddress }}</p>
            <a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank" rel="noreferrer">Ver mapa</a>
          </article>
        </div>
        <div class="romantic-template__details-visual">
          <img :src="imageSrc('detailsImage', 4)" alt="Mesa decorada para celebración de boda" />
        </div>
      </div>
    </section>

    <section id="gallery" class="romantic-template__quote-break gallery motion-section" data-preview-target="gallery" :class="{ 'is-preview-focused': activePreviewTarget === 'gallery' }" :ref="setRevealRef" :style="{ '--motion-parallax-image': `url(${sampleImages[2]})` }">
      <p>Cada historia de amor merece celebrarse</p>
    </section>

    <section v-if="galleryBlock?.enabled" class="romantic-template__gallery gallery romantic-section motion-section" data-preview-target="gallery" :class="{ 'is-preview-focused': activePreviewTarget === 'gallery' }" :ref="setRevealRef">
      <GalleryBlock :block="galleryBlock" v-bind="blockProps(galleryBlock)" :images="galleryImages" :title="galleryBlock?.settings?.title || 'Galería'" integrated />
    </section>

    <section v-if="rsvpBlock?.enabled" id="rsvp" class="romantic-template__rsvp romantic-section motion-section" data-preview-target="rsvp" :class="{ 'is-preview-focused': activePreviewTarget === 'rsvp' }" :ref="setRevealRef">
      <div class="rsvp-intro">
        <p class="eyebrow">RSVP</p>
        <h2 class="romantic-section-title romantic-template__section-title">Confirma tu asistencia</h2>
        <p>Tu respuesta nos ayuda a preparar cada detalle de esta celebración.</p>
      </div>
      <RSVPBlock
        :block="rsvpBlock"
        v-bind="blockProps(rsvpBlock)"
        :title="rsvpBlock?.settings?.title || 'Confirma tu asistencia'"
        :button-label="rsvpBlock?.settings?.buttonLabel || 'Enviar confirmación'"
      />
    </section>

    <section v-if="mapBlock?.enabled" id="map" class="romantic-template__map-faq romantic-template__map-faq-grid romantic-template__container motion-section" data-preview-target="map" :class="{ 'is-preview-focused': activePreviewTarget === 'map' || activePreviewTarget === 'faq' }" :ref="setRevealRef">
      <div class="romantic-section map-wrap">
        <p class="eyebrow">Ubicación</p>
        <MapBlock
          :block="mapBlock"
          v-bind="blockProps(mapBlock)"
          :location-name="mapSettings.locationName || eventLocation"
          :address="mapSettings.address || ''"
          :map-url="mapSettings.mapUrl || ''"
          :embed-url="resolvedMapEmbedUrl"
        />
      </div>
      <div class="faq" data-preview-target="faq" :class="{ 'is-preview-focused': activePreviewTarget === 'faq' }">
        <p class="eyebrow">Información útil</p>
        <h2 class="romantic-section-title romantic-template__section-title">Preguntas frecuentes</h2>
        <article v-for="(item, i) in faqItems" :key="item.id" class="faq-item" :class="{ open: openFaq === i }">
          <button class="faq-trigger" type="button" @click="openFaq = openFaq === i ? -1 : i">
            <span>{{ item.question }}</span>
            <span class="faq-icon">{{ openFaq === i ? '−' : '+' }}</span>
          </button>
          <div class="faq-answer" :style="{ maxHeight: openFaq === i ? '140px' : '0px' }">
            <p>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </section>

    <section v-if="dynamicExtraBlocks.length" class="romantic-template__dynamic-extras romantic-section motion-section" data-preview-target="extras" :class="{ 'is-preview-focused': activePreviewTarget === 'extras' }" :ref="setRevealRef">
      <component
        :is="blockComponent(block.type)"
        v-for="block in dynamicExtraBlocks"
        :key="`${block.id}-${block.type}-${block.enabled}`"
        :block="block"
        v-bind="blockProps(block)"
      />
    </section>

    <footer class="romantic-template__footer">
      <p class="footer-monogram">{{ initials }}</p>
      <p>{{ formattedDate }}</p>
      <p>Gracias por ser parte de nuestra historia</p>
    </footer>
    </div>
  </div>
</template> 