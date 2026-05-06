import { defineStore } from 'pinia';
import { themePresets } from '../modules/builder/data/themePresets';
import { romanticMotionConfig } from '../modules/invitations/templates/romantic-motion/romanticMotion.config';

const DEBUG_BUILDER = true;
const BLOCK_TYPE_ALIASES = {
  countdown_wedding: 'countdown',
  countdown_rsvp: 'countdown_rsvp',
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
const normalizeBlockType = (type) => BLOCK_TYPE_ALIASES[type] || type;
function debugGroup(label, payload = {}) {
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
function debugError(label, error, context = {}) {
  console.error(`[BUILDER ERROR] ${label}`, {
    error,
    context,
  });
}
const getPreviewTargetFromBlock = (block) => {
  const normalizedType = normalizeBlockType(block?.type || block);
  const targets = { countdown: 'countdown', countdown_rsvp: 'rsvp', gallery: 'gallery', map: 'map', rsvp: 'rsvp', story: 'story', timeline: 'extras' };
  return targets[normalizedType] || 'extras';
};

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

const mergeBlockData = (defaultBlock, existing = {}) => ({
  ...clone(defaultBlock),
  ...existing,
  settings: { ...(defaultBlock.settings || {}), ...(existing.props || {}), ...(existing.settings || {}) },
  props: { ...(defaultBlock.settings || {}), ...(existing.settings || {}), ...(existing.props || {}) },
  enabled: existing.enabled ?? defaultBlock.enabled ?? false,
  included: existing.included ?? defaultBlock.included ?? false,
});
const normalizeInvitationBlocks = (blocks = []) => {
  const usedIndexes = new Set();
  const defaults = Object.values(blockRegistry).map((defaultBlock) => {
    const existingIndex = blocks.findIndex((block, index) => !usedIndexes.has(index) && (block?.id === defaultBlock.id || block?.type === defaultBlock.type));
    const existing = existingIndex >= 0 ? blocks[existingIndex] : {};
    if (existingIndex >= 0) usedIndexes.add(existingIndex);
    return mergeBlockData(defaultBlock, existing);
  });
  const extraBlocks = blocks
    .filter((block, index) => !usedIndexes.has(index))
    .map((block) => ({
      ...block,
      settings: { ...(block.props || {}), ...(block.settings || {}) },
      props: { ...(block.settings || {}), ...(block.props || {}) },
      enabled: block.enabled ?? false,
      included: block.included ?? false,
    }));

  return [...defaults, ...extraBlocks]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((block, index) => ({ ...block, order: index + 1 }));
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
        ? (this.invitation.blocks || []).map((block) => (normalizeBlockType(block.type) === 'countdown' ? {
          ...block,
          settings: { ...(block.settings || {}), targetDate: value },
          props: { ...(block.props || {}), targetDate: value },
        } : block))
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
      try {
        const currentDetails = this.invitation?.details || {};
        const currentSection = currentDetails?.[section] || {};
        const nextDetails = {
          ...currentDetails,
          [section]: {
            ...currentSection,
            [field]: value,
          },
        };

        this.invitation = {
          ...this.invitation,
          details: nextDetails,
        };
        this.activePreviewTarget = 'details';

        debugGroup('updateDetailField', {
          section,
          field,
          value,
          before: currentDetails,
          after: nextDetails,
        });
      } catch (error) {
        debugError('updateDetailField failed', error, {
          section,
          field,
          value,
          invitation: this.invitation,
        });
      }
    },
    updateMapField(field, value) {
      try {
        const currentMap = {
          ...(this.invitation?.mapSettings || {}),
          ...(this.invitation?.map || {}),
        };
        const nextMap = {
          ...currentMap,
          [field]: value,
        };

        this.invitation = {
          ...this.invitation,
          map: nextMap,
          mapSettings: {
            ...(this.invitation?.mapSettings || {}),
            [field]: value,
          },
        };
        this.updateBlockProps('map', { [field]: value }, false);
        this.activePreviewTarget = 'map';

        debugGroup('updateMapField', {
          field,
          value,
          before: currentMap,
          after: nextMap,
        });
      } catch (error) {
        debugError('updateMapField failed', error, {
          field,
          value,
          invitation: this.invitation,
        });
      }
    },
    updateFaqItem(idOrIndex, field, value) {
      try {
        const currentFaq = this.invitation?.faq || [];
        const nextFaq = currentFaq.map((item, itemIndex) => (item.id === idOrIndex || itemIndex === idOrIndex ? { ...item, [field]: value } : item));

        this.invitation = {
          ...this.invitation,
          faq: nextFaq,
        };
        this.activePreviewTarget = 'faq';

        debugGroup('updateFaqItem', {
          idOrIndex,
          field,
          value,
          before: currentFaq,
          after: nextFaq,
        });
      } catch (error) {
        debugError('updateFaqItem failed', error, {
          idOrIndex,
          field,
          value,
          invitation: this.invitation,
        });
      }
    },
    updateImageField(field, value, metadata = null) {
      try {
        const currentImages = this.invitation?.images || {};
        const imageFiles = { ...(this.invitation?.imageFiles || {}) };
        if (metadata) imageFiles[field] = metadata;
        const nextImages = { ...currentImages, [field]: value };

        this.invitation = {
          ...this.invitation,
          images: nextImages,
          imageFiles,
        };
        const targets = { heroImage: 'hero', storyImage: 'story', parallaxImage: 'story', detailsImage: 'details' };
        this.activePreviewTarget = targets[field] || 'gallery';

        debugGroup('updateImageField', {
          field,
          value,
          metadata,
          before: currentImages,
          after: nextImages,
        });
      } catch (error) {
        debugError('updateImageField failed', error, {
          field,
          value,
          metadata,
          invitation: this.invitation,
        });
      }
    },
    updateGalleryImage(index, value, metadata = null) {
      try {
        const currentImages = this.invitation?.images || {};
        const currentGalleryImages = Array.isArray(currentImages.galleryImages) ? currentImages.galleryImages : [];
        const galleryImages = currentGalleryImages.map((image, imageIndex) => (imageIndex === index ? { ...image, src: value, file: metadata || image.file } : image));
        if (!galleryImages[index]) galleryImages[index] = { src: value, alt: `Imagen ${index + 1}`, file: metadata || null };
        const nextImages = { ...currentImages, galleryImages };

        this.invitation = {
          ...this.invitation,
          images: nextImages,
        };
        this.activePreviewTarget = 'gallery';

        debugGroup('updateGalleryImage', {
          index,
          value,
          metadata,
          before: currentGalleryImages,
          after: galleryImages,
        });
      } catch (error) {
        debugError('updateGalleryImage failed', error, {
          index,
          value,
          metadata,
          invitation: this.invitation,
        });
      }
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
      try {
        const nextEnabled = Boolean(enabled);
        const currentBlocks = this.invitation?.blocks || [];
        const targetBefore = currentBlocks.find((block) => block.id === blockId);

        if (!targetBefore) {
          console.warn('[BUILDER DEBUG] toggleBlock target not found', {
            blockId,
            currentBlocks,
          });
          return;
        }

        const updatedBlocks = currentBlocks.map((block) => (block.id === blockId
          ? { ...block, enabled: nextEnabled }
          : block));
        const targetAfter = updatedBlocks.find((block) => block.id === blockId);

        this.invitation = {
          ...this.invitation,
          blocks: updatedBlocks,
        };
        this.activePreviewTarget = getPreviewTargetFromBlock(targetAfter);

        debugGroup('toggleBlock', {
          blockId,
          receivedEnabled: enabled,
          nextEnabled,
          targetBefore,
          targetAfter,
          enabledBlocksAfter: updatedBlocks.filter((block) => block.enabled),
        });
      } catch (error) {
        debugError('toggleBlock failed', error, {
          blockId,
          enabled,
          invitation: this.invitation,
        });
      }
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
      try {
        const blocks = this.ensureBlocks();
        const targetBefore = blocks.find((block) => block.id === blockId || block.type === blockId || normalizeBlockType(block.type) === blockId);
        const nextBlocks = blocks.map((block) => (block.id === blockId || block.type === blockId || normalizeBlockType(block.type) === blockId ? {
          ...block,
          props: { ...(block.props || {}), ...props },
          settings: { ...(block.settings || {}), ...props },
        } : block));
        const targetAfter = nextBlocks.find((block) => block.id === blockId || block.type === blockId || normalizeBlockType(block.type) === blockId);
        const mapBlock = nextBlocks.find((block) => normalizeBlockType(block.type) === 'map');

        this.invitation = {
          ...this.invitation,
          blocks: nextBlocks,
          mapSettings: mapBlock ? { ...(this.invitation?.mapSettings || {}), ...(mapBlock.props || {}), ...(mapBlock.settings || {}) } : this.invitation?.mapSettings,
          map: mapBlock ? { ...(this.invitation?.map || {}), ...(mapBlock.props || {}), ...(mapBlock.settings || {}) } : this.invitation?.map,
        };
        if (focusPreview) this.activePreviewTarget = getPreviewTargetFromBlock(targetAfter || blockId);

        debugGroup('updateBlockProps', {
          blockId,
          props,
          targetBefore,
          targetAfter,
          focusPreview,
        });
      } catch (error) {
        debugError('updateBlockProps failed', error, {
          blockId,
          props,
          focusPreview,
          invitation: this.invitation,
        });
      }
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
