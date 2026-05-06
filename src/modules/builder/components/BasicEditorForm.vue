<script setup>
import { computed, onMounted } from 'vue';
import Input from '../../../components/ui/Input.vue';
import TextArea from '../../../components/ui/TextArea.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();
onMounted(() => { if (!builderStore.invitation) builderStore.createDraftInvitation(); });

const fieldModel = (field) => computed({
  get: () => builderStore.invitation?.base?.[field] || '',
  set: (value) => builderStore.updateBaseField(field, value),
});

const coupleNames = fieldModel('coupleNames');
const eventDate = fieldModel('eventDate');
const locationName = fieldModel('locationName');
const locationAddress = fieldModel('locationAddress');
const message = fieldModel('message');
const storyMessage = fieldModel('storyMessage');
</script>

<template>
  <section class="basic-editor-form">
    <h2>Información de la tarjeta</h2>
    <div v-if="builderStore.invitation" class="form-fields">
      <Input v-model="coupleNames" label="Nombres" />
      <Input v-model="eventDate" label="Fecha" />
      <Input v-model="locationName" label="Lugar" />
      <Input v-model="locationAddress" label="Dirección" />
      <TextArea v-model="message" label="Mensaje principal" :rows="3" />
      <TextArea v-model="storyMessage" label="Historia de los novios" :rows="5" />
    </div>
  </section>
</template>
