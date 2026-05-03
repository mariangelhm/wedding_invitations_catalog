# Romantic Motion Template

Template premium, moderno y romántico para invitaciones digitales.

## Archivos
- `RomanticMotionTemplate.vue`
- `romanticMotionTemplate.css`

## Bloques reutilizados
- CountdownBlock (boda + RSVP)
- StoryBlock
- GalleryBlock
- TimelineBlock
- MapBlock
- RSVPBlock

## Data esperada
Recibe `invitationData` con `base`, `styles`, `timeline`, `gallery` y `addons`, aplicando fallbacks cuando faltan datos.

## Animaciones
- `fadeUp`
- `reveal`
- `softScale`
- IntersectionObserver para activar `is-visible` una sola vez por sección.

## Responsive
- Mobile first (1 columna).
- Desktop centrado con `max-width: 780px`.
