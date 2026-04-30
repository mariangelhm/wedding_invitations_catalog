<script setup>
defineProps({ items: { type: Array, required: true } });
</script>

<template>
  <nav class="app-breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
      <RouterLink v-if="item.to && index !== items.length - 1" :to="item.to">{{ item.label }}</RouterLink>
      <span v-else>{{ item.label }}</span>
      <span v-if="index !== items.length - 1">/</span>
    </template>
  </nav>
</template>

<style scoped>
.app-breadcrumb { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.92rem; color: var(--color-text-muted); margin-top: 8px; }
.app-breadcrumb a { color: var(--color-text-main); text-decoration: none; }
.app-breadcrumb a:hover { color: var(--color-primary); }
</style>
