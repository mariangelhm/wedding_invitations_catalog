// Centralized router setup for primary app navigation.
import { createRouter, createWebHistory } from 'vue-router';

import Editor from '../../modules/builder/pages/Editor.vue';
import Catalog from '../../modules/catalog/pages/Catalog.vue';
import PublicInvitation from '../../modules/invitations/pages/PublicInvitation.vue';
import Home from '../../modules/landing/pages/Home.vue';

// Routing structure:
// - /            : landing page entry point
// - /catalog     : template catalog page
// - /catalog/:id : template detail path (currently rendered by catalog page)
// - /editor      : invitation builder workspace
// - /i/:id       : public invitation link with dynamic id parameter
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/catalog', name: 'catalog', component: Catalog },
  { path: '/catalog/:id', name: 'catalog-detail', component: Catalog },
  { path: '/editor', name: 'editor', component: Editor },
  { path: '/i/:id', name: 'public-invitation', component: PublicInvitation },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
