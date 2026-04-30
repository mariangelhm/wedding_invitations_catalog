<!--
  Catalog page.
  Presents invitation templates in a product-catalog style grid.
-->
<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Filter tabs shown at top of catalog.
const filters = ['Todos', 'Románticas', 'Modernas', 'Minimalistas'];
const activeFilter = ref('Todos');

// Mock catalog dataset with style category and preview metadata.
const templates = [
  {
    name: 'Romantic Rose',
    description: 'Soft floral style with elegant typography.',
    basePrice: 22000,
    styleType: 'Románticas',
    previewClass: 'preview-romantic',
  },
  {
    name: 'Modern Glow',
    description: 'Bold spacing and clean premium look.',
    basePrice: 21000,
    styleType: 'Modernas',
    previewClass: 'preview-modern',
  },
  {
    name: 'Minimal Pure',
    description: 'Simple monochrome composition for clarity.',
    basePrice: 18000,
    styleType: 'Minimalistas',
    previewClass: 'preview-minimal',
  },
  {
    name: 'Romantic Bloom',
    description: 'Delicate layout with warm ceremonial tone.',
    basePrice: 24000,
    styleType: 'Románticas',
    previewClass: 'preview-romantic',
  },
];

// Filtered list powers the product grid based on selected style tab.
const filteredTemplates = computed(() => {
  if (activeFilter.value === 'Todos') return templates;
  return templates.filter((template) => template.styleType === activeFilter.value);
});

const goToEditor = () => {
  router.push('/editor');
};
</script>

<template>
  <main class="catalog-page">
    <header class="catalog-header">
      <h1>Template Catalog</h1>
      <p>Choose a style and start customizing your invitation.</p>
    </header>

    <!--
      Top filter bar:
      Helps users narrow the catalog by style family.
    -->
    <section class="catalog-filters">
      <button
        v-for="filter in filters"
        :key="filter"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeFilter === filter }"
        type="button"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </section>

    <!--
      Product grid structure:
      Each card contains preview, badge, title, price, and action button.
    -->
    <section class="catalog-grid">
      <article v-for="template in filteredTemplates" :key="template.name" class="catalog-card">
        <div class="card-preview" :class="template.previewClass" aria-hidden="true"></div>

        <div class="card-content">
          <span class="style-badge">{{ template.styleType }}</span>
          <h2>{{ template.name }}</h2>
          <p class="card-description">{{ template.description }}</p>
          <p class="card-price">{{ template.basePrice }}</p>
          <button class="card-action" type="button" @click="goToEditor">Customize</button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped src="../styles/catalog.css"></style>
