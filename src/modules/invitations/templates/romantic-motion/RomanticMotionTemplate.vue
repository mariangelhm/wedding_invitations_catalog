<script setup>
import * as Vue from 'vue';
import CountdownBlock from '../../../../components/blocks/CountdownBlock/CountdownBlock.vue';
import GalleryBlock from '../../../../components/blocks/GalleryBlock/GalleryBlock.vue';
import MapBlock from '../../../../components/blocks/MapBlock/MapBlock.vue';
import RSVPBlock from '../../../../components/blocks/RSVPBlock/RSVPBlock.vue';
import './romanticMotionTemplate.css';

const { computed, ref } = Vue;

const props = defineProps({ invitationData: { type: Object, default: () => ({}) } });

/**
 * 👇 AQUÍ defines tus imágenes locales/manuales.
 * Deben existir en /public/assets/sample-gallery/
 * Ejemplo: public/assets/sample-gallery/wedding-1.jpg
 */
const sampleImages = [
  '/assets/sample-gallery/wedding-1.jpg',
  '/assets/sample-gallery/wedding-2.jpg',
  '/assets/sample-gallery/wedding-3.jpg',
  '/assets/sample-gallery/wedding-4.jpg',
  '/assets/sample-gallery/wedding-5.jpg',
  '/assets/sample-gallery/wedding-6.jpg',
  '/assets/sample-gallery/wedding-7.jpg',
];

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

const base = computed(() => props.invitationData?.base || {});
const styles = computed(() => props.invitationData?.styles || {});
const tokens = computed(() => ({ ...fallbackEditorialTokens, ...(styles.value?.themeTokens || {}) }));
const styleColors = computed(() => styles.value?.colors || {});
const styleFonts = computed(() => styles.value?.fonts || {});
const blocks = computed(() => (props.invitationData?.blocks || []).filter((block) => block.enabled).slice().sort((a, b) => (a.order || 0) - (b.order || 0)));
const mapBlockSettings = computed(() => blockByType('map').settings || {});
const mapSettings = computed(() => ({ ...(props.invitationData?.mapSettings || {}), ...mapBlockSettings.value }));
const galleryImages = computed(() => sampleImages.map((src, index) => ({ src, alt: `Foto de boda ${index + 1}` })));

const hasBlock = (type) => blocks.value.some((block) => block.type === type);
const blockByType = (type) => blocks.value.find((block) => block.type === type) || {};

const names = computed(() => base.value.coupleNames || base.value.names || 'María & Carlos');
const nameParts = computed(() => names.value.split('&').map((part) => part.trim()).filter(Boolean));
const initials = computed(() => nameParts.value.map((part) => part[0] || '').join(' & ').toUpperCase() || 'M & C');
const eventLocation = computed(() => base.value.locationName || base.value.location || mapSettings.value.locationName || 'Rose Garden Hall');
const eventAddress = computed(() => base.value.locationAddress || mapSettings.value.address || eventLocation.value);
const eventDate = computed(() => base.value.eventDate || base.value.date || '2027-06-14T18:00:00');
const formattedDate = computed(() => new Date(eventDate.value).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }));

const faqs = [
  { q: '¿Puedo llevar acompañante?', a: 'Sí, puedes indicarlo en el formulario RSVP.' },
  { q: '¿Cuál es el código de vestimenta?', a: 'Formal elegante.' },
  { q: '¿Hasta cuándo puedo confirmar?', a: 'Hasta una semana antes del evento.' },
  { q: '¿Hay estacionamiento?', a: 'Sí, hay estacionamiento disponible en el lugar.' },
];

const themeVars = computed(() => ({
  '--theme-page-bg': styleColors.value.backgroundColor || tokens.value.pageBg,
  '--theme-section-bg': tokens.value.sectionBg,
  '--theme-section-alt-bg': tokens.value.sectionAltBg,
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
  '--custom-title-color': styleColors.value.titleColor || tokens.value.titleText || '#303030',
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
}));

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
    <div ref="templateRoot" class="romantic-template" :style="themeVars">
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

    <section id="home" class="romantic-template__hero hero">
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="romantic-template__hero-grid romantic-template__container">
        <div class="romantic-template__hero-content motion-left" :ref="setRevealRef">
          <p class="eyebrow romantic-template__hero-eyebrow">Nos vamos a casar</p>
          <h1 class="romantic-template__hero-names">{{ names }}</h1>
          <div class="hero-divider" aria-hidden="true"></div>
          <p class="hero-meta">{{ formattedDate }} · {{ eventLocation }}</p>
          <a href="#rsvp" class="romantic-btn romantic-btn--ghost">Confirmar asistencia</a>
        </div>
        <div class="romantic-template__hero-media motion-right" :ref="setRevealRef">
          <div class="romantic-template__hero-circle" aria-hidden="true"></div>
          <img :src="sampleImages[0]" alt="Retrato editorial de boda" />
          <div class="romantic-template__hero-caption">{{ initials }}</div>
        </div>
      </div>
      <span class="hero-scroll-indicator" aria-hidden="true"></span>
    </section>

    <section v-if="hasBlock('story')" id="story" class="romantic-template__story story motion-section" :ref="setRevealRef">
      <div class="romantic-template__story-grid romantic-template__container">
        <div class="romantic-template__story-content motion-left" :ref="setRevealRef">
          <p class="eyebrow">Nuestra historia</p>
          <h2 class="romantic-section-title romantic-template__section-title romantic-template__story-title">Un sí para celebrar con quienes más queremos</h2>
          <p>{{ blockByType('story').settings?.message || base.storyMessage || 'Nuestra historia merece celebrarse contigo. Te esperamos para compartir una noche íntima, alegre y llena de detalles que recuerden este comienzo.' }}</p>
        </div>
        <div class="romantic-template__story-media motion-right" :ref="setRevealRef">
          <img :src="sampleImages[1]" alt="Momento romántico de la pareja" />
          <div class="story-monogram">{{ initials }}</div>
        </div>
      </div>
    </section>

    <!-- TODO: Move this pattern to a reusable ParallaxBlock extra later. Props should be: imageUrl, height, overlayOpacity, mobileHeight, backgroundPosition. -->
    <section
      class="romantic-parallax motion-section"
      :ref="setRevealRef"
      :style="{ '--parallax-image': `url(${sampleImages[3]})` }"
      aria-label="Imagen destacada de la pareja"
    ></section>

    <section v-if="hasBlock('countdown_wedding')" class="romantic-template__countdown romantic-section motion-section" :ref="setRevealRef">
      <CountdownBlock
        :target-date="blockByType('countdown_wedding').settings?.targetDate || eventDate"
        :title="blockByType('countdown_wedding').settings?.title || 'Cuenta regresiva'"
        variant="editorial"
      />
    </section>

    <section id="details" class="romantic-template__details details motion-section" :ref="setRevealRef">
      <div class="section-heading romantic-template__container">
        <p class="eyebrow">Cuándo y dónde</p>
        <h2 class="romantic-section-title romantic-template__section-title">Todo lo importante para acompañarnos</h2>
      </div>
      <div class="romantic-template__details-grid romantic-template__container">
        <div class="romantic-template__details-list">
          <article class="romantic-template__detail-card">
            <span>01</span>
            <h3 class="romantic-template__detail-title">Ceremonia</h3>
            <p>{{ formattedDate }}</p>
            <p>{{ eventLocation }}</p>
            <a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank" rel="noreferrer">Ver mapa</a>
          </article>
          <article class="romantic-template__detail-card romantic-template__detail-card--accent">
            <span>02</span>
            <h3 class="romantic-template__detail-title">Celebración</h3>
            <p>{{ formattedDate }}</p>
            <p>{{ eventAddress }}</p>
            <a class="romantic-link" :href="mapSettings.mapUrl || '#'" target="_blank" rel="noreferrer">Ver mapa</a>
          </article>
        </div>
        <div class="romantic-template__details-visual">
          <img :src="sampleImages[4]" alt="Mesa decorada para celebración de boda" />
        </div>
      </div>
    </section>

    <section id="gallery" class="romantic-template__quote-break gallery motion-section" :ref="setRevealRef" :style="{ '--motion-parallax-image': `url(${sampleImages[2]})` }">
      <p>Cada historia de amor merece celebrarse</p>
    </section>

    <section v-if="hasBlock('gallery')" class="romantic-template__gallery gallery romantic-section motion-section" :ref="setRevealRef">
      <GalleryBlock :images="galleryImages" :title="blockByType('gallery').settings?.title || 'Galería'" integrated />
    </section>

    <section v-if="hasBlock('rsvp')" id="rsvp" class="romantic-template__rsvp romantic-section motion-section" :ref="setRevealRef">
      <div class="rsvp-intro">
        <p class="eyebrow">RSVP</p>
        <h2 class="romantic-section-title romantic-template__section-title">Confirma tu asistencia</h2>
        <p>Tu respuesta nos ayuda a preparar cada detalle de esta celebración.</p>
      </div>
      <RSVPBlock
        :title="blockByType('rsvp').settings?.title || 'Confirma tu asistencia'"
        :button-label="blockByType('rsvp').settings?.buttonLabel || 'Enviar confirmación'"
      />
    </section>

    <section v-if="hasBlock('map')" id="map" class="romantic-template__map-faq romantic-template__map-faq-grid romantic-template__container motion-section" :ref="setRevealRef">
      <div class="romantic-section map-wrap">
        <p class="eyebrow">Ubicación</p>
        <MapBlock
          :location-name="mapSettings.locationName || eventLocation"
          :address="mapSettings.address || ''"
          :map-url="mapSettings.mapUrl || ''"
          :embed-url="mapSettings.embedUrl || ''"
        />
      </div>
      <div class="faq">
        <p class="eyebrow">Información útil</p>
        <h2 class="romantic-section-title romantic-template__section-title">Preguntas frecuentes</h2>
        <article v-for="(item, i) in faqs" :key="item.q" class="faq-item" :class="{ open: openFaq === i }">
          <button class="faq-trigger" type="button" @click="openFaq = openFaq === i ? -1 : i">
            <span>{{ item.q }}</span>
            <span class="faq-icon">{{ openFaq === i ? '−' : '+' }}</span>
          </button>
          <div class="faq-answer" :style="{ maxHeight: openFaq === i ? '140px' : '0px' }">
            <p>{{ item.a }}</p>
          </div>
        </article>
      </div>
    </section>

    <footer class="romantic-template__footer">
      <p class="footer-monogram">{{ initials }}</p>
      <p>{{ formattedDate }}</p>
      <p>Gracias por ser parte de nuestra historia</p>
    </footer>
    </div>
  </div>
</template> 