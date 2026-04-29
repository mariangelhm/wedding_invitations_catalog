// Application entry point that wires together Vue, Pinia, router, and global styles.
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './core/router';
import './styles/main.css';

const app = createApp(App);

// Register Pinia as the global state manager for the full app.
app.use(createPinia());

// Register Vue Router for navigation and route-driven rendering.
app.use(router);

// Mount the app to the #app node defined in index.html.
app.mount('#app');
