# Wedding Invitations Catalog

A Vue 3 + Vite frontend for browsing, configuring, previewing, and preparing digital wedding invitations. The app centers on a template-agnostic invitation configuration so builder UI, templates, theme tokens, and reusable extras can evolve independently.

## Architecture

- `src/modules/catalog/` lists invitation templates and passes the selected `templateId` into the builder.
- `src/modules/builder/` owns the editor workspace, configuration panels, preview shell, autosave behavior, and builder controls.
- `src/store/builder.store.js` is the single source of truth for the active invitation draft and transient preview focus state.
- `src/modules/invitations/templates/` contains visual templates that consume invitation configuration and render previews.
- `src/components/blocks/` contains reusable invitation extras such as countdown, story, gallery, map, RSVP, and timeline blocks.

## Invitation structure

```js
invitation = {
  id,
  templateId,
  status,
  basePrice,
  base: {
    coupleNames,
    eventDate,
    locationName,
    locationAddress,
    message,
    storyMessage,
    countdownTargetDate,
  },
  details: {
    ceremony: { title, dateTime, location },
    reception: { title, dateTime, location },
  },
  map: {
    mapSearchText,
    locationName,
    address,
    mapUrl,
    embedUrl,
  },
  faq: [
    { id, question, answer },
  ],
  images: {
    heroImage,
    storyImage,
    parallaxImage,
    detailsImage,
    galleryImages,
  },
  styles: {
    themeId,
    themeTokens,
    colors: {
      backgroundColor,
      namesColor,
      titleColor,
      bodyColor,
      accentColor,
      buttonColor,
      buttonTextColor,
    },
    fonts: {
      namesFont,
      headingsFont,
      bodyFont,
    },
  },
  blocks: [],
};
```

Templates should read from this canonical shape. Legacy aliases can exist only as compatibility fallbacks.

## Template configurable fields

Templates can declare configurable fields and defaults in a template config module. Romantic Motion uses `src/modules/invitations/templates/romantic-motion/romanticMotion.config.js` and declares:

- `templateId` for catalog/template matching.
- `configurableFields.images` for `heroImage`, `storyImage`, `parallaxImage`, `detailsImage`, and `galleryImages`.
- `configurableFields.base` for couple names, event date, location, primary messages, and countdown date.
- `configurableFields.details` for ceremony and reception card titles, dates, and locations.
- `configurableFields.map` for search text plus public and embedded map URLs.
- `configurableFields.faq` as `{ id, question, answer }` items.
- `defaultBlocks` so the editor reflects template-specific included and paid extras.

Image fallbacks should use user configuration first and template samples second.

## Theme and custom style priority

Themes are defined as presets in `src/modules/builder/data/themePresets.js`.

- `themeId` identifies the selected preset.
- `themeTokens` stores resolved visual tokens used by templates.
- Custom values in `styles.colors` and `styles.fonts` override theme tokens.
- Templates should use the fallback order: custom config → theme tokens → template defaults.
- A custom `backgroundColor` should paint the template root and all main sections consistently.

Common Romantic Motion CSS variables include:

- `--custom-page-bg`, `--custom-section-bg`, `--custom-section-alt-bg`
- `--custom-names-color`, `--custom-title-color`, `--custom-body-color`
- `--custom-accent-color`, `--custom-button-bg`, `--custom-button-text`
- `--font-names`, `--font-headings`, `--font-body`

## Blocks rules

Reusable extras live in `src/components/blocks/` and are registered from `src/components/blocks/index.js`.

Block config is stored in `invitation.blocks`:

```js
{
  id,
  type,
  enabled,
  order,
  price,
  included,
  settings,
}
```

Rules:

- Blocks must never be removed when toggled off; only `enabled` changes.
- Templates render enabled blocks from `invitation.blocks`, sorted by `order`.
- Fixed template sections render their matching enabled block.
- Enabled extras that are not fixed sections render in a generic dynamic extras area.
- Unsupported block types should show a visible fallback instead of silently rendering nothing.
- Pricing is `basePrice + sum(block.price where block.enabled && !block.included)`.
