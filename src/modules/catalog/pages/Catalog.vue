<!--
  Marketplace-style catalog page.
  Uses global Header/Footer from MainLayout and i18n for all visible texts.
-->
<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useI18n } from '../../../core/i18n';
import { templates } from '../data/templates';

const router = useRouter();
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

</script>

<template>
  <main class="catalog-page">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">{{ t('catalog.breadcrumbHome') }}</RouterLink>
      <span>/</span>
      <span>{{ t('catalog.breadcrumbCatalog') }}</span>
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
