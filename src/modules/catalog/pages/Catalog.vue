<!--
  Marketplace-style catalog page.
  Uses shared app layout (MainLayout + Footer) from global shell.
-->
<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const categories = ['Todas', 'Románticas', 'Elegantes', 'Modernas', 'Minimalistas', 'Temáticas'];
const activeCategory = ref('Todas');
const sortOption = ref('popular');

// Local mock templates dataset used to render marketplace cards.
const templates = [
  {
    id: 'romantic-01',
    name: 'Romántica Clásica',
    category: 'Románticas',
    level: 'Media',
    basePrice: 20000,
    popular: true,
    shortDescription: 'Diseño delicado y elegante para bodas románticas.',
    previewStyle: { background: '#FFF7FA', accentColor: '#C7355C', textColor: '#111827' },
  },
  {
    id: 'elegant-01',
    name: 'Elegancia Dorada',
    category: 'Elegantes',
    level: 'Full',
    basePrice: 29000,
    popular: true,
    shortDescription: 'Estilo premium con acentos sobrios y gran presencia visual.',
    previewStyle: { background: '#FFFDF7', accentColor: '#9A7B31', textColor: '#1F2937' },
  },
  {
    id: 'modern-01',
    name: 'Moderna Urbana',
    category: 'Modernas',
    level: 'Media',
    basePrice: 21000,
    popular: true,
    shortDescription: 'Tipografías limpias y composición actual para parejas modernas.',
    previewStyle: { background: '#F3F8FF', accentColor: '#315E9A', textColor: '#0F172A' },
  },
  {
    id: 'minimal-01',
    name: 'Minimal Blanca',
    category: 'Minimalistas',
    level: 'Básica',
    basePrice: 16000,
    popular: false,
    shortDescription: 'Diseño simple, armonioso y centrado en la información clave.',
    previewStyle: { background: '#FFFFFF', accentColor: '#6B7280', textColor: '#111827' },
  },
  {
    id: 'theme-01',
    name: 'Jardín Encantado',
    category: 'Temáticas',
    level: 'Full',
    basePrice: 32000,
    popular: false,
    shortDescription: 'Inspiración botánica con detalles visuales para bodas al aire libre.',
    previewStyle: { background: '#F2FBF6', accentColor: '#2F855A', textColor: '#1B4332' },
  },
  {
    id: 'romantic-02',
    name: 'Rosa Vintage',
    category: 'Románticas',
    level: 'Básica',
    basePrice: 17000,
    popular: false,
    shortDescription: 'Estética cálida con toques clásicos y románticos.',
    previewStyle: { background: '#FFF1F5', accentColor: '#B83280', textColor: '#2D1E2F' },
  },
  {
    id: 'elegant-02',
    name: 'Marfil Editorial',
    category: 'Elegantes',
    level: 'Media',
    basePrice: 24000,
    popular: false,
    shortDescription: 'Composición editorial refinada para ceremonias formales.',
    previewStyle: { background: '#FAF7F2', accentColor: '#7C5E3C', textColor: '#1F2937' },
  },
  {
    id: 'modern-02',
    name: 'Neón Chic',
    category: 'Modernas',
    level: 'Full',
    basePrice: 28000,
    popular: true,
    shortDescription: 'Diseño atrevido para celebraciones con identidad contemporánea.',
    previewStyle: { background: '#F4F0FF', accentColor: '#6D28D9', textColor: '#111827' },
  },
];

const formatPrice = (value) => `$${new Intl.NumberFormat('es-CL').format(value)}`;

const visibleTemplates = computed(() => {
  const filtered =
    activeCategory.value === 'Todas'
      ? templates
      : templates.filter((template) => template.category === activeCategory.value);

  return [...filtered].sort((a, b) => {
    if (sortOption.value === 'price-asc') return a.basePrice - b.basePrice;
    if (sortOption.value === 'price-desc') return b.basePrice - a.basePrice;

    // Popular sorting first: popular items first, then by lower price.
    if (a.popular === b.popular) return a.basePrice - b.basePrice;
    return a.popular ? -1 : 1;
  });
});

const personalizeTemplate = () => router.push('/editor');

const viewTemplateDetail = (template) => {
  const detailRoute = `/catalog/${template.id}`;
  if (router.hasRoute('catalog-detail')) {
    router.push(detailRoute);
    return;
  }

  // Fallback behavior until dedicated detail route is available.
  console.log('Template selected', template);
};
</script>

<template>
  <main class="catalog-page">
    <section class="catalog-header">
      <span class="catalog-badge">Templates personalizables</span>
      <h1>Catálogo de invitaciones</h1>
      <p>Elige el diseño perfecto y personalízalo en minutos.</p>
    </section>

    <section class="catalog-toolbar">
      <div class="catalog-filters" aria-label="Filtros por categoría">
        <button
          v-for="category in categories"
          :key="category"
          class="filter-pill"
          :class="{ 'filter-pill--active': activeCategory === category }"
          type="button"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <label class="sort-control">
        <span>Ordenar por</span>
        <select v-model="sortOption" aria-label="Ordenar templates">
          <option value="popular">Más populares</option>
          <option value="price-asc">Precio menor a mayor</option>
          <option value="price-desc">Precio mayor a menor</option>
        </select>
      </label>
    </section>

    <section class="catalog-grid" aria-live="polite">
      <article v-for="template in visibleTemplates" :key="template.id" class="template-card">
        <div class="preview-shell" :style="{ background: template.previewStyle.background }">
          <div class="mini-invitation" :style="{ color: template.previewStyle.textColor, borderColor: template.previewStyle.accentColor }">
            <p class="mini-kicker">Nos casamos</p>
            <h3>María &amp; Carlos</h3>
            <div class="mini-divider" :style="{ background: template.previewStyle.accentColor }">❤</div>
            <p class="mini-date">16 · Noviembre · 2026</p>
          </div>
        </div>

        <div class="card-body">
          <div class="card-top">
            <div>
              <p class="card-category">{{ template.category }}</p>
              <h2>{{ template.name }}</h2>
            </div>
            <span class="level-badge">{{ template.level }}</span>
          </div>

          <p class="card-price">Desde {{ formatPrice(template.basePrice) }}</p>
          <p class="card-description">{{ template.shortDescription }}</p>

          <div class="card-actions">
            <button class="btn btn-secondary" type="button" @click="viewTemplateDetail(template)">Ver detalle</button>
            <button class="btn btn-primary" type="button" @click="personalizeTemplate">Personalizar</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped src="../styles/catalog.css"></style>
