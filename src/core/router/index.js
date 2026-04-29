// Centralized router setup for the core application layer.
import { createRouter, createWebHistory } from 'vue-router';

import Editor from '../../modules/builder/pages/Editor.vue';
import Catalog from '../../modules/catalog/pages/Catalog.vue';
import PublicInvitation from '../../modules/invitations/pages/PublicInvitation.vue';
import Home from '../../modules/landing/pages/Home.vue';

// Route table:
// - /        public landing page
// - /catalog template catalog selection page
// - /editor  invitation builder workspace
// - /i/:id   public invitation page by id
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: Catalog,
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor,
  },
  {
    path: '/i/:id',
    name: 'public-invitation',
    component: PublicInvitation,
  },
];

// Export a configured router instance for use in src/main.js.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
