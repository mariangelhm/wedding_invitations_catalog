<!--
  Marketplace-style catalog page.
  Uses global Header/Footer from MainLayout and i18n for all visible texts.
-->
<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useI18n } from '../../../core/i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const categoryKeys = ['all', 'romantic', 'elegant', 'modern', 'minimal', 'themed'];
const categoryToLabel = {
  all: 'all',
  romantic: 'romantic',
  elegant: 'elegant',
  modern: 'modern',
  minimal: 'minimal',
  themed: 'themed',
};

const activeCategory = ref('all');
const sortOption = ref('popular');

// Mock marketplace data with customizable options metadata per template.
const templates = [
  { id: 'romantic-01', name: 'Romántica Clásica', category: 'romantic', level: 'medium', basePrice: 20000, popular: true, shortDescription: 'Diseño delicado y elegante para bodas románticas.', previewStyle: { background: '#FFF7FA', accentColor: '#C7355C', textColor: '#111827' }, customizableOptions: { colors: true, fonts: true, music: true, photos: true, map: true, countdown: true } },
  { id: 'elegant-01', name: 'Elegancia Dorada', category: 'elegant', level: 'full', basePrice: 29000, popular: true, shortDescription: 'Estilo premium con acentos sobrios y gran presencia visual.', previewStyle: { background: '#FFFDF7', accentColor: '#9A7B31', textColor: '#1F2937' }, customizableOptions: { colors: true, fonts: true, music: true, photos: true, map: true, countdown: true } },
  { id: 'modern-01', name: 'Moderna Urbana', category: 'modern', level: 'medium', basePrice: 21000, popular: true, shortDescription: 'Tipografías limpias y composición actual para parejas modernas.', previewStyle: { background: '#F3F8FF', accentColor: '#315E9A', textColor: '#0F172A' }, customizableOptions: { colors: true, fonts: true, music: false, photos: true, map: true, countdown: true } },
  { id: 'minimal-01', name: 'Minimal Blanca', category: 'minimal', level: 'basic', basePrice: 16000, popular: false, shortDescription: 'Diseño simple, armonioso y centrado en la información clave.', previewStyle: { background: '#FFFFFF', accentColor: '#6B7280', textColor: '#111827' }, customizableOptions: { colors: true, fonts: true, music: false, photos: false, map: true, countdown: true } },
  { id: 'theme-01', name: 'Jardín Encantado', category: 'themed', level: 'full', basePrice: 32000, popular: false, shortDescription: 'Inspiración botánica con detalles visuales para bodas al aire libre.', previewStyle: { background: '#F2FBF6', accentColor: '#2F855A', textColor: '#1B4332' }, customizableOptions: { colors: true, fonts: true, music: true, photos: true, map: true, countdown: true } },
  { id: 'romantic-02', name: 'Rosa Vintage', category: 'romantic', level: 'basic', basePrice: 17000, popular: false, shortDescription: 'Estética cálida con toques clásicos y románticos.', previewStyle: { background: '#FFF1F5', accentColor: '#B83280', textColor: '#2D1E2F' }, customizableOptions: { colors: true, fonts: true, music: true, photos: false, map: true, countdown: true } },
  { id: 'elegant-02', name: 'Marfil Editorial', category: 'elegant', level: 'medium', basePrice: 24000, popular: false, shortDescription: 'Composición editorial refinada para ceremonias formales.', previewStyle: { background: '#FAF7F2', accentColor: '#7C5E3C', textColor: '#1F2937' }, customizableOptions: { colors: true, fonts: true, music: true, photos: true, map: true, countdown: false } },
  { id: 'modern-02', name: 'Neón Chic', category: 'modern', level: 'full', basePrice: 28000, popular: true, shortDescription: 'Diseño atrevido para celebraciones con identidad contemporánea.', previewStyle: { background: '#F4F0FF', accentColor: '#6D28D9', textColor: '#111827' }, customizableOptions: { colors: true, fonts: true, music: true, photos: true, map: false, countdown: true } },
];

const formatPrice = (value) => `$${new Intl.NumberFormat('es-CL').format(value)}`;
const translateCategory = (category) => t(`catalog.filters.${categoryToLabel[category]}`);
const translateLevel = (level) => t(`catalog.card.${level}`);

const visibleTemplates = computed(() => {
  const filtered = activeCategory.value === 'all' ? templates : templates.filter((template) => template.category === activeCategory.value);

  return [...filtered].sort((a, b) => {
    if (sortOption.value === 'low') return a.basePrice - b.basePrice;
    if (sortOption.value === 'high') return b.basePrice - a.basePrice;
    if (a.popular === b.popular) return a.basePrice - b.basePrice;
    return a.popular ? -1 : 1;
  });
});

const viewTemplateDetail = (template) => router.push(`/catalog/${template.id}`);
const personalizeTemplate = (template) => router.push(`/editor?templateId=${template.id}`);

const selectedTemplate = computed(() => templates.find((item) => item.id === route.params.id) || null);
</script>

<template>
  <main class="catalog-page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">{{ t('catalog.breadcrumbHome') }}</RouterLink>
      <span>/</span>
      <span>{{ t('catalog.breadcrumbCatalog') }}</span>
      <span v-if="selectedTemplate">/ {{ selectedTemplate.name }}</span>
    </nav>

    <section class="catalog-header">
      <span class="catalog-badge">{{ t('catalog.badge') }}</span>
      <h1>{{ t('catalog.title') }}</h1>
      <p>{{ t('catalog.subtitle') }}</p>
    </section>

    <section class="catalog-toolbar">
      <div class="catalog-filters">
        <button v-for="category in categoryKeys" :key="category" class="filter-pill" :class="{ 'filter-pill--active': activeCategory === category }" @click="activeCategory = category">
          {{ t(`catalog.filters.${category}`) }}
        </button>
      </div>

      <label class="sort-control">
        <span>{{ t('catalog.sort.label') }}</span>
        <select v-model="sortOption">
          <option value="popular">{{ t('catalog.sort.popular') }}</option>
          <option value="low">{{ t('catalog.sort.lowPrice') }}</option>
          <option value="high">{{ t('catalog.sort.highPrice') }}</option>
        </select>
      </label>
    </section>

    <section class="catalog-grid">
      <article v-for="template in visibleTemplates" :key="template.id" class="template-card">
        <div class="preview-shell" :style="{ background: template.previewStyle.background }">
          <div class="mini-invitation" :style="{ color: template.previewStyle.textColor, borderColor: template.previewStyle.accentColor }">
            <p class="mini-kicker">{{ t('catalog.breadcrumbCatalog') }}</p>
            <h3>María &amp; Carlos</h3>
            <div class="mini-divider" :style="{ background: template.previewStyle.accentColor }">❤</div>
            <p class="mini-date">16 · Noviembre · 2026</p>
          </div>
        </div>

        <div class="card-body">
          <div class="card-top">
            <div>
              <p class="card-category">{{ translateCategory(template.category) }}</p>
              <h2>{{ template.name }}</h2>
            </div>
            <span class="level-badge">{{ translateLevel(template.level) }}</span>
          </div>
          <p class="card-price">{{ t('catalog.card.from') }} {{ formatPrice(template.basePrice) }}</p>
          <p class="card-description">{{ template.shortDescription }}</p>
          <div class="card-actions">
            <button class="btn btn-secondary" type="button" @click="viewTemplateDetail(template)">{{ t('catalog.card.detail') }}</button>
            <button class="btn btn-primary" type="button" @click="personalizeTemplate(template)">{{ t('catalog.card.customize') }}</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped src="../styles/catalog.css"></style>
