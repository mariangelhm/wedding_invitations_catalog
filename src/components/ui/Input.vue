<!-- Reusable labeled input component. -->
<script setup>
const props = defineProps({ modelValue: { type: String, default: '' }, label: { type: String, default: '' }, type: { type: String, default: 'text' } });
const emit = defineEmits(['update:modelValue']);
const onInput = (event) => emit('update:modelValue', event.target.value);
</script>
<template>
  <label class="ui-field">
    <span class="ui-field__label">{{ label }}</span>
    <input class="ui-field__control" :type="type" :value="props.modelValue" @input="onInput" />
  </label>
</template>
<style scoped>
.ui-field { display:grid; gap:.35rem; }
.ui-field__label { font-size:.9rem; }
.ui-field__control { padding:.6rem .75rem; border:1px solid #d1d5db; border-radius:.55rem; outline:none; }
.ui-field__control:focus { border-color:#8b5a7a; box-shadow:0 0 0 3px rgba(139,90,122,.15); }
</style>
