<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '../../../core/i18n';
import { templates } from '../data/templates';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const template = computed(() => templates.find((item) => item.id === route.params.id));
const similarTemplates = computed(() => template.value ? templates.filter((item) => item.category === template.value.category && item.id !== template.value.id).slice(0,3) : []);
const formatPrice = (v) => `$${new Intl.NumberFormat('es-CL').format(v)}`;
const goEditor = (id) => router.push(`/editor?templateId=${id}`);
const goPreview = (id) => router.push(`/catalog/${id}/preview`);
</script>

<template>
  <main class="catalog-page detail-page">
    <nav class="breadcrumb"><RouterLink to="/">{{ t('templateDetail.breadcrumbHome') }}</RouterLink><span>/</span><RouterLink to="/catalog">{{ t('templateDetail.breadcrumbCatalog') }}</RouterLink><span v-if="template">/ {{ template.name }}</span></nav>

    <section v-if="template" class="detail-grid">
      <div class="preview-shell" :style="{ background: template.previewStyle.background }"><div class="mini-invitation large" :style="{ color: template.previewStyle.textColor, borderColor: template.previewStyle.accentColor }"><p class="mini-kicker">{{ t('templateDetail.breadcrumbCatalog') }}</p><h3>María &amp; Carlos</h3><div class="mini-divider" :style="{ background: template.previewStyle.accentColor }">❤</div><p class="mini-date">16 · Noviembre · 2026</p></div></div>
      <div class="detail-info">
        <h1>{{ template.name }}</h1>
        <p class="card-category">{{ t(`catalog.filters.${template.category}`) }}</p>
        <span class="level-badge">{{ t(`catalog.card.${template.level}`) }}</span>
        <p class="card-price">{{ t('templateDetail.from') }} {{ formatPrice(template.basePrice) }}</p>
        <p class="card-description">{{ template.shortDescription }}</p>
        <h3>{{ t('templateDetail.includes') }}</h3>
        <ul class="feature-list">
          <li>Colores</li><li>Tipografías</li><li>Fotos</li><li>Música</li><li>Mapa</li><li>Cuenta regresiva</li><li>Confirmación de asistencia</li>
        </ul>
        <div class="card-actions"><button class="btn btn-primary" @click="goEditor(template.id)">{{ t('templateDetail.customize') }}</button><button class="btn btn-secondary" @click="goPreview(template.id)">{{ t('templateDetail.preview') }}</button></div>
      </div>
    </section>

    <p v-else class="not-found">{{ t('templateDetail.notFound') }}</p>

    <section v-if="template" class="similar-block">
      <h2>{{ t('templateDetail.similar') }}</h2>
      <div class="catalog-grid">
        <article v-for="item in similarTemplates" :key="item.id" class="template-card"><div class="card-body"><h3>{{ item.name }}</h3><p class="card-price">{{ t('templateDetail.from') }} {{ formatPrice(item.basePrice) }}</p><div class="card-actions"><button class="btn btn-secondary" @click="router.push(`/catalog/${item.id}`)">{{ t('catalog.card.detail') }}</button><button class="btn btn-primary" @click="goEditor(item.id)">{{ t('catalog.card.customize') }}</button></div></div></article>
      </div>
    </section>
  </main>
</template>

<style scoped src="../styles/catalog.css"></style>
