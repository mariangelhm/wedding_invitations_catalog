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
