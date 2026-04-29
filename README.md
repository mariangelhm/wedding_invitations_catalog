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
