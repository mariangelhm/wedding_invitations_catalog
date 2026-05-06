# Wedding Invitations Catalog

A Vue 3 + Vite frontend for browsing, configuring, previewing, and preparing digital wedding invitations. The app is organized around a template-agnostic invitation configuration object so builder UI, templates, themes, and reusable extras can evolve independently.

## Project architecture overview

- `src/modules/catalog/` lists invitation templates and passes the selected `templateId` into the builder.
- `src/modules/builder/` owns the editor workspace, configuration panels, preview shell, autosave behavior, and builder-specific controls.
- `src/store/builder.store.js` is the single source of truth for the active invitation draft.
- `src/modules/invitations/templates/` contains visual templates that consume invitation configuration and render public/editor previews.
- `src/components/blocks/` contains reusable invitation extras such as countdown, story, gallery, map, RSVP, and timeline blocks.
- `src/modules/invitations/theme/` contains visual/theme helpers, including contrast utilities.

## Invitation structure

The builder stores invitation drafts with this template-agnostic shape:

```js
invitation = {
  id,
  templateId,
  status,
  base: {
    coupleNames,
    eventDate,
    locationName,
    locationAddress,
    message,
    storyMessage,
  },
  styles: {
    themeId,
    themeTokens,
    colors: {
      titleColor,
      bodyColor,
      accentColor,
      buttonColor,
      buttonTextColor,
      backgroundColor,
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

Templates should treat this structure as the canonical config. Legacy aliases can be supported for backwards compatibility, but new editor controls should write to `base`, `styles.colors`, `styles.fonts`, and `blocks`.

## Theme system

Themes are defined as presets in `src/modules/builder/data/themePresets.js`.

- `themeId` identifies the selected preset.
- `themeTokens` stores the resolved visual tokens used by templates.
- Custom colors in `styles.colors` override theme tokens.
- Templates should use the fallback order: custom config → theme tokens → template defaults.

## Template system

Templates receive `invitationData` and must not know about editor UI internals.

Template responsibilities:

- Read base data from `invitationData.base`.
- Read colors and fonts from `invitationData.styles`.
- Bind CSS variables on the template root for colors, typography, and theme tokens.
- Render only enabled blocks from `invitationData.blocks`, sorted by `order` when the section is block-driven.
- Keep layout rules scoped to the template stylesheet.

The Romantic Motion template uses CSS variables such as:

- `--custom-title-color`
- `--custom-body-color`
- `--custom-accent-color`
- `--custom-button-bg`
- `--custom-button-text`
- `--font-names`
- `--font-headings`
- `--font-body`

## Block system

Reusable extras live in `src/components/blocks/` and are registered from `src/components/blocks/index.js`.

The block registry maps block types to components and configurable props:

- `countdown`
- `countdown_wedding`
- `countdown_rsvp`
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

Blocks should not be removed when toggled off. Use `enabled` so extras can be re-enabled without losing settings or order.

## Store responsibilities

`src/store/builder.store.js` owns draft mutation through reactive-safe actions:

- `createDraftInvitation(template)`
- `updateBaseField(field, value)`
- `applyTheme(themeId)`
- `updateStyleColor(key, value)`
- `updateStyleFont(key, value)`
- `toggleBlock(blockId, enabled)`
- `updateBlockOrder(blockId, direction)`
- `updateBlockProps(blockId, props)`
- `getEnabledBlocksSorted()`
- `getTotalPrice()`

Pricing uses:

```js
basePrice + sum(block.price where block.enabled && !block.included)
```

## Naming conventions

- Template classes should be scoped with the template prefix, for example `romantic-template__hero`.
- Reusable extra classes should stay inside their block folder stylesheet.
- Store action names should describe configuration intent rather than UI details.
- New template config fields should be template-agnostic and belong under `base`, `styles`, or `blocks`.
