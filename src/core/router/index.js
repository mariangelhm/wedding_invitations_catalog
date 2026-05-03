import { createRouter, createWebHistory } from 'vue-router';
import Editor from '../../modules/builder/pages/Editor.vue';
import Catalog from '../../modules/catalog/pages/Catalog.vue';
import PublicInvitation from '../../modules/invitations/pages/PublicInvitation.vue';
import Home from '../../modules/landing/pages/Home.vue';

// Catalog templates now go directly to editor via /editor?templateId={id}
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/catalog', name: 'catalog', component: Catalog },
  { path: '/editor', name: 'editor', component: Editor },
  { path: '/i/:id', name: 'public-invitation', component: PublicInvitation },
];

export default createRouter({ history: createWebHistory(), routes });
