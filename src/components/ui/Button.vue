<!--
  Reusable UI Button component.
  Keeps common button styles and behavior centralized.
-->
<script setup>
defineProps({
  label: {
    type: String,
    default: 'Button',
  },
  type: {
    type: String,
    default: 'button',
  },
});
</script>

<template>
  <button class="ui-button" :type="type">
    {{ label }}
  </button>
</template>

<style scoped>
.ui-button {
  --ui-primary-color: #8b5a7a;
  border: none;
  border-radius: 999px;
  background: var(--ui-primary-color);
  color: #fff;
  padding: 0.65rem 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.2s ease;
}
.ui-button:hover { filter: brightness(0.95); transform: translateY(-1px); }
</style>
