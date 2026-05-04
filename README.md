# Wedding Invitation Builder App

## Project Purpose
This project is a clean Vue 3 starter for building a modular **Wedding Invitation Builder** and future invitation catalog features.

## Tech Stack
- **Vue 3** for UI development
- **Vite** for fast development and build tooling
- **Vue Router** for route management
- **Pinia** for global state management
- **CSS (modular base styles)** for a scalable styling system

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview production build:
   ```bash
   npm run preview
   ```

## Invitation Model
The `builderStore` creates and stores a default invitation draft with a consistent object shape.

```js
{
  id,
  status: 'draft',
  base: {
    names: '',
    date: '',
    location: '',
    message: ''
  },
  styles: {
    primaryColor: '#000000',
    fontFamily: 'Arial'
  },
  addons: [],
  expiresAt: null,
  createdAt: new Date()
}
```

### Field Meanings
- `id`: unique draft identifier generated from current timestamp.
- `status`: invitation lifecycle state (`draft` by default).
- `base`: editable core invitation content (names, date, location, message).
- `styles`: design defaults for color and font.
- `addons`: optional extra features/items.
- `expiresAt`: optional expiration timestamp (null when not used).
- `createdAt`: date/time of draft creation.


## Basic Editor Form behavior
- The component at `src/modules/builder/components/BasicEditorForm.vue` uses `useBuilderStore()` directly.
- On mount, it creates a draft invitation if one does not exist yet.
- Each form field (`names`, `date`, `location`, `message`) uses `v-model` bound directly to `builderStore.invitation.base`.
- Because Pinia store state is reactive, changes typed in the form immediately update the global store.
- A JSON preview (`<pre>`) renders the current invitation object to make debugging and state validation easy.

## Addons system
- The component at `src/modules/builder/components/AddonsSelector.vue` uses a static addon catalog:
  - `countdown_wedding` (Wedding Countdown) / price `3000`
  - `map` (Map) / price `3000`
  - `gallery` (Gallery) / price `5000`
- Each addon is rendered with a checkbox.
- When checked, the addon is added to `builderStore.invitation.addons` only if it does not already exist (duplicate protection by `type`).
- When unchecked, it is removed from `builderStore.invitation.addons` by filtering matching `type`.
- A JSON debug block shows the currently selected addons for transparent state verification.

## Pricing system
- `builderStore` includes a fixed `basePrice` of `20000`.
- A reactive getter `totalPrice` computes the final amount as:
  - `basePrice + sum(invitation.addons[].price)`
- Because `totalPrice` is a Pinia getter, it updates automatically when addons are added or removed.
- `PriceSummary.vue` displays base price, selected addons with their individual prices, and the live total.

## Autosave behavior
- `useAutosave` (`src/modules/builder/composables/useAutosave.js`) watches `builderStore.invitation` with `{ deep: true }` so nested changes (like `base.names` or `addons`) are captured.
- Autosave uses a `500ms` debounce: each new change resets the timer, so saving runs only after input settles.
- On debounce completion, autosave calls `saveInvitation(invitation)`.
- Current service implementation is a mock in `src/modules/builder/services/invitations.service.js` and logs:
  - `Saving to Firebase`, plus invitation payload.
- Purpose: reduce risk of losing user progress during editing while avoiding too many save calls.

## Preview system
- `InvitationPreview.vue` reads `builderStore.invitation` and displays the current `names`, `date`, `location`, and `message` values.
- Because the preview binds directly to reactive Pinia state, content updates instantly as users type in the editor.
- Addon placeholders are rendered conditionally:
  - `Countdown enabled` appears when addon type `countdown_wedding` exists.
  - `Map enabled` appears when addon type `map` exists.
- This keeps preview logic simple while validating dynamic rendering behavior.

## Expiration system
- New drafts set `expiresAt` to `createdAt + 30 days` in `createDraftInvitation()`.
- `ExpirationBanner.vue` shows the expiration date and calculates `daysRemaining` from current time.
- Remaining days are computed with a millisecond difference converted to days and rounded up (`Math.ceil`) so partial days still count.
- If fewer than 3 days remain, a warning message is displayed.

## Editor layout structure
- `src/modules/builder/pages/Editor.vue` defines a responsive 3-region layout for the builder.
- Desktop layout (3 columns):
  - **Left:** `BasicEditorForm` + `AddonsSelector`
  - **Center:** `InvitationPreview`
  - **Right:** `PriceSummary` + `ExpirationBanner`
- Mobile layout: all sections are stacked into a single column.
- Implementation uses a mobile-first CSS Grid approach (`1fr` by default, `1fr 1fr 1fr` from `1024px`).
- Goal is structure clarity: controls on left, visual output in center, metadata on right.

## Landing page purpose
- `src/modules/landing/pages/Home.vue` is the public entry page for new users.
- It presents a clear hero message and a single primary CTA: **Start now**.
- The CTA routes users to `/editor`, which opens the builder workspace.
- A simple **How it works** section explains the flow in 3 steps:
  1. Customize
  2. Add extras
  3. Get your link
- Styles are intentionally minimal and live in `src/modules/landing/styles/home.css`.

## Catalog system
- `src/modules/catalog/pages/Catalog.vue` provides a simple template catalog view.
- It uses mock template data with required fields:
  - `name`
  - `description`
  - `basePrice`
- Templates are rendered as cards, each with a **Customize** button.
- Clicking **Customize** routes users to `/editor` to continue the builder flow.
- A dedicated route is available at `/catalog`.

## Template system
- `InvitationPreview.vue` now delegates visual rendering to a template component.
- Added romantic template files:
  - `src/modules/invitations/templates/romantic/Template.vue`
  - `src/modules/invitations/templates/romantic/style.css`
- The romantic template renders invitation sections for:
  - names (large title)
  - date
  - location
  - message
- Styling is clean and simple with centered layout, elegant serif typography, and soft colors.
- CSS variables are used in template styles for:
  - primary color (`--romantic-primary-color`)
  - font family (`--romantic-font-family`)
- Responsive sizing/spacing is included using `clamp(...)` and a small-screen media query.

## Public invitation view
- `src/modules/invitations/pages/PublicInvitation.vue` is a public-facing page for shared links.
- It reads `invitationId` from route params using path `/i/:id`.
- A mock async fetch simulates loading invitation data by ID.
- Loaded data is rendered dynamically through the romantic template.
- This keeps public rendering decoupled from the editor/store context.

## Routing structure
- Routes are defined in `src/core/router/index.js` with explicit page mapping:
  - `/` → `Home`
  - `/catalog` → `Catalog`
  - `/editor` → `Editor`
  - `/i/:id` → `PublicInvitation` (dynamic invitation id)
- `App.vue` contains simple navigation links to these routes for quick access during development.

## Landing visual improvements
- `Home.vue` was refactored into a modern, centered hero with clearer visual hierarchy.
- Hero includes a large elegant title, subtitle, and prominent CTA button.
- `home.css` now adds a soft gradient background and a max-width container for cleaner spacing.
- CTA button uses `--primary-color`, rounded shape, and a subtle hover effect.
- "How it works" was upgraded from a plain list to step cards with better spacing.
- Step cards are responsive: 1 column on mobile and 3 columns on desktop.
- Styling stays intentionally simple to keep the UI clean and maintainable.

## Editor UI improvements
- `Editor.vue` now uses a padded page wrapper with a centered max-width container.
- Layout is CSS Grid based via `src/modules/builder/styles/editor.css`:
  - mobile: 1 column
  - desktop: 3 columns
- Left panel wraps `BasicEditorForm` and `AddonsSelector` in cards for clearer grouping.
- Center preview is wrapped in a larger invitation-like card (white surface, rounded corners, shadow, padding).
- Right panel wraps `PriceSummary` and `ExpirationBanner` in separate cards.
- Typography was tuned for readability:
  - section titles larger
  - labels slightly smaller
- Spacing between form inputs was increased for cleaner editing rhythm.

## Template improvements
- The romantic template was refined to be minimal but more elegant.
- Layout now centers content vertically using a shell wrapper.
- Added clearer spacing between sections for better readability.
- Typography updates:
  - names are larger with elegant emphasis
  - date/location are smaller metadata text
  - message is italic for a softer personal tone
- Added soft background/surface treatment and centralized container (`max-width: 500px`).
- Styling uses CSS variables for template colors and font values.
- Responsive adjustments preserve spacing and readability on small screens.

## UI components system
- Reusable UI building blocks were added under `src/components/ui/`:
  - `Button.vue`
  - `Input.vue`
  - `TextArea.vue`
- Goal: keep form/button styles and behavior consistent across modules.
- `Input.vue` and `TextArea.vue` support `v-model` using `modelValue` + `update:modelValue`.
- Shared field styling includes:
  - consistent padding
  - border radius
  - focus ring/border state
- `BasicEditorForm.vue` now uses these reusable input components instead of native fields.

## Landing hero SaaS refactor
- `Home.vue` hero was redesigned into a modern 2-column SaaS layout.
- Left side now contains:
  - title
  - subtitle
  - two CTAs: `Ver catálogo` and `Cómo funciona`
- Right side includes a phone mockup that previews invitation content.
- Added soft abstract background shapes for visual depth.
- Button system now includes:
  - primary filled button
  - secondary outlined button
- Layout is centered with `max-width: 1200px` and stacks on mobile.
- Styles are implemented in `src/modules/landing/styles/home.css` with clear layout comments.

## Language system
- A lightweight i18n system was added without external libraries.
- Translation dictionary lives in `src/core/i18n/translations.js` with `es` and `en` keys.
- Global language state is managed by `src/store/language.store.js`:
  - `currentLang` (default `es`)
  - `toggleLanguage()` action
- Helper `useI18n()` in `src/core/i18n/index.js` provides:
  - `t(key)` for nested key lookup (e.g. `t("home.title")`)
  - `currentLang`
  - `toggleLanguage`
- `Home.vue` now reads localized strings through `t(...)`.
- `App.vue` includes a simple `[ES | EN]` language switch button that toggles app language globally.
- Language selection now persists in `localStorage` through `language.store.js` (`setLanguage`).
- Navbar language switch uses `[ES | EN]` toggle controls with active-language highlighting.
- Navigation labels and key Home texts update dynamically through i18n keys.

## Catalog UI improvements
- `Catalog.vue` was upgraded into a product-style catalog experience.
- Added top style filters:
  - Todos
  - Románticas
  - Modernas
  - Minimalistas
- Template cards now include:
  - preview image area
  - style badge
  - template name
  - price
  - customize button
- Grid behavior:
  - mobile: 1 column
  - desktop: 3 columns
  - wide screens: 4 columns
- Added hover interaction on cards (scale + shadow) for stronger product affordance.
- Styles were moved to `src/modules/catalog/styles/catalog.css`.

## Purchase summary card
- Added `src/modules/builder/components/SummaryCard.vue` to present a clear pre-payment pricing summary.
- Card includes:
  - invitation name
  - base price
  - selected add-ons
  - highlighted total price
- Includes note: **"Your invitation will be active for 12 months"**.
- Includes CTA button: **"Continue to payment"**.
- Styled as a concise card with rounded corners, shadow, and padding for clear pricing UX.

## Public invitation layout
- Public invitation view (`/i/:id`) is treated as a presentation page, not a dashboard page.
- App-level navbar/links are intentionally hidden for this route to avoid UI distractions.
- `PublicInvitation.vue` uses a full-screen centered layout (`min-height: 100vh`).
- Background uses a soft gradient to keep focus on invitation content.
- Only the invitation template is rendered, inside a centered container with `max-width: 420px`.

## Invitation card design
- Romantic template now uses a dedicated invitation card container with:
  - white background
  - `border-radius: 20px`
  - `padding: 30px`
  - soft shadow
- Card content is fully centered and spaced for readability.
- Width is constrained to `max-width: 400px` for focused presentation.
- A subtle fade-in animation is applied on load for a polished appearance.
- Design remains clean and elegant, prioritizing invitation readability.

## Public background styling
- Public invitation page now uses a subtle layered pastel background (radial + linear gradients).
- Added optional abstract decorative shapes at page edges for visual depth.
- Styling is intentionally soft so it does not distract from invitation content.
- Invitation container keeps visual priority using a light drop-shadow and centered layout.

## Mobile responsiveness
- Public invitation and romantic template were tuned with a mobile-first approach.
- On small screens, invitation card expands to full width and uses reduced padding.
- Typography scales down on mobile to avoid overflow and keep readability.
- Public page explicitly prevents horizontal scrolling and adjusts outer padding.
- Responsive comments were added in styles to explain full-width and spacing decisions.

## Landing page visual redesign
- The landing page was redesigned to a modern SaaS wedding-invitation style focused on clean UI and conversion clarity.
- Global color palette was centralized in `src/styles/base/variables.css` with dark pink brand tones:
  - `--color-primary`, `--color-primary-dark`, `--color-primary-light`
  - `--color-text-main`, `--color-text-muted`, `--color-border`, `--color-surface`, `--color-background-soft`
- Landing navbar now includes:
  - brand text `InvitaLove`
  - center navigation links
  - right-side `Comenzar` button and `ES | EN` switch
- Hero uses responsive 2-column layout on desktop and stacked layout on mobile:
  - left: badge, title, subtitle, CTAs, benefits
  - right: modern phone mockup invitation preview
- "¿Cómo funciona?" section uses modern cards with rounded corners, soft shadows, and icon circles.
- Landing-specific styles live in `src/modules/landing/styles/home.css` and are documented with layout comments.

## Landing responsive and language improvements
- Language switching on landing now uses `language.store.js` with:
  - default `currentLang = "es"`
  - `setLanguage(lang)` and `toggleLanguage()`
  - localStorage persistence (`wedding_builder_lang`)
- Landing texts now come from `src/core/i18n/translations.js` for both Spanish and English, including:
  - navbar labels
  - hero content
  - benefits
  - steps
  - phone mockup content
- Responsive behavior was refined in `src/modules/landing/styles/home.css`:
  - desktop hero uses two columns with `min-height: calc(100vh - navbar)`
  - mobile/tablet stacks hero blocks cleanly
  - CTA and benefits wrap predictably
  - phone mockup scales down and remains centered
  - how-it-works cards stack on small screens
- Phone mockup now uses a more realistic vertical smartphone structure:
  - 9:16 aspect ratio
  - dark outer frame
  - notch
  - inner white invitation screen
- Navbar hover states now include primary color emphasis and animated underline.

## Landing layout & Footer improvements
- Hero height was tuned to reduce unnecessary first-screen scroll using `min-height: calc(100vh - navbar height)` and balanced spacing.
- Mobile spacing/readability was improved with dedicated breakpoints for `768px` and `480px`:
  - cleaner stacked hero
  - full-width CTA buttons
  - wrapped benefits and cards
  - scaled phone mockup
- Added reusable global footer component at `src/components/layout/Footer.vue` with legal, contact, and social/help sections.
- Added reusable `src/components/layout/MainLayout.vue` that centralizes app navbar + `<router-view />` + global footer structure.
- Footer is responsive: 3 columns desktop, 1 column mobile.

## Folder Structure
```text
/src
  /core
    /router
    /plugins
  /components
    /ui
    /layout
  /modules
    /builder
    /landing
    /catalog
  /store
    builder.store.js
  /styles
    /base
      reset.css
      typography.css
      variables.css
    main.css
```

## Catalog marketplace page
- The catalog now behaves as a marketplace-style template browser using a local `templates` array in `src/modules/catalog/pages/Catalog.vue`.
- Each template item includes structured fields for product-like rendering:
  - `id`, `name`, `category`, `level`, `basePrice`, `popular`, `shortDescription`, and `previewStyle` (`background`, `accentColor`, `textColor`).
- Category filter pills support: `Todas`, `Románticas`, `Elegantes`, `Modernas`, `Minimalistas`, and `Temáticas`.
- Sorting options include:
  - `Más populares`
  - `Precio menor a mayor`
  - `Precio mayor a menor`
- Card previews are generated with CSS only (no image assets): a vertical invitation mockup with names placeholder, date, and decorative line/heart driven by `previewStyle` colors.
- Actions:
  - `Personalizar` routes to `/editor`.
  - `Ver detalle` uses a safe fallback (`console.log`) when a dedicated `/catalog/:id` route is not present.
- Shared global layout usage is preserved:
  - `Catalog.vue` does not embed local header/footer.
  - App-level shell (`MainLayout`) remains responsible for global navigation and footer consistency across pages.

## Global header and translations
- The app now uses a reusable `Header.vue` component mounted from `MainLayout.vue`, so navigation is globally consistent and not duplicated inside page modules.
- Header structure is split into three zones:
  - Left: brand (`InvitaLove`)
  - Center: translated links (`Inicio`, `Catálogo`, `Editor`, `Invitación pública`)
  - Right: translated CTA (`Comenzar`) plus language switch (`ES | EN`)
- Translation keys were expanded under `nav` for both `es` and `en` to avoid rendering raw key paths such as `nav.home`.
- Header visuals were standardized with brand-consistent interactions:
  - white background
  - subtle bottom border
  - no browser-default blue underlined links
  - active link and hover states using `--color-primary`
- Mobile behavior (`<= 768px`) currently keeps logo, start button, and language switch visible while hiding center navigation links for readability.

## Catalog page
- The catalog is a marketplace-style page with translated UI labels managed through `catalog.*` keys in `src/core/i18n/translations.js` for Spanish and English.
- A breadcrumb is displayed at the top using router links (`Home/Inicio -> Catalog/Catálogo`) and supports optional detail context when a `/catalog/:id` route is active.
- Catalog templates are mocked locally with rich metadata:
  - `id`, `name`, `category`, `level`, `basePrice`, `popular`, `shortDescription`, `previewStyle`, and `customizableOptions`.
- Filtering supports six categories (`all`, `romantic`, `elegant`, `modern`, `minimal`, `themed`) and highlights the active filter for better scanability.
- Sorting supports:
  - popular-first ranking
  - low-price to high-price
  - high-price to low-price
- Card previews are CSS-based marketplace mockups (no images) and include:
  - invitation mini-preview
  - template identity (name/category/level)
  - base price and summary text
  - actions: detail and customize.
- Route behavior:
  - `View detail` -> `/catalog/:id`
  - `Customize` -> `/editor?templateId={id}`
- Global header/footer are not duplicated in the catalog page; they remain provided by shared layout components.

## Template detail page
- Added dedicated detail route `/catalog/:id` rendered by `TemplateDetail.vue`.
- Detail page reads `id` from route params, resolves template from shared `src/modules/catalog/data/templates.js`, and shows a friendly not-found message when missing.
- Includes breadcrumb (`Inicio/Home / Catálogo/Catalog / Template Name`), large preview mockup, pricing, level/category metadata, feature list, and actions for customize + preview.
- Similar designs section shows up to 3 templates from the same category excluding the current template.
- Data source is shared between catalog list and detail to avoid duplication.

## Template preview modal
- Added reusable `TemplatePreviewModal.vue` for catalog templates.
- Props:
  - `template`
  - `isOpen`
  - `initialView` (`web` or `mobile`)
- Emits:
  - `close`
  - `customize`
- Modal includes Web/Mobile view switch, dark overlay, centered responsive container, and editor helper text.
- `TemplateDetail.vue` now opens this modal from the "Vista previa" action and routes to `/editor?templateId={id}` from the customize callback.

## Catalog to editor flow
- The catalog passes `templateId` via query string using `/editor?templateId={id}`.
- In `Editor.vue`, route query is read and used to resolve the selected template from shared catalog template data.
- Builder store now supports `createDraftInvitation(template)` to initialize draft metadata from catalog selection:
  - `templateId`, `templateName`, `level`, `basePrice`, `customizableOptions`, and style defaults.
- Editor UI adapts tabs/panels based on `customizableOptions` (colors, fonts, photos, music, map, countdown).
- `AddonsSelector` filters available add-ons according to selected template capabilities.
- If no `templateId` is provided, editor still initializes with default mock draft values.

## Customizable components panel
- Added `CustomizableComponentsPanel.vue` in the editor settings flow.
- The panel reads `builderStore.invitation.customizableOptions` and always includes basic text/date/location/message customization context.
- Optional components are shown only when allowed by selected template options.
- Add-on toggles update `builderStore.invitation.addons` through store action `toggleAddon(...)` with duplicate-safe add/remove behavior.
- Default add-on prices configured:
  - map: 3000
  - countdown_wedding: 3000
  - countdown_rsvp: 2000
  - gallery/photos: 5000
  - music: 4000

## Reusable Breadcrumb component
- Added shared UI component `src/components/ui/Breadcrumb.vue`.
- Accepts `items` prop with `{ label, to? }` entries.
- Uses `router-link` for navigable items and plain text for final/current item.
- Uses slash (`/`) separators, muted typography, and primary-color hover on links.
- Catalog pages now consume the reusable breadcrumb component instead of duplicating breadcrumb markup.

## Layout and catalog flow refactor
- The app now uses a single global layout shell: `MainLayout` renders exactly one `Header`, one `router-view`, and one `Footer`.
- Header menu was simplified to product-navigation links only (`Inicio/Home`, `Catálogo/Catalog`, `Cómo funciona/How it works`, `Precios/Pricing`, `Tutoriales/Tutorials`) and CTA (`Comenzar/Start now`).
- `Editor` and `Public Invitation` entries were removed from top navigation to keep the header focused on discovery flow.
- Catalog cards now route directly to editor customization via `/editor?templateId={id}`.
- Editor reads `templateId` from query params, resolves selected template from shared catalog data, and initializes builder draft with template metadata.

## Catalog flow
- Catalog cards are now fully clickable and route directly to the editor with query-param template handoff:
  - `/editor?templateId={id}`
- The visible `Personalizar` / `Customize` button routes to the same path and uses click-stop behavior to avoid double navigation.
- The detail action/button was removed from catalog cards to keep the flow focused on immediate customization.

## Section-based editor UI
- The editor now uses local `selectedSection` state (default: `info`) to drive a professional section-based customization workflow.
- Desktop layout uses a 3-column composition:
  - left: section menu
  - center: preview canvas
  - right: settings + summary/actions
- Mobile layout stacks vertically and turns section menu into horizontal-scroll tabs.
- Section content mapping:
  - info -> `BasicEditorForm`
  - colors -> primary color control
  - typography -> font family selector
  - photos/music/map -> placeholder or lightweight controls
  - components -> `CustomizableComponentsPanel`
- Right panel keeps summary actions visible (`PriceSummary`, `ExpirationBanner`, Save/Preview actions).

## Editor preview modal
- Added `EditorPreviewModal.vue` with two view modes: `Web` and `Mobile`.
- The modal reads live builder state via the existing `InvitationPreview` component, so current texts, styles, and addons are reflected immediately.
- Open/close flow:
  - open from editor "Vista previa" button
  - close from modal close action or overlay click
- Mobile mode uses a phone mockup frame to preview responsive invitation appearance.

## Bloques sincronizados con preview (Romantic Motion)
- La sección **Bloques** del editor y el preview comparten la misma fuente de verdad: `invitation.blocks`.
- Al activar/desactivar un bloque desde el editor se actualiza `enabled` en `invitation.blocks` y el preview responde inmediatamente.
- `RomanticMotionTemplate` ahora renderiza los bloques dinámicamente desde `invitationData.blocks` (ordenados por `order`), manteniendo el Hero fijo arriba.
- Si `invitationData.blocks` no existe, el template genera un fallback base de bloques para no romper el render.
- Mapeo dinámico soportado:
  - `countdown_wedding` → `CountdownBlock`
  - `countdown_rsvp` → `CountdownBlock`
  - `story` → `StoryBlock`
  - `gallery` → `GalleryBlock`
  - `timeline` → `TimelineBlock`
  - `map` → `MapBlock`
  - `rsvp` → `RSVPBlock`

## Romantic wedding template
- Added new invitation template at `src/modules/invitations/templates/romantic-wedding/`:
  - `Template.vue`
  - `style.css`
  - `config.js`
- The template accepts a single prop `invitationData` and renders a romantic-modern invitation composition using reusable presentational blocks:
  - Hero
  - Wedding countdown
  - Story
  - Timeline
  - Map
  - Confirmation countdown
  - RSVP
- The template is intentionally presentation-focused and avoids business logic; it only renders received data and fallback content.

## Reusable CountdownBlock
- Added reusable countdown block at `src/modules/builder/blocks/CountdownBlock/CountdownBlock.vue` with companion metadata config at `src/modules/builder/blocks/CountdownBlock/config.js`.
- Props:
  - `targetDate` (string)
  - `label` (string)
- Behavior:
  - computes days/hours/minutes/seconds
  - refreshes every second with an interval
  - clears interval on unmount
  - shows fallback state `El tiempo ha finalizado` once expired
- Designed as a reusable card block with dark-pink accents and responsive grid for integration into invitation templates.

## Reusable MapBlock
- Added reusable map block at `src/modules/builder/blocks/MapBlock/MapBlock.vue` with config metadata in `src/modules/builder/blocks/MapBlock/config.js`.
- Props:
  - `mapUrl` (string)
  - `locationName` (string)
- MVP behavior:
  - Shows location title
  - Renders `Ver ubicación` action opening map link in a new tab
  - No embedded Google Maps iframe yet
- Includes help tooltip indicator with bilingual guidance on how to obtain a shareable Google Maps URL.

## Reusable TimelineBlock
- Added reusable itinerary timeline block:
  - `src/modules/builder/blocks/TimelineBlock/TimelineBlock.vue`
  - `src/modules/builder/blocks/TimelineBlock/config.js`
- Props:
  - `items` array with entries like `{ time, title, place }`.
- Renders an elegant vertical timeline with dark-pink accent line and event dots.
- Designed mobile-first and reusable across invitation templates and editor-driven block composition.

## Reusable StoryBlock
- Added reusable narrative block:
  - `src/modules/builder/blocks/StoryBlock/StoryBlock.vue`
  - `src/modules/builder/blocks/StoryBlock/config.js`
- Props:
  - `message` (string)
  - `title` (string, default: `Nuestra historia`)
- Presents story content in a romantic, clean, card-based paragraph layout designed for high readability across mobile and desktop.

## Reusable RSVPBlock
- Added reusable RSVP confirmation block:
  - `src/modules/builder/blocks/RSVPBlock/RSVPBlock.vue`
  - `src/modules/builder/blocks/RSVPBlock/config.js`
- Props:
  - `buttonLabel` (default: `Confirmar asistencia`)
- Local state handles:
  - full name input
  - validation message
  - confirmed state
- Emits `confirm` event with payload:
  - `{ fullName, response: "confirmed" }`
- No backend connection yet; block is UI + emit-only by design for MVP integration.

## Block registry
- Added a central registry at `src/modules/builder/blocks/index.js`.
- Registry maps each block type to both its Vue component and config metadata:
  - `countdown`
  - `map`
  - `timeline`
  - `story`
  - `rsvp`
- This structure prepares the builder for future drag-and-drop composition and dynamic block rendering by type inside templates/editor flows.

## CountdownBlock
- Reusable countdown component at `src/modules/builder/blocks/CountdownBlock/CountdownBlock.vue` with config at `src/modules/builder/blocks/CountdownBlock/config.js`.
- Props:
  - `targetDate` (ISO string, required)
  - `label` (optional)
- Behavior:
  - calculates difference between `now` and `targetDate`
  - updates every second via `setInterval`
  - clears interval on unmount and when event reaches zero
  - displays "El evento ha comenzado" when countdown finishes
- This block is prepared for future drag-and-drop registration usage via block config metadata.

## Block Registry
- `src/components/blocks/index.js` centraliza un registro de bloques reutilizables para renderizarlos de forma consistente en templates.
- Bloques registrados actualmente:
  - `countdown`
  - `map`
  - `timeline`
  - `story`
  - `rsvp`
  - `gallery`
- Cada entrada del registro define:
  - `component`
  - `label`
  - `draggable`
  - `configurableProps` (props que podrán editarse desde UI futuras)
- En templates, este registro permitirá resolver bloques por `type` sin imports dispersos.
- Para el futuro drag & drop del editor, el campo `draggable` y `configurableProps` facilitarán:
  - listar bloques disponibles
  - validar qué props puede modificar cada bloque
  - mantener una única fuente de verdad para metadatos de bloques

## Romantic Motion Template
- Es el primer template real de invitación premium con enfoque moderno, minimalista y romántico, usando composición por bloques reutilizables.
- Archivos del template:
  - `src/modules/invitations/templates/romantic-motion/RomanticMotionTemplate.vue`
  - `src/modules/invitations/templates/romantic-motion/romanticMotionTemplate.css`
  - `src/modules/invitations/templates/romantic-motion/README.md`
- Bloques reutilizables usados:
  - `CountdownBlock` (boda y RSVP)
  - `StoryBlock`
  - `GalleryBlock`
  - `TimelineBlock`
  - `MapBlock`
  - `RSVPBlock`
- Estructura de data esperada: `invitationData` con `base`, `styles`, `timeline`, `gallery` y `addons`; el template incluye fallbacks para mantener compatibilidad con el editor actual.
- Animaciones incluidas:
  - `fadeUp`
  - `reveal`
  - `softScale`
  - activación por `IntersectionObserver` con animación una sola vez por sección (`motion-section` + `is-visible`).
- Responsive:
  - mobile-first en una columna, sin scroll horizontal
  - desktop centrado con `max-width: 780px` y aire visual entre secciones
- Render desde `InvitationPreview`:
  - si `builderStore.invitation.templateId` es `romantic-01` o `romantic-motion`, se renderiza `RomanticMotionTemplate`
  - en otros casos mantiene el template fallback existente

## Fix RomanticMotionTemplate rendering
- Se ajustó `InvitationPreview.vue` para importar explícitamente `RomanticMotionTemplate` y evitar el warning `Failed to resolve component: RomanticMotionTemplate`.
- La condición `isRomanticMotionTemplate` ahora valida:
  - `invitation.templateId === "romantic-01"`
  - o `invitation.templateComponent === "romantic-motion"`
- El preview toma `invitation` desde `builderStore.invitation`, muestra `No invitation selected` si no existe y mantiene el fallback para templates no `romantic-motion`.

## Fix Vue template ref warning
- Se corrigió el warning `Template ref "setSectionRef" used on a non-ref value` en `RomanticMotionTemplate.vue`.
- Se cambió `ref="setSectionRef"` por `:ref="setSectionRef"` para usar correctamente function refs en Vue.
- `setSectionRef` ahora evita duplicados y recolecta nodos para IntersectionObserver.
- Se agregó `onUnmounted` con `disconnect()` para limpiar el observer sin remover animaciones.

## Generic visual builder editor
- El flujo del editor ahora lee `templateId` desde `/editor?templateId={id}`.
- `templates.js` actúa como fuente de verdad de catálogo; cada template define `id` + `templateComponent`.
- Se agregó `src/modules/invitations/templates/index.js` como `templateRegistry` para resolver componentes por clave.
- `InvitationPreview` renderiza dinámicamente con `<component :is="activeTemplateComponent" :invitationData="invitation" />`.
- Si no existe componente registrado, se mantiene fallback preview.
- Las secciones del editor se construyen desde `customizableOptions` del template:
  - Siempre: Información
  - Condicionales: Colores, Tipografías, Fotos, Música, Mapa, Componentes
- `createDraftInvitation(template)` en store guarda metadata completa del template y campos genéricos para soportar templates futuros sin hardcode.

## Editor visual improvements
- Se agregó switch de dispositivo en la barra superior (`🖥️ Desktop` / `📱 Mobile`) para escalar la vista previa sin alterar data del template.
- El menú lateral fue rediseñado con secciones e íconos: Fondo, Sobre, Tarjeta, Detalles, Estilo y Bloques.
- Cada sección tiene panel propio:
  - Fondo: tabs Galería/Colores con swatches.
  - Sobre: placeholder estilizado.
  - Tarjeta: formulario base en español.
  - Detalles: configuración de mapa con ayuda para obtener link de Google Maps.
  - Estilo: tarjetas de tipografía + swatches de color de texto.
  - Bloques: cards con toggle para addons reutilizables.
- Se implementó sistema de swatches para color de fondo y color de texto.
- Se incorporaron tarjetas tipográficas seleccionables para `fontFamily`.
- Se removió `PriceSummary` y `ExpirationBanner` del panel del editor para priorizar una UX de edición visual limpia; esos datos quedan para checkout/resumen dedicado.


## Editor navigation cleanup
- Se eliminó la sección **Sobre** del menú lateral para simplificar el flujo y priorizar secciones de edición con impacto real en el resultado visual.
- La navegación superior ahora incluye **← Volver al catálogo** con acceso directo a `/catalog` (visible en desktop y mobile).
- El menú del editor queda en: Fondo, Tarjeta, Detalles, Estilo y Bloques; si el estado previo era `sobre`/`envelope`, se normaliza automáticamente a `fondo`.


## Separated typography system
- El editor en la sección **Estilo** ahora separa tipografías en dos controles: **Fuente para nombres** y **Fuente general**.
- Se agregaron opciones: Playfair Display, Cormorant Garamond, Poppins, Georgia, Patrick Hand y Arial.
- En el store, `styles` ahora soporta `coupleFontFamily` y `bodyFontFamily` junto con `textColor`, `primaryColor`, `secondaryColor` y `backgroundTheme`.
- `RomanticMotionTemplate` aplica `coupleFontFamily` exclusivamente al nombre de la pareja y `bodyFontFamily` al resto del contenido, con fallback serif/sans-serif local.

## Visual theme presets
- Se agregó `src/modules/builder/data/themePresets.js` con presets reutilizables (blush, ivory, darkLuxury, sage) para aplicar decisiones visuales consistentes.
- En el editor, la sección **Fondo** ahora prioriza selección de tema como control principal (no sólo color plano).
- Al seleccionar un tema se actualizan `backgroundTheme`, `primaryColor`, `secondaryColor`, `backgroundGradient`, `accentShape` y `textColor` (si el preset lo define).
- `RomanticMotionTemplate` consume estas variables para fondo, acentos y contraste (incluyendo escenarios oscuros), y este enfoque queda preparado para templates futuros.


## Continuous invitation layout
- `RomanticMotionTemplate` fue refactorizado para sentirse como una sola invitación digital continua, en lugar de una pila de cards independientes.
- Se mantiene semántica por secciones, pero ahora comparten fondo, ritmo vertical consistente y separadores suaves.
- Se añadieron capas decorativas (gradientes y círculos sutiles) en el contenedor principal para dar profundidad sin romper continuidad.
- Hero, countdown, story, gallery, timeline, map y RSVP conservan sus bloques reutilizables y bindings, pero con estilo visual unificado.

## Gallery default placeholders
- `GalleryBlock` ahora evita imágenes rotas: cuando `images` viene vacío o con `src` inválido, renderiza placeholders visuales con gradiente y etiqueta.
- Placeholders por defecto:
  - Foto principal
  - Momento especial
  - Nuestra historia
- Si una entrada específica tiene `src` vacío, sólo esa celda se transforma en placeholder (las imágenes válidas mantienen zoom en hover).
- `RomanticMotionTemplate` deja lista data de muestra mínima, pero el fallback principal vive dentro de `GalleryBlock` para reutilización global.


## Map addon
- El bloque **Mapa** ahora se maneja como addon con precio (`3000`) en la sección **Bloques** del editor.
- Al activar, se guarda como addon `type: "map"`, `enabled: true`, `price` y `settings` (`locationName`, `address`, `mapUrl`).
- En la sección **Detalles**, los campos del mapa sólo aparecen si el addon está activo; de lo contrario se muestra una guía para activarlo.
- `RomanticMotionTemplate` renderiza `MapBlock` únicamente cuando el addon de mapa está habilitado.

## Ordered blocks system
- Se incorporó un sistema de bloques ordenados (`invitation.blocks`) con `enabled`, `order`, `price` y `settings` como paso inicial hacia drag & drop.
- El editor ahora permite **Activar/Desactivar**, **Mover arriba** y **Mover abajo** cada bloque desde la sección Bloques.
- `RomanticMotionTemplate` mantiene el hero fijo al inicio, y luego renderiza los bloques habilitados según su orden.
- Este enfoque mantiene compatibilidad futura para migrar a drag & drop sin librerías externas.

## Typography application
- Se agregó un mapeo `fontStacks` para traducir cada tipografía seleccionada a un stack CSS real con fallback.
- El editor aplica ese mapeo en las cards de selección para `coupleFontFamily` y `bodyFontFamily`, y el estado seleccionado refleja el valor guardado.
- `RomanticMotionTemplate` aplica `--couple-font-family`, `--body-font-family` y `--template-text-color` usando ese mapeo para que el preview cambie visiblemente en cada selección.
- `src/styles/base/typography.css` ahora importa Google Fonts para: Playfair Display, Cormorant Garamond, Poppins y Patrick Hand.


## Details panel improvements
- Se mejoró la sección **Detalles** con una card de configuración vertical para mapa (labels arriba, inputs full-width y ayudas por campo).
- Se agregó una caja de ayuda: **¿Cómo obtener el link?** con pasos claros para copiar enlace desde Google Maps.
- Si el bloque mapa está desactivado, ahora se muestra estado vacío con CTA **Ir a Bloques** para activarlo rápidamente.

## Theme reset consistency
- Cada `themePreset` ahora define explícitamente: `primaryColor`, `secondaryColor`, `background`, `accentShape`, `textColor`, `titleColor`, `bodyTextColor`.
- Al seleccionar tema en editor, se escriben siempre todos esos tokens en `styles` para evitar herencia accidental del tema previo.
- Esto corrige el caso oscuro→claro donde el texto podía quedar blanco sobre fondo claro.


## Nuevos temas elegantes
- Se agregaron presets visuales adicionales: Rosa viejo, Terracota champagne, Verde eucalipto, Azul medianoche, Lavanda gris, Gris carbón y Marfil dorado.
- Todos se muestran como tarjetas visuales en **Fondo > Temas** y aplican tokens completos de color/tipografía de contraste para evitar herencias visuales no deseadas.


## Separación de color tipográfico
- La sección **Estilo** ahora incluye dos controles independientes: **Color de nombres/títulos** y **Color de texto general**.
- `titleColor` controla nombres de novios y encabezados destacados; `bodyTextColor` controla fecha, ubicación, mensajes y textos de contenido.
- Los temas siguen definiendo ambos por defecto, y cualquier cambio manual se refleja inmediatamente en el preview.


## Tamaño del nombre de novios
- Se agregó la clase `.romantic-motion__couple-names` para controlar el título principal con `clamp(2.4rem, 8vw, 5rem)`.
- Para nombres largos se habilitó ajuste elegante con `text-wrap: balance`, `overflow-wrap` y `line-height` optimizado.
- En mobile se redujo padding del hero y se ajustó el clamp para evitar overflow horizontal sin perder jerarquía visual.


## Mensajes separados: hero vs historia
- El modelo `base` ahora separa `heroMessage` y `storyMessage` para evitar reutilizar el mismo texto en dos contextos distintos.
- `heroMessage` se renderiza debajo de la ubicación en el hero.
- `storyMessage` alimenta el `StoryBlock` en la sección de historia.
- En Tarjeta se agregaron campos independientes: **Mensaje principal** y **Historia de los novios** con fallbacks elegantes si están vacíos.

## MapBlock: URL normal o embed
- `MapBlock` ahora acepta `mapUrl` y `embedUrl`.
- Si `embedUrl` existe, renderiza un `<iframe>` responsivo con `loading="lazy"`, `allowfullscreen` y `referrerpolicy="no-referrer-when-downgrade"`.
- Si no hay `embedUrl` y existe `mapUrl`, muestra botón `Ver en Google Maps`.
- En `Detalles` se agregaron campos separados para enlace normal e incrustado, con helper para ambos formatos.

## Editor fullscreen con scroll interno
- En `/editor` se ocultan header/footer globales y el contenedor principal trabaja en altura de viewport (`100vh`) con `overflow: hidden`.
- La barra superior queda fija y el área inferior usa `calc(100vh - toolbarHeight)`.
- Sidebar izquierda, panel de configuración y canvas central ahora gestionan su propio `overflow-y`, evitando scroll vertical de toda la página.
- Resultado: experiencia tipo Canva/Wix con scroll interno por panel.

## Imágenes de ejemplo para galería
- El template usa imágenes locales de muestra cuando no hay fotos personalizadas.
- Debes colocar/reemplazar tus imágenes en esta carpeta:
  - `src/assets/sample-gallery/`
- Nombres esperados:
  - `wedding-1.jpg`
  - `wedding-2.jpg`
  - `wedding-3.jpg`
  - `wedding-4.jpg`
- Si esos archivos no contienen una foto válida todavía, la app mantiene placeholders visuales elegantes y no se rompe.

## Extras section and dynamic block rendering
- El menú lateral del editor usa: **Fondo, Tarjeta, Letras, Extras**.
- La sección **Extras** administra bloques reutilizables (activar/desactivar y orden).
- Al activar/desactivar un extra se actualiza `invitation.blocks` preservando el orden.
- El template Romantic Motion renderiza dinámicamente solo bloques habilitados (`enabled`) ordenados por `order`.
- El hero siempre permanece fijo arriba y el resto de secciones se pintan según los bloques activos.
- La configuración del mapa vive dentro de Extras y se muestra solo cuando el extra mapa está activo.

## Typography tabs and separated text colors
- La sección **Letras** ahora tiene tabs: **Nombres** y **General**.
- **Nombres** controla `styles.coupleFontFamily` y `styles.titleColor`.
- **General** controla `styles.bodyFontFamily` y `styles.bodyTextColor`.
- `titleColor` aplica a nombres de novios y encabezados de sección.
- `bodyTextColor` aplica al contenido general (fecha, ubicación, mensajes y textos de bloques).
- Se amplió el catálogo de tipografías y paleta de colores para personalización más fina.

## Theme panel and contrast fixes
- En **Fondo** se mantienen tabs controlados por estado local: `Temas` y `Colores`.
- Cambiar a `Colores` no bloquea el regreso a `Temas` (`backgroundTab` local).
- Cada tema define explícitamente: `primaryColor`, `secondaryColor`, `background`, `accentShape`, `titleColor`, `bodyTextColor`, `surfaceColor`, `surfaceTextColor`.
- Al seleccionar un tema se sobreescriben todos los tokens de color para evitar herencias incorrectas al cambiar entre tema oscuro y claro.
- Se agregó sistema de contraste para bloques (`--block-surface`, `--block-text-color`, `--block-muted-color`) para asegurar legibilidad en todos los themes.

## Romantic Motion layered storytelling design
- Romantic Motion ahora se renderiza como una sola experiencia continua (`.romantic-motion`) con capas decorativas compartidas y flujo narrativo vertical.
- El hero queda como primera sección y los bloques habilitados se renderizan dinámicamente debajo sin perder la arquitectura reusable.
- Se añadieron efectos de storytelling en scroll: `fade up`, desplazamiento sutil tipo parallax y bandas de sección para guiar la lectura.
- La galería usa composición en capas (desktop: una imagen grande + pequeñas superpuestas; mobile: tarjetas apiladas), con overlap sutil hacia la siguiente sección.
- Se ajustó la integración visual de Countdown/Story/Timeline/Map/RSVP para evitar sensación de tarjetas aisladas y mantener contraste consistente.

## Compact full-height editor layout
- El editor usa viewport completo (`height: 100vh`) con `overflow: hidden` para evitar scroll global.
- Toolbar compacta con altura fija de `64px`.
- Área principal con `height: calc(100vh - 64px)` en grid.
- Desktop layout: `88px 330px 1fr` (menú, panel de ajustes, canvas).
- Menú lateral y panel de ajustes con espaciado compacto y scroll interno.
- Canvas maximiza el preview con padding `24px` desktop y `12px` mobile.
- Mientras la ruta `/editor` está activa, el `body` bloquea su scroll; solo los paneles internos hacen scroll.


## Romantic Motion premium template
- The `romantic-01` template now ships with all default sections enabled in a continuous one-page storytelling flow: Hero, wedding countdown, story, gallery, event timeline, map, RSVP countdown, and final RSVP CTA/form.
- `createDraftInvitation(template)` preloads premium default content data for `romantic-01` including base couple details, timeline milestones, gallery placeholders, and complete map settings with Google Maps embed support.
- The template uses native `IntersectionObserver` reveal animations (no external libraries) with staggered item transitions for gallery and timeline entries.
- The map section supports embedded iframes (`embedUrl`) and gracefully falls back to a Google Maps link card when only `mapUrl` is available.
- Layout was redesigned as a connected invitation experience (shared background layers, soft bands, overlap, and depth) instead of isolated cards.
- Responsive behavior was tuned for mobile: clamp-based hero typography, stacked split/gallery layouts, no horizontal scroll, responsive map height, and full-width RSVP form controls.

## Done button and checkout summary modal
- The editor now includes a compact **Total** summary panel under the left area and a **Listo** button to finish configuration.
- Total price is calculated in `builderStore` using enabled blocks pricing (`basePrice + sum(enabled blocks prices)`) through reactive getters.
- Clicking **Listo** opens a checkout summary modal with: template name, base price, selected extras with prices, optional duration, and total price.
- Modal actions:
  - **Cancelar** closes the modal and returns to editing.
  - **Ir a pagar** routes to `/checkout` if that route exists; otherwise logs `go to checkout`.
- The modal is responsive for mobile (`width: 95vw`, `max-width: 520px`) with a centered card, overlay, clean spacing, and dark pink primary action.
- No payment provider or backend integration is included yet.

## Fix block toggling and device preview switch
- Extras now use **enabled flag toggling** instead of deleting blocks from `invitation.blocks`, preserving section configuration and preventing preview loss after reactivation.
- `builderStore.toggleBlock(blockType)` now supports resilient behavior: if a block is missing (legacy/inconsistent state), it is recreated through a `createDefaultBlock(blockType)` factory and appended with `lastOrder + 1`.
- The default block factory covers `countdown_wedding`, `story`, `gallery`, `timeline`, `map`, `countdown_rsvp`, and `rsvp` with full default config (`id`, `type`, `enabled`, `order`, `price`, `settings`).
- The Romantic Motion template renders from `invitationData.blocks.filter(block => block.enabled).sort(...)`, so toggled-off blocks disappear and toggled-on blocks reappear consistently.
- The editor toolbar restores device preview controls:
  - `🖥️ Web` sets `selectedPreviewDevice = "desktop"`
  - `📱 Mobile` sets `selectedPreviewDevice = "mobile"`
- `InvitationPreview` accepts `device` prop and applies `invitation-preview--desktop` / `invitation-preview--mobile` classes so the preview stays responsive and centered without horizontal overflow.

## Fix extras toggle behavior
- Extras are no longer removed from `invitation.blocks` when disabled; they are preserved and only switch `enabled` to `false`.
- Re-enabling the same extra switches `enabled` back to `true`, so the section appears again immediately in preview.
- `toggleBlock(blockType)` now toggles existing blocks by type, and recreates missing blocks through `createDefaultBlock(blockType)` for resilient legacy-data handling.
- `createDefaultBlock(blockType)` supports: `countdown_wedding`, `story`, `gallery`, `timeline`, `map`, `countdown_rsvp`, and `rsvp`.
- Romantic Motion rendering uses `invitationData.blocks.filter(block => block.enabled).sort((a, b) => a.order - b.order)` so disabled sections do not render and re-enabled ones return instantly.

## Done button placement
- The separate middle price panel was removed from the editor layout.
- The **Total** summary and **Listo** button now live under the left icon menu in a bottom section.
- Left sidebar uses a column flow (`display: flex; flex-direction: column;`) so:
  - menu items stay at the top,
  - total + Listo stay pinned to the bottom.
- The **Listo** button keeps the current behavior (opens the invitation summary modal).
- On mobile, the icon menu becomes horizontal and the total + Listo controls are shown inline after the menu actions for quick access.

## Extras visual cards
- The Extras section cards were redesigned to a compact professional layout with three clear zones:
  - top row: mini visual preview + title + price badge,
  - description row,
  - bottom row: modern toggle switch, state label (`Activo` / `Inactivo`), and move up/down actions only when active.
- Cards now have active/inactive visual states:
  - active: primary border + soft pink background,
  - inactive: white background + muted text.
- Added subtle hover micro-interaction (`translateY(-2px)` + soft shadow).
- Replaced checkbox with a modern switch control for better UX clarity.
- Updated compact preview mini-UIs for countdown, story, gallery, timeline, map and RSVP blocks.

## Native drag and drop extras ordering
- Extras cards now support native HTML5 drag and drop (`draggable`, `dragstart`, `dragover`, `drop`) without external libraries.
- Only active extras are draggable for ordering; inactive extras remain visible but non-draggable.
- Dropping one active extra over another calls `reorderBlocks(draggedBlockId, targetBlockId)` in the store.
- `reorderBlocks` reorders `invitation.blocks` and normalizes `order` values sequentially.
- Move up/down buttons remain available as fallback controls.
- Visual feedback during drag:
  - dragged card uses reduced opacity,
  - drop target gets highlighted.
- Romantic Motion preview updates immediately because enabled blocks are always rendered sorted by `order`.

## Countdown seconds fix
- `CountdownBlock` now always renders exactly four units: **Días, Horas, Minutos, Segundos**.
- `useCountdown` now returns the requested API shape:
  - `days`
  - `hours`
  - `minutes`
  - `seconds`
  - `isExpired`
- Countdown layout is responsive by default:
  - desktop: 4 columns,
  - mobile: 2x2 grid.
- Extras mini preview for countdown now explicitly shows four values including seconds: `12 / 04 / 33 / 59`.

## Extras toggle fix
- `toggleBlock(blockType)` now uses `invitation.blocks` as the source of truth and never deletes block entries when disabling extras.
- Existing blocks are toggled only through `block.enabled = !block.enabled`, preserving previous order and settings.
- If a block does not exist, it is recreated through `createDefaultBlock(blockType)`, pushed into `invitation.blocks`, and enabled by default.
- `createDefaultBlock(blockType)` supports all standard extras and now returns complete metadata (`id`, `type`, `enabled`, `order`, `price`, `label`, `description`, `settings`).
- Romantic Motion now renders from enabled blocks computed as `blocks.filter(block => block.enabled).sort((a, b) => a.order - b.order)` with fallback enabled blocks only when `invitationData.blocks` is missing.
- Development-only debug logging was added to verify live block state transitions: `console.log("Enabled blocks", enabledBlocks.value)`.

## Compact editor price and Done button
- The left editor sidebar now uses a compact two-zone structure:
  - top: menu items,
  - bottom: summary area with **Total** and **Listo**.
- Sidebar summary is constrained to the sidebar width (`92px`) and prevents horizontal overflow.
- Price display uses compact formatting (`$35k`) to avoid long-line clipping in narrow sidebar width.
- **Listo** button is full-width with compact sizing (`font-size: 12px`, tighter padding, rounded corners) to prevent split/cut rendering.
- Mobile behavior was improved:
  - sidebar summary is hidden from the small horizontal icon menu,
  - total + Listo are shown in a sticky bottom bar for reliable access and no squeezing.
- Existing checkout modal behavior remains unchanged.

## Editor mobile layout
- Desktop layout remains unchanged: top toolbar, left icon sidebar, settings panel, and preview canvas.
- On mobile (`< 768px`):
  - toolbar remains fixed at top (including Web/Mobile preview switch),
  - desktop left sidebar is hidden,
  - a new horizontal, scrollable mobile tabs row is shown inside settings with: **Fondo, Tarjeta, Letras, Extras**,
  - settings panel uses full width with improved spacing,
  - preview canvas stays full width with `12px` padding and centered preview,
  - sticky bottom summary bar keeps **Total** and **Listo** always accessible.
- Mobile layout blocks horizontal page scrolling and keeps interactions inside panels.

## Theme card selector and IDE theme
- The **Temas** panel now uses modern large theme cards with:
  - theme name,
  - short description,
  - 4-color palette swatches,
  - selected state with primary border and checkmark.
- Theme presets were normalized to include full metadata:
  - `id`, `name`, `description`, `primaryColor`, `secondaryColor`, `background`, `accentShape`, `titleColor`, `bodyTextColor`, `surfaceColor`, `surfaceTextColor`, `palette`.
- Added curated themes:
  - Editorial Marfil
  - Boho Chic
  - Noche Elegante
  - Moderna Lavanda
  - Gris Carbón
  - IDE / Desarrollo
- Added the new dark **IDE / Desarrollo** preset with the requested values for a technical, modern visual style.
- Applying a theme now updates all key style tokens (including `backgroundTheme`, `primaryColor`, `secondaryColor`, `background`, `accentShape`, `titleColor`, `bodyTextColor`, `surfaceColor`, `surfaceTextColor`) so switching between dark/light themes restores proper text contrast.
- The panel keeps tab switching between **Temas** and **Colores** fully functional.

## Romantic Motion editorial redesign
- Romantic Motion was redesigned as an editorial, continuous wedding invitation experience inspired by modern Wix-style wedding pages.
- The template now uses a cream editorial atmosphere with elegant serif typography, generous spacing, layered gallery composition, and smooth section reveals.
- Added an invitation mini-header with initials and internal navigation links (`Historia`, `Cuándo y dónde`, `RSVP`), with mobile hamburger toggle support.
- Hero section now acts as the visual anchor with large names, minimalist countdown, date/location metadata and a ghost CTA (`Confirmar asistencia`).
- Story section uses asymmetric editorial composition (text + image placeholder) with subtle parallax-like reveal.
- Timeline title and flow were adapted to an editorial itinerary style (`Cuándo y dónde`) with staggered reveal.
- Map remains enabled by default and renders iframe embed when available, with polished cream wrapper and `Abrir en Google Maps` access.
- RSVP was upgraded to include fields for full name, attendance, companions, and dietary restrictions, keeping backend disconnected and emitting/logging payload locally.
- Scroll animations continue to use native `IntersectionObserver` and CSS transitions (no external animation libraries).
- Mobile behavior was tuned for beauty and readability: centered hero, clamp typography, stacked gallery, mobile nav menu, full-width RSVP controls, and responsive map height.

## Critical editor/template fixes
- Extras toggle now treats `invitation.blocks` as the single source of truth and never deletes blocks when disabling; `toggleBlock(type)` only flips `enabled` and recreates missing blocks from `createDefaultBlock(type)`.
- Added block order normalization to keep stable `order` values (`1..n`) after toggles/reorders while preserving disabled blocks in the array.
- Mobile width issues were fixed by forcing `html/body/#app` and editor containers to hide horizontal overflow and by keeping mobile panels/canvas at full width.
- Countdown reliability remains enforced with explicit 4-unit output (`Días`, `Horas`, `Minutos`, `Segundos`) and responsive 4-column desktop / 2x2 mobile layout.
- Theme contrast rules were reinforced with expanded preset tokens (`surfaceColor`, `surfaceTextColor`, `mutedTextColor`) to avoid unreadable light text on light surfaces in dark/light switches.
- Theme catalog was restored/expanded with classic, romantic, boho, dark premium, and developer-oriented themes (including IDE Dark and IDE Matrix).

## High-End Editorial Romantic Motion Template
- Romantic Motion was upgraded to a luxury editorial concept inspired by high-end Wix wedding websites.
- Design foundations:
  - cream editorial base,
  - charcoal typography,
  - elegant accent color,
  - refined serif + sans hierarchy,
  - generous whitespace and continuous one-page narrative.
- Core sections included in flow:
  - sticky invitation header (desktop nav + mobile hamburger),
  - full-screen hero,
  - minimalist countdown,
  - story split section,
  - event details,
  - masonry gallery with lightbox,
  - registry strip,
  - map with embedded frame,
  - editorial dark RSVP section.
- Animations use custom `IntersectionObserver` + CSS reveal classes (`motion-section`, `motion-left`, `motion-right`, `motion-fade`, `is-visible`).
- No AOS/external animation library is used yet.
- Future option is documented in code comments for optional AOS migration.
- Mobile behavior includes no horizontal overflow, stacked content, responsive map, and full-width RSVP controls.


## HU-90 Global editorial theming
- `editorialClassic` is now the default palette for `romantic-01` with cream/white/charcoal tokens and RSVP contrast-safe colors.
- Romantic Motion exposes global CSS variables (`--template-*`) to theme hero, countdown, story, gallery, event, registry, map and RSVP surfaces/text consistently.
- Reusable blocks inherit template variables via `--block-*` aliases to avoid hardcoded section colors and preserve readability across light/dark switches.
- Theme switching now copies all color fields to `invitation.styles`, preventing stale values during dark↔light transitions.


## Romantic Motion Layout
- Header fijo superior con estado transparente y fondo sólido al hacer scroll.
- Hero full-screen editorial con overlay, tipografía destacada y CTA RSVP.
- Extras reutilizados (Countdown/Story/Gallery/Map/RSVP) sin recrear data: solo se renderizan si el bloque está habilitado.
- Flujo continuo de secciones (detalles, registro, FAQ, RSVP) sin UI del editor dentro de la vista pública.
- El preview permanece limpio y de ancho completo, sin paneles internos adicionales.

## Romantic Motion Wix-style editorial redesign
- Se rediseñó el template `romantic-01` con estructura editorial premium: header fijo, hero, story, details, parallax quote, RSVP, map+FAQ y footer.
- `romantic-01` mantiene `editorialClassic` como tema por defecto y usa colores de alto contraste para hero, detalles, RSVP suave (`#EFEBE9`) y footer oscuro.
- Los extras reutilizables (Countdown/Gallery/Map/RSVP) no se recrean: solo se renderizan cuando están habilitados y se estilizan por wrappers del template.
- Se agregó sección intermedia parallax (desktop fixed, mobile scroll fallback) y acordeón de FAQ sin librerías externas.
- El template usa `IntersectionObserver` para revelar secciones con `motion-section`, `motion-left`, `motion-right`.
- Ajustes responsive: menú hamburguesa full-screen, columnas apiladas en móvil, hero adaptable y control estricto de overflow horizontal.

### Hero refinement (Romantic Motion)
- El hero se ajustó a estilo premium tipo Wix: altura completa `100vh` con `min-height` de `720px` desktop y `640px` móvil.
- Fondo dinámico: usa `heroImage` cuando existe y cae a gradiente editorial si no hay imagen.
- Overlay unificado por variable `--inv-hero-overlay` con opacidad cinematográfica.
- Contenido principal optimizado: microcopy, nombres grandes serif (`clamp(4rem,10vw,8rem)`), fecha/lugar y CTA RSVP ghost.
- Se agregó indicador de scroll animado para reforzar narrativa one-page.
- Se cuidó wrapping y overflow en móvil para evitar scroll horizontal.

### Countdown editorial style fix
- `CountdownBlock` ahora usa estructura explícita con 4 unidades visibles siempre: Días, Horas, Minutos, Segundos.
- En variante `editorial` se removió el look de tarjetas pesadas y se priorizó tipografía grande para números + labels pequeños en mayúscula.
- Desktop usa 4 columnas y móvil cambia automáticamente a grilla 2x2.
- El bloque toma colores desde variables de tema (`--template-countdown-number`, `--template-countdown-label`, `--template-title-color`) para mantener contraste consistente.

### RSVPBlock premium editorial update
- El bloque RSVP ahora usa estado local con `v-model` para: `fullName`, `attendance`, `guestsCount`, `foodRestrictions`.
- Al enviar, emite el payload exacto `{ fullName, attendance, guestsCount, foodRestrictions }` sin integración backend.
- Se aplicó estilo editorial premium: inputs limpios con borde inferior, espaciado consistente y botón personalizado sin apariencia nativa del navegador.
- En Romantic Motion, fondo/texto del RSVP se controlan por `--template-rsvp-bg` y `--template-rsvp-text`.
- Se muestra mensaje de éxito tras confirmar asistencia.

### Map + FAQ section improvements (Romantic Motion)
- La sección ahora usa layout de dos columnas en desktop: mapa a la izquierda y FAQ a la derecha.
- En mobile, el contenido se apila en orden mapa → FAQ para mejor lectura.
- `MapBlock` fue refinado con marco redondeado, sombra suave, nombre/dirección y CTA "Abrir en Google Maps" incluso cuando hay embed.
- El acordeón FAQ usa iconos +/- y transición suave de apertura/cierre con bordes sutiles.
- Todo el estilo usa variables de tema y controles sin apariencia nativa por defecto.


### Gallery / Parallax refinement
- Se añadió una sección parallax con cita central: "Cada historia de amor merece celebrarse", overlay suave y fallback responsive.
- Desktop usa `background-attachment: fixed`; mobile usa `scroll` para compatibilidad iOS.
- `GalleryBlock` ahora usa layout tipo masonry, placeholders elegantes, zoom hover y lightbox nativo (sin librerías externas).


### Scroll reveal animations (Romantic Motion)
- Se usa `IntersectionObserver` propio para revelar secciones una sola vez al entrar al viewport.
- Clases activas: `motion-section`, `motion-left`, `motion-right`, `motion-fade`, `is-visible`.
- Efectos: fade-up, entrada desde izquierda y entrada desde derecha con transición `all 0.6s cubic-bezier(0.4, 0, 0.2, 1)`.
- Navegación interna mantiene desplazamiento suave (`scroll-behavior: smooth`).
- TODO documentado en código: evaluar reemplazo por AOS en el futuro si se necesita.


### Hero and quote theme binding
- Hero usa variables dedicadas: `--template-hero-bg`, `--template-hero-overlay`, `--template-hero-text`, `--template-hero-accent`.
- Parallax quote usa: `--template-quote-bg`, `--template-quote-overlay`, `--template-quote-text`.
- Las presets incluyen esos campos para evitar fondos/textos fijos y respetar contraste (texto claro en fondos oscuros y texto oscuro en fondos claros).

### Reusable semantic theme tokens
- `themePresets` ahora define `tokens` semánticos (page, section, hero, quote, button, RSVP, footer, textos y bordes).
- `builder.store` guarda `styles.themeTokens` al aplicar tema y además mantiene campos legacy por compatibilidad.
- `RomanticMotionTemplate` consume tokens vía variables CSS (`--theme-*`) en vez de colores sueltos.
- Este enfoque permite reutilizar el mismo contrato visual en futuros templates sin hardcodear colores por sección.


### Theme switching repair
- El selector de temas ahora llama al flujo del store (`applyTheme`) en lugar de mutar estado local parcial.
- `applyTheme` reemplaza `themeTokens` completo y reasigna `invitation`/`styles` para garantizar reactividad en Vue/Pinia.
- Romantic Motion consume variables raíz `--theme-*` derivadas de `styles.themeTokens`, evitando mezclas con valores viejos.


### Default romantic-01 theme: Modern Rustic
- `romantic-01` ahora inicia con `backgroundTheme: "modernRustic"` y tokens cálidos editoriales por defecto.
- `editorialClassic` se mantiene disponible como alternativa, pero ya no es el preset inicial del draft romántico.


### Modern Rustic default theme and contrast rules
- `modernRustic` mantiene hero claro (`#F7F7F5`) con texto oscuro y alternancia de secciones claras/cálidas.
- Regla global: fondos claros -> texto oscuro; fondos oscuros -> texto claro.
- Se agregó helper de contraste (`getReadableTextColor`) para fallback seguro cuando falta texto en tokens.
- Hero y quote usan tokens dedicados (incluyendo botones del hero) para evitar texto ilegible.
- El fallback de contraste prioriza `styles.themeTokens` y solo aplica color automático cuando un token de texto no está definido.
