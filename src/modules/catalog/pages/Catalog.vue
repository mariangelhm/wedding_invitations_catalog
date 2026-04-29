<!--
  Catalog page.
  Presents available invitation templates before entering the editor.
-->
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock catalog templates used for initial structure and flow testing.
const templates = [
  {
    name: 'Romantic',
    description: 'Soft tones and floral details for a warm, intimate style.',
    basePrice: 20000,
  },
  {
    name: 'Minimal',
    description: 'Clean layout with modern typography and subtle accents.',
    basePrice: 18000,
  },
  {
    name: 'Elegant',
    description: 'Classic composition with refined spacing and premium feel.',
    basePrice: 22000,
  },
];

// Card action routes users into the editor workflow.
const goToEditor = () => {
  router.push('/editor');
};
</script>

<template>
  <main class="catalog-page">
    <h1>Template Catalog</h1>

    <!--
      Card list structure:
      Each item represents one template option with basic information
      and a direct CTA into customization flow.
    -->
    <section class="catalog-grid">
      <article v-for="template in templates" :key="template.name" class="catalog-card">
        <h2>{{ template.name }}</h2>
        <p>{{ template.description }}</p>
        <p><strong>Base price:</strong> {{ template.basePrice }}</p>
        <button type="button" @click="goToEditor">Customize</button>
      </article>
    </section>
  </main>
</template>

<style scoped>
/* Keep visual styles minimal and focused on clarity. */
.catalog-page {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.catalog-grid {
  display: grid;
  gap: 1rem;
}

.catalog-card {
  border: 1px solid #d1d5db;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
}

button {
  width: fit-content;
}
</style>
