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
