const sampleImages = [
  '/assets/sample-gallery/wedding-1.jpg',
  '/assets/sample-gallery/wedding-2.jpg',
  '/assets/sample-gallery/wedding-3.jpg',
  '/assets/sample-gallery/wedding-4.jpg',
  '/assets/sample-gallery/wedding-5.jpg',
  '/assets/sample-gallery/wedding-6.jpg',
  '/assets/sample-gallery/wedding-7.jpg',
];

export const romanticMotionConfig = {
  templateId: 'romantic-01',
  sampleImages,
  configurableFields: {
    images: ['heroImage', 'storyImage', 'parallaxImage', 'detailsImage', 'galleryImages'],
    base: [
      'coupleNames',
      'eventDate',
      'locationName',
      'locationAddress',
      'message',
      'storyMessage',
      'countdownTargetDate',
    ],
    details: [
      'ceremonyTitle',
      'ceremonyDate',
      'ceremonyLocation',
      'receptionTitle',
      'receptionDate',
      'receptionLocation',
    ],
    map: ['mapUrl', 'embedUrl'],
    faq: [{ id: 'string', question: 'string', answer: 'string' }],
  },
  defaults: {
    images: {
      heroImage: sampleImages[0],
      storyImage: sampleImages[1],
      parallaxImage: sampleImages[3],
      detailsImage: sampleImages[4],
      galleryImages: sampleImages.map((src, index) => ({ src, alt: `Foto de boda ${index + 1}` })),
    },
    base: {
      coupleNames: 'María & Carlos',
      eventDate: '2027-06-14T18:00:00',
      locationName: 'Rose Garden Hall',
      locationAddress: 'Santiago, Chile',
      message: 'Nos encantaría que seas parte de este día tan especial.',
      storyMessage: 'Nuestra historia está llena de momentos simples, valientes y hermosos que queremos celebrar contigo.',
      countdownTargetDate: '2027-06-14T18:00:00',
    },
    details: {
      ceremonyTitle: 'Ceremonia',
      ceremonyDate: '2027-06-14T18:00:00',
      ceremonyLocation: 'Rose Garden Hall',
      receptionTitle: 'Celebración',
      receptionDate: '2027-06-14T18:00:00',
      receptionLocation: 'Santiago, Chile',
    },
    map: {
      locationName: 'Rose Garden Hall',
      address: 'Santiago, Chile',
      mapUrl: 'https://maps.google.com',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1789740216627!2d-70.65865812458385!3d-33.44464339721427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a7b81bab67%3A0x7cf5cd1956dd49f7!2sTorre%20Entel!5e0!3m2!1ses-419!2scl!4v1777782339212!5m2!1ses-419!2scl',
    },
    faq: [
      { id: 'companions', question: '¿Puedo llevar acompañante?', answer: 'Sí, puedes indicarlo en el formulario RSVP.' },
      { id: 'dress-code', question: '¿Cuál es el código de vestimenta?', answer: 'Formal elegante.' },
      { id: 'deadline', question: '¿Hasta cuándo puedo confirmar?', answer: 'Hasta una semana antes del evento.' },
      { id: 'parking', question: '¿Hay estacionamiento?', answer: 'Sí, hay estacionamiento disponible en el lugar.' },
    ],
  },
  defaultBlocks: [
    { id: 'countdown-wedding', type: 'countdown_wedding', enabled: true, included: true, order: 1, price: 3000, settings: { targetDate: '2027-06-14T18:00:00', title: 'Faltan para nuestra boda', variant: 'editorial' } },
    { id: 'story', type: 'story', enabled: true, included: true, order: 2, price: 0, settings: { title: 'Nuestra historia', message: '' } },
    { id: 'gallery', type: 'gallery', enabled: true, included: false, order: 3, price: 5000, settings: { title: 'Nuestros momentos', images: [] } },
    { id: 'map', type: 'map', enabled: true, included: true, order: 4, price: 3000, settings: { locationName: 'Rose Garden Hall', address: 'Santiago, Chile', mapUrl: 'https://maps.google.com', embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1789740216627!2d-70.65865812458385!3d-33.44464339721427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a7b81bab67%3A0x7cf5cd1956dd49f7!2sTorre%20Entel!5e0!3m2!1ses-419!2scl!4v1777782339212!5m2!1ses-419!2scl' } },
    { id: 'rsvp', type: 'rsvp', enabled: true, included: true, order: 5, price: 0, settings: { title: 'Confirma tu asistencia', buttonLabel: 'Enviar confirmación' } },
    { id: 'timeline', type: 'timeline', enabled: false, included: false, order: 6, price: 2000, settings: { title: 'Cuándo y dónde', items: [] } },
    { id: 'countdown-rsvp', type: 'countdown_rsvp', enabled: false, included: false, order: 7, price: 2000, settings: { targetDate: '2027-05-20T23:59:59', title: 'Tiempo para confirmar', variant: 'editorial' } },
  ],
};

export default romanticMotionConfig;
