// Centralized router setup for the core application layer.
import { createRouter, createWebHistory } from 'vue-router';

import LandingView from '../../modules/landing/LandingView.vue';

// Basic route table kept intentionally small for initial scaffolding.
const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
  },
];

// Export a configured router instance for use in src/main.js.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
