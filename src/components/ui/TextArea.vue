<!-- Reusable labeled textarea component. -->
<script setup>
const props = defineProps({ modelValue: { type: String, default: '' }, label: { type: String, default: '' }, rows: { type: Number, default: 4 } });
const emit = defineEmits(['update:modelValue']);
const onInput = (event) => emit('update:modelValue', event.target.value);
</script>
<template>
  <label class="ui-field">
    <span class="ui-field__label">{{ label }}</span>
    <textarea class="ui-field__control" :rows="rows" :value="props.modelValue" @input="onInput"></textarea>
  </label>
</template>
<style scoped>
.ui-field { display:grid; gap:.35rem; }
.ui-field__label { font-size:.9rem; }
.ui-field__control { padding:.6rem .75rem; border:1px solid #d1d5db; border-radius:.55rem; outline:none; resize:vertical; }
.ui-field__control:focus { border-color:#8b5a7a; box-shadow:0 0 0 3px rgba(139,90,122,.15); }
</style>
