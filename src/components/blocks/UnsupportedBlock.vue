<script setup>
defineProps({ block: { type: Object, default: () => ({}) } });
</script>

<template>
  <div class="unsupported-block-debug">
    Extra no soportado: {{ block?.label || block?.type || 'sin tipo' }}
  </div>
</template>

<style scoped>
.unsupported-block-debug {
  border: 2px dashed #c2410c;
  background: #fff7ed;
  color: #7c2d12;
  font-family: monospace;
  font-size: 0.95rem;
  margin: 1rem 0;
  padding: 1rem;
}
</style>
