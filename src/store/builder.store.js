import { defineStore } from 'pinia';
import { themePresets } from '../modules/builder/data/themePresets';
import { romanticMotionConfig } from '../modules/invitations/templates/romantic-motion/romanticMotion.config';

const DEBUG_BUILDER = true;

const defaultCustomizableOptions = { colors: true, fonts: true, photos: true, music: false, map: true, components: true };
let previewFocusTimeout = null;

export const blockRegistry = {
  countdown_wedding: { id: 'countdown-wedding', type: 'countdown_wedding', label: 'Cuenta regresiva boda', description: 'Cuenta regresiva al evento principal.', order: 1, price: 3000, included: false, settings: { targetDate: '2027-06-14T18:00:00', title: 'Faltan para nuestra boda', variant: 'editorial' } },
  story: { id: 'story', type: 'story', label: 'Historia', description: 'Cuenta su historia de amor.', order: 2, price: 0, included: true, settings: { title: 'Nuestra historia', message: '' } },
  gallery: { id: 'gallery', type: 'gallery', label: 'Galería', description: 'Muestra fotos destacadas.', order: 3, price: 5000, included: false, settings: { title: 'Nuestros momentos', images: [] } },
  timeline: { id: 'timeline', type: 'timeline', label: 'Bitácora', description: 'Agenda del evento.', order: 4, price: 2000, included: false, settings: { title: 'Cuándo y dónde', items: [] } },
  map: { id: 'map', type: 'map', label: 'Mapa', description: 'Ubicación del evento.', order: 5, price: 3000, included: false, settings: { locationName: '', address: '', mapUrl: '', embedUrl: '' } },
  countdown_rsvp: { id: 'countdown-rsvp', type: 'countdown_rsvp', label: 'Cuenta regresiva confirmación', description: 'Tiempo restante para confirmar.', order: 6, price: 2000, included: false, settings: { targetDate: '2027-05-20T23:59:59', title: 'Tiempo para confirmar', variant: 'editorial' } },
  rsvp: { id: 'rsvp', type: 'rsvp', label: 'RSVP', description: 'Confirmación de asistencia.', order: 7, price: 0, included: true, settings: { title: 'Confirma tu asistencia', buttonLabel: 'Enviar confirmación' } },
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const getTheme = (themeId = 'editorialClassic') => themePresets.find((preset) => preset.id === themeId) || themePresets.find((preset) => preset.id === 'editorialClassic') || themePresets[0] || { id: themeId, tokens: {} };
const getDefaultBlocks = (defaultBlocks = null) => {
  const defaultsByType = new Map((defaultBlocks || []).map((block) => [block.type, block]));
  return Object.values(blockRegistry).map((block) => {
    const templateBlock = defaultsByType.get(block.type) || {};
    return clone({ ...block, ...templateBlock, settings: { ...(block.settings || {}), ...(templateBlock.settings || {}) }, enabled: templateBlock.enabled ?? false, included: templateBlock.included ?? block.included ?? false });
  });
};

const romanticDefaults = romanticMotionConfig.defaults;

const normalizeBase = (base = {}, defaults = romanticDefaults.base) => ({
  coupleNames: base.coupleNames || base.names || defaults.coupleNames || '',
  eventDate: base.eventDate || base.date || defaults.eventDate || '',
  locationName: base.locationName || base.location || defaults.locationName || '',
  locationAddress: base.locationAddress || base.address || defaults.locationAddress || '',
  message: base.message || base.heroMessage || defaults.message || '',
  storyMessage: base.storyMessage || defaults.storyMessage || '',
  countdownTargetDate: base.countdownTargetDate || base.eventDate || defaults.countdownTargetDate || defaults.eventDate || '',
});

const normalizeDetails = (details = {}, defaults = romanticDefaults.details) => {
  const defaultCeremony = defaults.ceremony || {
    title: defaults.ceremonyTitle || 'Ceremonia',
    dateTime: defaults.ceremonyDate || romanticDefaults.base.eventDate,
    location: defaults.ceremonyLocation || romanticDefaults.base.locationName,
  };
  const defaultReception = defaults.reception || {
    title: defaults.receptionTitle || 'Celebración',
    dateTime: defaults.receptionDate || romanticDefaults.base.eventDate,
    location: defaults.receptionLocation || romanticDefaults.base.locationAddress,
  };
  const ceremony = {
    ...defaultCeremony,
    ...(details.ceremony || {}),
    title: details.ceremony?.title ?? details.ceremonyTitle ?? defaultCeremony.title,
    dateTime: details.ceremony?.dateTime ?? details.ceremonyDate ?? defaultCeremony.dateTime,
    location: details.ceremony?.location ?? details.ceremonyLocation ?? defaultCeremony.location,
  };
  const reception = {
    ...defaultReception,
    ...(details.reception || {}),
    title: details.reception?.title ?? details.receptionTitle ?? defaultReception.title,
    dateTime: details.reception?.dateTime ?? details.receptionDate ?? defaultReception.dateTime,
    location: details.reception?.location ?? details.receptionLocation ?? defaultReception.location,
  };

  return {
    ...defaults,
    ...details,
    ceremony,
    reception,
    ceremonyTitle: ceremony.title,
    ceremonyDate: ceremony.dateTime,
    ceremonyLocation: ceremony.location,
    receptionTitle: reception.title,
    receptionDate: reception.dateTime,
    receptionLocation: reception.location,
  };
};
const normalizeMap = (map = {}, defaults = romanticDefaults.map) => ({ ...defaults, mapSearchText: map.mapSearchText || map.locationName || map.address || defaults.locationName || '', ...map });
const normalizeFaq = (faq = [], defaults = romanticDefaults.faq) => (Array.isArray(faq) && faq.length ? faq : defaults).map((item, index) => ({
  id: item.id || `faq-${index + 1}`,
  question: item.question || item.q || '',
  answer: item.answer || item.a || '',
}));
const normalizeImages = (images = {}, defaults = romanticDefaults.images) => ({
  ...defaults,
  ...images,
  galleryImages: Array.isArray(images.galleryImages) && images.galleryImages.length ? images.galleryImages : defaults.galleryImages,
});

const buildStylesFromTheme = (theme = getTheme()) => {
  const tokens = theme.tokens || {};
  return {
    themeId: theme.id || 'editorialClassic',
    backgroundTheme: theme.id || 'editorialClassic',
    themeTokens: { ...tokens },
    colors: {
      titleColor: tokens.titleText || '#303030',
      bodyColor: tokens.bodyText || '#575757',
      accentColor: tokens.accent || '#303030',
      buttonColor: tokens.buttonBg || '#303030',
      buttonTextColor: tokens.buttonText || '#FFFFFF',
      backgroundColor: tokens.pageBg || '#F4F1EA',
      namesColor: tokens.titleText || '#303030',
    },
    fonts: {
      namesFont: 'Playfair Display',
      headingsFont: 'Playfair Display',
      bodyFont: 'Montserrat',
    },
    // Legacy aliases kept so existing UI/templates continue to read sensible values.
    primaryColor: tokens.accent || '#303030',
    secondaryColor: tokens.sectionAltBg || tokens.pageBg || '#F4F1EA',
    titleColor: tokens.titleText || '#303030',
    bodyTextColor: tokens.bodyText || '#575757',
    textColor: tokens.bodyText || '#575757',
    background: tokens.pageBg || '#F4F1EA',
    backgroundGradient: tokens.pageBg || '#F4F1EA',
    coupleFontFamily: 'Playfair Display',
    bodyFontFamily: 'Montserrat',
  };
};

const getRomanticDefaults = () => ({
  base: normalizeBase(romanticDefaults.base),
  details: normalizeDetails(),
  map: normalizeMap(),
  faq: normalizeFaq(),
  images: normalizeImages(),
  timeline: [
    { time: '17:00', title: 'Ceremonia', place: 'Jardín principal' },
    { time: '19:00', title: 'Cena', place: 'Salón principal' },
    { time: '21:00', title: 'Fiesta', place: 'Pista de baile' },
  ],
  gallery: [
    { src: '', alt: 'Foto principal' },
    { src: '', alt: 'Momento especial' },
    { src: '', alt: 'Nuestra historia' },
    { src: '', alt: 'Celebración' },
  ],
  mapSettings: {
    mapSearchText: 'Rose Garden Hall, Santiago, Chile',
    locationName: 'Rose Garden Hall',
    address: 'Santiago, Chile',
    mapUrl: 'https://maps.google.com',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1789740216627!2d-70.65865812458385!3d-33.44464339721427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a7b81bab67%3A0x7cf5cd1956dd49f7!2sTorre%20Entel!5e0!3m2!1ses-419!2scl!4v1777782339212!5m2!1ses-419!2scl',
  },
  blocks: getDefaultBlocks(romanticMotionConfig.defaultBlocks),
});

const normalizeInvitationBlocks = (blocks = []) => {
  const byType = new Map(blocks.map((block) => [block.type, block]));
  return Object.values(blockRegistry).map((defaultBlock) => {
    const existing = byType.get(defaultBlock.type) || {};
    return {
      ...clone(defaultBlock),
      ...existing,
      settings: { ...(defaultBlock.settings || {}), ...(existing.settings || {}) },
      enabled: existing.enabled ?? defaultBlock.enabled ?? false,
      included: existing.included ?? defaultBlock.included ?? false,
    };
  }).sort((a, b) => (a.order || 0) - (b.order || 0)).map((block, index) => ({ ...block, order: index + 1 }));
};

export const useBuilderStore = defineStore('builderStore', {
  state: () => ({ basePrice: 20000, invitation: null, activePreviewTarget: null }),
  getters: {
    enabledBlocksSorted: (state) => (state.invitation?.blocks || []).filter((block) => block.enabled).slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    enabledBlocksPrice: (state) => (state.invitation?.blocks || []).filter((block) => block.enabled && !block.included).reduce((sum, block) => sum + Number(block.price || 0), 0),
    totalPrice() { return (this.invitation?.basePrice || this.basePrice) + this.enabledBlocksPrice; },
  },
  actions: {
    createDraftInvitation(template = null) {
      const createdAt = new Date();
      const expiresAt = new Date(createdAt);
      expiresAt.setDate(expiresAt.getDate() + 30);
      const usesRomanticMotion = template?.id === romanticMotionConfig.templateId || template?.templateComponent === 'romantic-motion';
      const defaults = usesRomanticMotion
        ? getRomanticDefaults()
        : { base: normalizeBase({ coupleNames: '', eventDate: '', locationName: '', locationAddress: '', message: '', storyMessage: '' }, {}), details: {}, map: { mapSearchText: '', locationName: '', address: '', mapUrl: '', embedUrl: '' }, faq: [], images: {}, blocks: getDefaultBlocks(), timeline: [], gallery: [], mapSettings: { mapSearchText: '', locationName: '', address: '', mapUrl: '', embedUrl: '' } };
      const theme = getTheme('modernRustic');
      const invitation = {
        id: Date.now(),
        templateId: template?.id || null,
        status: 'draft',
        templateComponent: template?.templateComponent || null,
        templateName: template?.name || 'Invitación base',
        category: template?.category || 'general',
        level: template?.level || 'basic',
        basePrice: template?.basePrice || this.basePrice,
        base: defaults.base,
        styles: buildStylesFromTheme(theme),
        details: normalizeDetails(defaults.details),
        map: normalizeMap(defaults.map),
        faq: normalizeFaq(defaults.faq),
        images: normalizeImages(defaults.images),
        blocks: normalizeInvitationBlocks(defaults.blocks),
        addons: [],
        customizableOptions: { ...defaultCustomizableOptions, ...(template?.customizableOptions || {}) },
        timeline: defaults.timeline || [],
        gallery: defaults.gallery || [],
        mapSettings: defaults.mapSettings || { locationName: '', address: '', mapUrl: '', embedUrl: '' },
        expiresAt,
        createdAt,
      };
      this.basePrice = invitation.basePrice;
      this.invitation = invitation;
      return invitation;
    },
    ensureInvitationShape() {
      if (!this.invitation) return;
      const theme = getTheme(this.invitation.styles?.themeId || this.invitation.styles?.backgroundTheme || 'modernRustic');
      const styles = buildStylesFromTheme(theme);
      this.invitation = {
        ...this.invitation,
        base: normalizeBase(this.invitation.base),
        details: normalizeDetails(this.invitation.details),
        map: normalizeMap(this.invitation.map || this.invitation.mapSettings),
        faq: normalizeFaq(this.invitation.faq),
        images: normalizeImages(this.invitation.images),
        styles: {
          ...styles,
          ...(this.invitation.styles || {}),
          colors: { ...styles.colors, ...(this.invitation.styles?.colors || {}) },
          fonts: { ...styles.fonts, ...(this.invitation.styles?.fonts || {}) },
        },
        blocks: normalizeInvitationBlocks(this.invitation.blocks || []),
      };
    },
    applyTheme(themeId) {
      if (!this.invitation) return;
      const theme = getTheme(themeId);
      const tokens = clone(theme.tokens || {});
      this.invitation = {
        ...this.invitation,
        styles: {
          ...(this.invitation.styles || {}),
          themeId: theme.id,
          backgroundTheme: theme.id,
          themeTokens: tokens,
          colors: {
            ...(this.invitation.styles?.colors || {}),
            titleColor: tokens.titleText || '#303030',
            bodyColor: tokens.bodyText || '#575757',
            accentColor: tokens.accent || '#303030',
            buttonColor: tokens.buttonBg || '#303030',
            buttonTextColor: tokens.buttonText || '#FFFFFF',
            backgroundColor: tokens.pageBg || '#F4F1EA',
            namesColor: tokens.titleText || '#303030',
          },
          titleColor: tokens.titleText,
          bodyTextColor: tokens.bodyText,
          textColor: tokens.bodyText,
          primaryColor: tokens.accent,
          secondaryColor: tokens.sectionAltBg || tokens.pageBg,
        },
      };
    },
    setActivePreviewTarget(target) {
      if (previewFocusTimeout) clearTimeout(previewFocusTimeout);
      this.activePreviewTarget = target;
      previewFocusTimeout = setTimeout(() => { this.clearActivePreviewTarget(); }, 1500);
    },
    clearActivePreviewTarget() {
      if (previewFocusTimeout) clearTimeout(previewFocusTimeout);
      previewFocusTimeout = null;
      this.activePreviewTarget = null;
    },
    updateBaseField(field, value) {
      if (!this.invitation) return;
      const base = normalizeBase(this.invitation.base);
      const nextBase = { ...base, [field]: value };
      if (field === 'eventDate') nextBase.countdownTargetDate = value;
      const blocks = field === 'eventDate'
        ? (this.invitation.blocks || []).map((block) => (block.type === 'countdown_wedding' ? { ...block, settings: { ...(block.settings || {}), targetDate: value } } : block))
        : this.invitation.blocks;
      this.invitation = { ...this.invitation, base: nextBase, blocks };
      const targets = { coupleNames: 'hero', eventDate: 'hero', locationName: 'map', locationAddress: 'map', message: 'hero', storyMessage: 'story' };
      this.setActivePreviewTarget(targets[field] || 'hero');
    },
    updateDetailsField(field, value) {
      if (!this.invitation) return;
      const currentDetails = normalizeDetails(this.invitation.details);
      const nextDetails = { ...currentDetails, [field]: value };
      this.invitation = { ...this.invitation, details: normalizeDetails(nextDetails) };
      this.setActivePreviewTarget('details');
    },
    updateDetailField(section, field, value) {
      if (!this.invitation) return;
      const currentDetails = normalizeDetails(this.invitation.details);
      const nextDetails = {
        ...currentDetails,
        [section]: {
          ...(currentDetails?.[section] || {}),
          [field]: value,
        },
      };

      if (DEBUG_BUILDER) {
        console.group('[BUILDER DEBUG] updateDetailField');
        console.log('section:', section);
        console.log('field:', field);
        console.log('value:', value);
        console.log('details BEFORE:', JSON.parse(JSON.stringify(this.invitation.details)));
        console.log('details AFTER:', JSON.parse(JSON.stringify(nextDetails)));
        console.groupEnd();
      }

      const normalizedDetails = normalizeDetails(nextDetails);
      if (DEBUG_BUILDER && !normalizedDetails) console.warn('[BUILDER DEBUG] details object missing after update');
      this.invitation = { ...this.invitation, details: normalizedDetails };
      if (DEBUG_BUILDER && !this.invitation.details) console.warn('[BUILDER DEBUG] details object missing after update');
      this.setActivePreviewTarget('details');
    },
    updateMapField(field, value) {
      if (!this.invitation) return;
      const map = { ...normalizeMap(this.invitation.map || this.invitation.mapSettings), [field]: value };
      this.invitation = { ...this.invitation, map, mapSettings: map };
      this.updateBlockProps('map', map, false);
      this.setActivePreviewTarget('map');
    },
    updateFaqItem(index, field, value) {
      if (!this.invitation) return;
      const faq = normalizeFaq(this.invitation.faq).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item));
      this.invitation = { ...this.invitation, faq };
      this.setActivePreviewTarget('faq');
    },
    updateImageField(field, value, metadata = null) {
      if (!this.invitation) return;
      const images = normalizeImages(this.invitation.images);
      const imageFiles = { ...(this.invitation.imageFiles || {}) };
      if (metadata) imageFiles[field] = metadata;
      this.invitation = { ...this.invitation, images: { ...images, [field]: value }, imageFiles };
      const targets = { heroImage: 'hero', storyImage: 'story', parallaxImage: 'story', detailsImage: 'details' };
      this.setActivePreviewTarget(targets[field] || 'gallery');
    },
    updateGalleryImage(index, value, metadata = null) {
      if (!this.invitation) return;
      const images = normalizeImages(this.invitation.images);
      const galleryImages = (images.galleryImages || []).map((image, imageIndex) => (imageIndex === index ? { ...image, src: value, file: metadata || image.file } : image));
      this.invitation = { ...this.invitation, images: { ...images, galleryImages } };
      this.setActivePreviewTarget('gallery');
    },
    updateStyleColor(key, value) {
      if (!this.invitation) return;
      const styles = this.invitation.styles || {};
      const colors = { ...(styles.colors || {}), [key]: value };
      const legacy = {
        ...(key === 'titleColor' ? { titleColor: value } : {}),
        ...(key === 'namesColor' ? { namesColor: value } : {}),
        ...(key === 'bodyColor' ? { bodyTextColor: value, textColor: value } : {}),
        ...(key === 'accentColor' ? { primaryColor: value } : {}),
        ...(key === 'buttonColor' ? { rsvpButtonBackground: value } : {}),
        ...(key === 'buttonTextColor' ? { rsvpButtonTextColor: value } : {}),
        ...(key === 'backgroundColor' ? { secondaryColor: value, background: value, backgroundGradient: value } : {}),
      };
      this.invitation = { ...this.invitation, styles: { ...styles, colors, ...legacy } };
      this.setActivePreviewTarget(key === 'backgroundColor' ? 'hero' : 'hero');
    },
    updateStyleFont(key, value) {
      if (!this.invitation) return;
      const styles = this.invitation.styles || {};
      const fonts = { ...(styles.fonts || {}), [key]: value };
      const legacy = {
        ...(key === 'namesFont' ? { coupleFontFamily: value } : {}),
        ...(key === 'bodyFont' ? { bodyFontFamily: value } : {}),
      };
      this.invitation = { ...this.invitation, styles: { ...styles, fonts, ...legacy } };
      this.setActivePreviewTarget(key === 'headingsFont' ? 'details' : 'hero');
    },
    ensureBlocks() {
      if (!this.invitation) return [];
      const blocks = normalizeInvitationBlocks(this.invitation.blocks || []);
      this.invitation = { ...this.invitation, blocks };
      return blocks;
    },
    toggleBlock(blockId, enabled) {
      if (!this.invitation) return;
      const currentBlocks = this.invitation?.blocks || [];
      const changedBlock = currentBlocks.find((block) => block.id === blockId || block.type === blockId);
      const updatedBlocks = currentBlocks.map((block) => (block.id === blockId || block.type === blockId
        ? { ...block, enabled: Boolean(enabled) }
        : block));

      if (DEBUG_BUILDER && !changedBlock) console.warn('[BUILDER DEBUG] Block not found:', blockId);
      if (DEBUG_BUILDER) {
        console.group('[BUILDER DEBUG] toggleBlock');
        console.log('blockId:', blockId);
        console.log('enabled:', enabled);
        console.log('blocks BEFORE:', JSON.parse(JSON.stringify(this.invitation.blocks)));
        console.log('target BEFORE:', this.invitation.blocks.find((block) => block.id === blockId));
        console.log('target AFTER:', updatedBlocks.find((block) => block.id === blockId));
        console.log('blocks AFTER:', JSON.parse(JSON.stringify(updatedBlocks)));
        console.groupEnd();
      }

      this.invitation = {
        ...this.invitation,
        blocks: updatedBlocks,
      };

      const targetAliases = { countdown_wedding: 'countdown', countdown: 'countdown', gallery: 'gallery', map: 'map', rsvp: 'rsvp', story: 'story' };
      this.setActivePreviewTarget(targetAliases[changedBlock?.type] || 'extras');
    },
    updateBlockOrder(blockId, direction) {
      if (!this.invitation) return;
      const blocks = this.ensureBlocks().slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      const index = blocks.findIndex((block) => block.id === blockId || block.type === blockId);
      const target = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= blocks.length) return;
      const reordered = blocks.slice();
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      this.invitation = { ...this.invitation, blocks: reordered.map((block, orderIndex) => ({ ...block, order: orderIndex + 1 })) };
    },
    updateBlockProps(blockId, props, focusPreview = true) {
      if (!this.invitation) return;
      const blocks = this.ensureBlocks();
      const nextBlocks = blocks.map((block) => (block.id === blockId || block.type === blockId ? { ...block, settings: { ...(block.settings || {}), ...props } } : block));
      const mapBlock = nextBlocks.find((block) => block.type === 'map');
      this.invitation = {
        ...this.invitation,
        blocks: nextBlocks,
        mapSettings: mapBlock ? { ...(this.invitation.mapSettings || {}), ...(mapBlock.settings || {}) } : this.invitation.mapSettings,
        map: mapBlock ? { ...(this.invitation.map || {}), ...(mapBlock.settings || {}) } : this.invitation.map,
      };
      if (focusPreview) this.setActivePreviewTarget(blockId === 'map' ? 'map' : blockId);
    },
    getEnabledBlocksSorted() { return this.enabledBlocksSorted; },
    getTotalPrice() { return this.totalPrice; },
    moveBlockUp(blockId) { this.updateBlockOrder(blockId, 'up'); },
    moveBlockDown(blockId) { this.updateBlockOrder(blockId, 'down'); },
    reorderBlocks(draggedBlockId, targetBlockId) {
      if (!this.invitation) return;
      const ordered = this.ensureBlocks().slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      const draggedIndex = ordered.findIndex((item) => item.id === draggedBlockId);
      const targetIndex = ordered.findIndex((item) => item.id === targetBlockId);
      if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;
      const [dragged] = ordered.splice(draggedIndex, 1);
      ordered.splice(targetIndex, 0, dragged);
      this.invitation = { ...this.invitation, blocks: ordered.map((item, index) => ({ ...item, order: index + 1 })) };
    },
    toggleAddon(type, label, price, checked) {
      if (!this.invitation) return;
      const exists = (this.invitation.addons || []).some((addon) => addon.type === type);
      const addons = checked && !exists
        ? [...(this.invitation.addons || []), { type, label, price, enabled: true }]
        : (this.invitation.addons || []).filter((addon) => addon.type !== type);
      this.invitation = { ...this.invitation, addons };
    },
  },
});
