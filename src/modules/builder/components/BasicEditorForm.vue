<script setup>
import { onMounted } from 'vue';
import Input from '../../../components/ui/Input.vue';
import TextArea from '../../../components/ui/TextArea.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();
onMounted(() => { if (!builderStore.invitation) builderStore.createDraftInvitation(); });
</script>

<template>
  <section class="basic-editor-form">
    <h2>Información de la tarjeta</h2>
    <div v-if="builderStore.invitation" class="form-fields">
      <Input v-model="builderStore.invitation.base.names" label="Nombres" />
      <Input v-model="builderStore.invitation.base.date" label="Fecha" />
      <Input v-model="builderStore.invitation.base.location" label="Ubicación" />
      <TextArea v-model="builderStore.invitation.base.heroMessage" label="Mensaje principal" :rows="3" />
      <TextArea v-model="builderStore.invitation.base.storyMessage" label="Historia de los novios" :rows="5" />
    </div>
  </section>
</template>
