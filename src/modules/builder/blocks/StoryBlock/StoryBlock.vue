<script setup>
const props = defineProps({
  message: { type: String, default: '' },
  title: { type: String, default: 'Nuestra historia' },
});

// Reusable content block:
// designed to render narrative wedding copy in a romantic, readable card.
</script>

<template>
  <section class="story-card">
    <h3>{{ title }}</h3>
    <p class="story-message">{{ message || 'Aquí podrás contar su historia y compartir momentos especiales.' }}</p>
  </section>
</template>

<style scoped>
.story-card { border: 1px solid #E5E7EB; border-radius: 16px; background: #fff; padding: 16px; box-shadow: 0 8px 18px rgba(17,24,39,.08); }
.story-card h3 { color: #C7355C; margin-bottom: 10px; font-family: Georgia, 'Times New Roman', serif; }
.story-message { color: #374151; line-height: 1.75; font-size: 1rem; }
@media (max-width: 640px) { .story-card { padding: 12px; } .story-message { font-size: 0.96rem; } }
</style>
