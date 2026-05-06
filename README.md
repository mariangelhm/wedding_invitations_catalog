# Wedding Invitations Catalog

A Vue 3 + Vite frontend for browsing, configuring, previewing, and preparing digital wedding invitations. The app centers on a template-agnostic invitation configuration so builder UI, templates, theme tokens, and reusable extras can evolve independently.

## Project architecture overview

- `src/modules/catalog/` lists invitation templates and passes the selected `templateId` into the builder.
- `src/modules/builder/` owns the editor workspace, configuration panels, preview shell, autosave behavior, and builder controls.
- `src/store/builder.store.js` is the single source of truth for the active invitation draft.
- `src/modules/invitations/templates/` contains visual templates that consume invitation configuration and render previews.
- `src/components/blocks/` contains reusable invitation extras such as countdown, story, gallery, map, RSVP, and timeline blocks.
- `src/modules/invitations/theme/` contains visual/theme helpers, including contrast utilities.

## Invitation configuration structure

The builder stores invitation drafts with this template-agnostic shape:

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
    ceremonyTitle,
    ceremonyDate,
    ceremonyLocation,
    receptionTitle,
    receptionDate,
    receptionLocation,
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

Templates should treat this structure as canonical. Legacy aliases can be supported for backwards compatibility, but new editor controls should write to `base`, `details`, `map`, `faq`, `images`, `styles.colors`, `styles.fonts`, and `blocks`.

## Template configurable attributes

Templates can declare their configurable fields and defaults in a template config module. Romantic Motion uses `src/modules/invitations/templates/romantic-motion/romanticMotion.config.js` and declares:

- `templateId` for catalog/template matching.
- `configurableFields.images` for `heroImage`, `storyImage`, `parallaxImage`, `detailsImage`, and `galleryImages`.
- `configurableFields.base` for couple names, event date, location, primary messages, and countdown date.
- `configurableFields.details` for ceremony and reception card titles, dates, and locations.
- `configurableFields.map` for search text plus public and embedded map URLs.
- `configurableFields.faq` as `{ id, question, answer }` items.
- `defaultBlocks` so the editor reflects the template's included and paid extras instead of enabling every block globally.

Image fallbacks should use user configuration first and template samples second, for example:

```js
const heroImage = invitationData.images.heroImage || sampleImages[0];
```

## Theme tokens and style overrides

Themes are defined as presets in `src/modules/builder/data/themePresets.js`.

- `themeId` identifies the selected preset.
- `themeTokens` stores the resolved visual tokens used by templates.
- Custom colors and backgrounds in `styles.colors` override theme tokens.
- Templates should use the fallback order: custom config → theme tokens → template defaults. A custom `backgroundColor` should paint the template root and main sections consistently.

Romantic Motion binds root CSS variables including:

- `--custom-page-bg`, `--custom-section-bg`, `--custom-section-alt-bg`
- `--custom-names-color`, `--custom-title-color`, `--custom-body-color`
- `--custom-accent-color`, `--custom-button-bg`, `--custom-button-text`
- `--font-names`, `--font-headings`, `--font-body`

## Blocks and extras system

Reusable extras live in `src/components/blocks/` and are registered from `src/components/blocks/index.js`.

The block registry maps block types to components and configurable props:

- `countdown`, `countdown_wedding`, `countdown_rsvp`
- `story`
- `gallery`
- `timeline`
- `map`
- `rsvp`

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

Blocks should never be removed when toggled off. `toggleBlock(blockId, enabled)` only changes `enabled`, preserving settings and ordering so the same extra can render again when re-enabled.

Templates should render enabled blocks from `invitation.blocks`, sorted by `order`. If a block has a fixed template section, render it there. If an enabled block is not part of a fixed section, render it in a generic extras area through the block registry and avoid duplicate rendering.

Pricing uses:

```js
basePrice + sum(block.price where block.enabled && !block.included)
```

Included blocks never add cost, and disabled blocks never add cost.

## Store actions

`src/store/builder.store.js` owns draft mutation and the transient `activePreviewTarget` preview-focus state through reactive-safe actions:

- `createDraftInvitation(template)`
- `ensureInvitationShape()`
- `applyTheme(themeId)`
- `updateBaseField(field, value)`
- `updateDetailsField(field, value)`
- `updateMapField(field, value)`
- `updateFaqItem(index, field, value)`
- `updateImageField(field, value)`
- `updateGalleryImage(index, value)`
- `setActivePreviewTarget(target)`
- `clearActivePreviewTarget()`
- `updateStyleColor(key, value)`
- `updateStyleFont(key, value)`
- `toggleBlock(blockId, enabled)`
- `updateBlockOrder(blockId, direction)`
- `updateBlockProps(blockId, props)`
- `reorderBlocks(draggedBlockId, targetBlockId)`
- `getEnabledBlocksSorted()`
- `getTotalPrice()`

## Connecting a new template

When adding a new template:

1. Create a template config module with `templateId`, `configurableFields`, defaults, and `defaultBlocks`.
2. Read public data from `invitationData.base`, `details`, `map`, `faq`, and `images`.
3. Read visual data from `invitationData.styles.colors` and `invitationData.styles.fonts`.
4. Bind template CSS variables for colors, typography, and theme tokens.
5. Render fixed template sections from enabled blocks where applicable.
6. Render enabled non-fixed extras in a generic extras area through `src/components/blocks/index.js`.
7. Preserve block state by toggling `enabled` instead of adding/removing block records.
8. Add `data-preview-target` attributes for editable sections so editor changes can scroll and temporarily highlight the matching preview area.


## Editor input conventions

- Wedding, ceremony, and reception date values should be edited with `datetime-local` controls. The single wedding date field updates both `base.eventDate` and `base.countdownTargetDate`.
- Template images should be uploaded with `input type="file" accept="image/*"`; editor previews can store object URLs in `invitation.images` while file metadata is kept separately for future upload flows.
- Map configuration belongs in the main card/configuration panel. The extras panel only toggles, orders, and summarizes blocks.
- Map search should use `map.mapSearchText` and open Google Maps search in a new tab; `mapUrl` and `embedUrl` remain configurable for link and embed rendering.
- Field edits should call `setActivePreviewTarget(target)` so the preview scrolls to and highlights sections such as `hero`, `story`, `details`, `gallery`, `map`, `faq`, `rsvp`, and `countdown`.

## Naming conventions

- Template classes should be scoped with the template prefix, for example `romantic-template__hero`.
- Reusable extra classes should stay inside their block folder stylesheet.
- Store action names should describe configuration intent rather than UI details.
