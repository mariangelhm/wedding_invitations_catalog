<script setup>
import { computed, onMounted } from 'vue';
import Input from '../../../components/ui/Input.vue';
import TextArea from '../../../components/ui/TextArea.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();
onMounted(() => { if (!builderStore.invitation) builderStore.createDraftInvitation(); });

const baseFieldModel = (field) => computed({
  get: () => builderStore.invitation?.base?.[field] || '',
  set: (value) => builderStore.updateBaseField(field, value),
});

const detailsFieldModel = (field) => computed({
  get: () => builderStore.invitation?.details?.[field] || '',
  set: (value) => builderStore.updateDetailsField(field, value),
});

const mapFieldModel = (field) => computed({
  get: () => builderStore.invitation?.map?.[field] || builderStore.invitation?.mapSettings?.[field] || '',
  set: (value) => builderStore.updateMapField(field, value),
});

const imageFieldModel = (field) => computed({
  get: () => builderStore.invitation?.images?.[field] || '',
  set: (value) => builderStore.updateImageField(field, value),
});

const galleryImageModel = (index) => computed({
  get: () => builderStore.invitation?.images?.galleryImages?.[index]?.src || '',
  set: (value) => builderStore.updateGalleryImage(index, value),
});

const faqModel = (index, field) => computed({
  get: () => builderStore.invitation?.faq?.[index]?.[field] || '',
  set: (value) => builderStore.updateFaqItem(index, field, value),
});

const coupleNames = baseFieldModel('coupleNames');
const eventDate = baseFieldModel('eventDate');
const locationName = baseFieldModel('locationName');
const locationAddress = baseFieldModel('locationAddress');
const message = baseFieldModel('message');
const storyMessage = baseFieldModel('storyMessage');
const countdownTargetDate = baseFieldModel('countdownTargetDate');

const ceremonyTitle = detailsFieldModel('ceremonyTitle');
const ceremonyDate = detailsFieldModel('ceremonyDate');
const ceremonyLocation = detailsFieldModel('ceremonyLocation');
const receptionTitle = detailsFieldModel('receptionTitle');
const receptionDate = detailsFieldModel('receptionDate');
const receptionLocation = detailsFieldModel('receptionLocation');

const mapUrl = mapFieldModel('mapUrl');
const embedUrl = mapFieldModel('embedUrl');

const heroImage = imageFieldModel('heroImage');
const storyImage = imageFieldModel('storyImage');
const parallaxImage = imageFieldModel('parallaxImage');
const detailsImage = imageFieldModel('detailsImage');
</script>

<template>
  <section class="basic-editor-form">
    <h2>Información de la tarjeta</h2>
    <div v-if="builderStore.invitation" class="form-fields">
      <Input v-model="coupleNames" label="Nombres" />
      <Input v-model="eventDate" label="Fecha" />
      <Input v-model="countdownTargetDate" label="Fecha para cuenta regresiva" />
      <Input v-model="locationName" label="Lugar" />
      <Input v-model="locationAddress" label="Dirección" />
      <TextArea v-model="message" label="Mensaje principal" :rows="3" />
      <TextArea v-model="storyMessage" label="Historia de los novios" :rows="5" />

      <h3>Detalles del evento</h3>
      <Input v-model="ceremonyTitle" label="Título ceremonia" />
      <Input v-model="ceremonyDate" label="Fecha ceremonia" />
      <Input v-model="ceremonyLocation" label="Lugar ceremonia" />
      <Input v-model="receptionTitle" label="Título recepción" />
      <Input v-model="receptionDate" label="Fecha recepción" />
      <Input v-model="receptionLocation" label="Lugar recepción" />

      <h3>Mapa</h3>
      <Input v-model="mapUrl" label="URL de Google Maps" />
      <Input v-model="embedUrl" label="URL de insertar mapa" />

      <h3>Imágenes</h3>
      <Input v-model="heroImage" label="Imagen hero" />
      <Input v-model="storyImage" label="Imagen historia" />
      <Input v-model="parallaxImage" label="Imagen parallax" />
      <Input v-model="detailsImage" label="Imagen detalles" />
      <Input
        v-for="(image, index) in builderStore.invitation.images.galleryImages"
        :key="`gallery-image-${index}`"
        :model-value="galleryImageModel(index).value"
        :label="`Imagen galería ${index + 1}`"
        @update:model-value="galleryImageModel(index).value = $event"
      />

      <h3>Preguntas frecuentes</h3>
      <div v-for="(item, index) in builderStore.invitation.faq" :key="item.id" class="form-fields">
        <Input :model-value="faqModel(index, 'question').value" :label="`Pregunta ${index + 1}`" @update:model-value="faqModel(index, 'question').value = $event" />
        <TextArea :model-value="faqModel(index, 'answer').value" :label="`Respuesta ${index + 1}`" :rows="2" @update:model-value="faqModel(index, 'answer').value = $event" />
      </div>
    </div>
  </section>
</template>
