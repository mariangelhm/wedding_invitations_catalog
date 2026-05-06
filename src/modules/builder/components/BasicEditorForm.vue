<script setup>
import { computed, onMounted, ref } from 'vue';
import Input from '../../../components/ui/Input.vue';
import TextArea from '../../../components/ui/TextArea.vue';
import { useBuilderStore } from '../../../store/builder.store';

const builderStore = useBuilderStore();
const isMobileEditor = ref(false);

onMounted(() => {
  if (!builderStore.invitation) builderStore.createDraftInvitation();
  isMobileEditor.value = window.matchMedia?.('(max-width: 768px)').matches || false;
});

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const normalized = String(value).replace('Z', '');
  return normalized.includes('T') ? normalized.slice(0, 16) : normalized;
};

const baseFieldModel = (field) => computed({
  get: () => builderStore.invitation?.base?.[field] || '',
  set: (value) => builderStore.updateBaseField(field, value),
});

const weddingDate = computed({
  get: () => toDateTimeLocal(builderStore.invitation?.base?.eventDate),
  set: (value) => builderStore.updateBaseField('eventDate', value),
});

const detailFieldModel = (section, field) => computed({
  get: () => builderStore.invitation?.details?.[section]?.[field] || '',
  set: (value) => builderStore.updateDetailField(section, field, value),
});

const detailDateModel = (section, field) => computed({
  get: () => toDateTimeLocal(builderStore.invitation?.details?.[section]?.[field]),
  set: (value) => builderStore.updateDetailField(section, field, value),
});

const mapFieldModel = (field) => computed({
  get: () => builderStore.invitation?.map?.[field] || builderStore.invitation?.mapSettings?.[field] || '',
  set: (value) => builderStore.updateMapField(field, value),
});

const faqModel = (item, field) => computed({
  get: () => item?.[field] || '',
  set: (value) => builderStore.updateFaqItem(item.id, field, value),
});

const coupleNames = baseFieldModel('coupleNames');
const locationName = baseFieldModel('locationName');
const locationAddress = baseFieldModel('locationAddress');
const message = baseFieldModel('message');
const storyMessage = baseFieldModel('storyMessage');

const ceremonyTitle = detailFieldModel('ceremony', 'title');
const ceremonyDate = detailDateModel('ceremony', 'dateTime');
const ceremonyLocation = detailFieldModel('ceremony', 'location');
const receptionTitle = detailFieldModel('reception', 'title');
const receptionDate = detailDateModel('reception', 'dateTime');
const receptionLocation = detailFieldModel('reception', 'location');

const mapSearchText = mapFieldModel('mapSearchText');
const mapLocationName = mapFieldModel('locationName');
const mapLocationAddress = mapFieldModel('address');
const mapUrl = mapFieldModel('mapUrl');
const embedUrl = mapFieldModel('embedUrl');

const uploadLabel = computed(() => (isMobileEditor.value ? 'Subir desde el teléfono' : 'Subir desde la computadora'));
const selectedFileNames = ref({});
const mapPreviewUrl = ref('');
const showAdvancedMapOptions = ref(false);

const mapsSearchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const mapsEmbedUrl = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

const fileMetadata = (file) => (file ? { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified } : null);
const onImageFileSelected = (field, event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const previewUrl = URL.createObjectURL(file);
  selectedFileNames.value = { ...selectedFileNames.value, [field]: file.name };
  builderStore.updateImageField(field, previewUrl, fileMetadata(file));
};
const onGalleryFilesSelected = (event) => {
  Array.from(event.target.files || []).forEach((file, index) => {
    const previewUrl = URL.createObjectURL(file);
    builderStore.updateGalleryImage(index, previewUrl, fileMetadata(file));
  });
  selectedFileNames.value = { ...selectedFileNames.value, galleryImages: Array.from(event.target.files || []).map((file) => file.name).join(', ') };
};

const previewMapSearch = () => {
  const query = mapSearchText.value || `${locationName.value} ${locationAddress.value}`.trim();
  if (!query) return;
  mapPreviewUrl.value = mapsEmbedUrl(query);
  builderStore.setActivePreviewTarget('map');
};

const useMapSearchLocation = () => {
  const query = mapSearchText.value || `${locationName.value} ${locationAddress.value}`.trim();
  if (!query) return;
  const embed = mapsEmbedUrl(query);
  mapPreviewUrl.value = embed;
  builderStore.updateBaseField('locationAddress', query);
  builderStore.updateMapField('address', query);
  builderStore.updateMapField('embedUrl', embed);
  builderStore.updateMapField('mapUrl', mapsSearchUrl(query));
};
</script>

<template>
  <section class="basic-editor-form">
    <h2>Información de la tarjeta</h2>
    <div v-if="builderStore.invitation" class="form-fields">
      <Input v-model="coupleNames" label="Nombres" />
      <label class="editor-field">
        <span>Fecha de la boda</span>
        <input v-model="weddingDate" type="datetime-local" placeholder="Ejemplo: 14/06/2027 18:00" />
        <small>Ejemplo: 14/06/2027 18:00</small>
      </label>
      <Input v-model="locationName" label="Lugar" />
      <Input v-model="locationAddress" label="Dirección" />
      <TextArea v-model="message" label="Mensaje principal" :rows="3" />
      <TextArea v-model="storyMessage" label="Historia de los novios" :rows="5" />

      <h3>Detalles del evento</h3>
      <Input v-model="ceremonyTitle" label="Título ceremonia" />
      <label class="editor-field">
        <span>Fecha y hora de ceremonia</span>
        <input v-model="ceremonyDate" type="datetime-local" placeholder="Ejemplo: 14/06/2027 18:00" />
        <small>Ejemplo: 14/06/2027 18:00</small>
      </label>
      <Input v-model="ceremonyLocation" label="Lugar ceremonia" />
      <Input v-model="receptionTitle" label="Título recepción" />
      <label class="editor-field">
        <span>Fecha y hora de celebración</span>
        <input v-model="receptionDate" type="datetime-local" placeholder="Ejemplo: 14/06/2027 18:00" />
        <small>Ejemplo: 14/06/2027 18:00</small>
      </label>
      <Input v-model="receptionLocation" label="Lugar recepción" />

      <h3>Mapa</h3>
      <label class="editor-field editor-field--map-search">
        <span>Buscar dirección</span>
        <div class="editor-field__inline">
          <input v-model="mapSearchText" type="search" placeholder="Nombre del lugar o dirección" />
          <button type="button" @click="previewMapSearch">Previsualizar mapa</button>
        </div>
        <small>Escribe una dirección para previsualizarla sin salir del editor.</small>
      </label>
      <div v-if="mapPreviewUrl || embedUrl" class="editor-map-preview">
        <iframe :src="mapPreviewUrl || embedUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <button type="button" @click="useMapSearchLocation">Usar esta ubicación</button>
      </div>
      <Input v-model="mapLocationName" label="Nombre del lugar en mapa" />
      <Input v-model="mapLocationAddress" label="Dirección del mapa" />
      <Input v-model="mapUrl" label="URL de Google Maps" />
      <button class="editor-advanced-toggle" type="button" @click="showAdvancedMapOptions = !showAdvancedMapOptions">Opciones avanzadas</button>
      <div v-if="showAdvancedMapOptions" class="form-fields">
        <Input v-model="embedUrl" label="URL de insertar mapa" />
      </div>

      <h3>Imágenes</h3>
      <label class="editor-field editor-field--file">
        <span>Imagen principal</span>
        <input type="file" accept="image/*" @change="onImageFileSelected('heroImage', $event)" />
        <small>{{ selectedFileNames.heroImage || uploadLabel }}</small>
      </label>
      <label class="editor-field editor-field--file">
        <span>Imagen de historia</span>
        <input type="file" accept="image/*" @change="onImageFileSelected('storyImage', $event)" />
        <small>{{ selectedFileNames.storyImage || uploadLabel }}</small>
      </label>
      <label class="editor-field editor-field--file">
        <span>Imagen parallax</span>
        <input type="file" accept="image/*" @change="onImageFileSelected('parallaxImage', $event)" />
        <small>{{ selectedFileNames.parallaxImage || uploadLabel }}</small>
      </label>
      <label class="editor-field editor-field--file">
        <span>Imagen de detalles</span>
        <input type="file" accept="image/*" @change="onImageFileSelected('detailsImage', $event)" />
        <small>{{ selectedFileNames.detailsImage || uploadLabel }}</small>
      </label>
      <label class="editor-field editor-field--file">
        <span>Imágenes de galería</span>
        <input type="file" accept="image/*" multiple @change="onGalleryFilesSelected" />
        <small>{{ selectedFileNames.galleryImages || uploadLabel }}</small>
      </label>

      <h3>Preguntas frecuentes</h3>
      <div v-for="(item, index) in builderStore.invitation.faq" :key="item.id" class="form-fields">
        <Input :model-value="faqModel(item, 'question').value" :label="`Pregunta ${index + 1}`" @update:model-value="faqModel(item, 'question').value = $event" />
        <TextArea :model-value="faqModel(item, 'answer').value" :label="`Respuesta ${index + 1}`" :rows="2" @update:model-value="faqModel(item, 'answer').value = $event" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.editor-field { display: grid; gap: 0.35rem; }
.editor-field span { font-size: 0.9rem; }
.editor-field input { padding: 0.6rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.55rem; outline: none; }
.editor-field input:focus { border-color: #8b5a7a; box-shadow: 0 0 0 3px rgba(139, 90, 122, 0.15); }
.editor-field small { color: #6b7280; font-size: 0.78rem; }
.editor-field__inline { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.5rem; }
.editor-field__inline button { border: 0; border-radius: 0.55rem; background: #111827; color: #fff; cursor: pointer; padding: 0.6rem 0.8rem; font-weight: 700; }
.editor-field--file input { background: #fff; }
.editor-map-preview { display: grid; gap: 8px; }
.editor-map-preview iframe { width: 100%; height: 220px; border: 0; border-radius: 12px; background: #f3f4f6; }
.editor-map-preview button, .editor-advanced-toggle { border: 0; border-radius: 0.55rem; background: #111827; color: #fff; cursor: pointer; padding: 0.6rem 0.8rem; font-weight: 700; }
.editor-advanced-toggle { justify-self: start; background: #374151; }
@media (max-width: 640px) { .editor-field__inline { grid-template-columns: 1fr; } }
</style>
<style scoped>
.basic-editor-form {
  display: grid;
  gap: 18px;
}

.basic-editor-form h2 {
  margin: 0;
  color: #111827;
  font-size: clamp(1.35rem, 3vw, 1.9rem);
  letter-spacing: -0.02em;
}

.form-fields {
  display: grid;
  gap: 14px;
}

.basic-editor-form h3 {
  margin: 18px 0 2px;
  padding: 10px 12px;
  border: 1px solid #f6d8e3;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff4f8 0%, #ffffff 100%);
  color: #9f1f46;
  font-size: 0.98rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

:deep(.ui-field),
.editor-field {
  display: grid;
  gap: 0.45rem;
  padding: 12px;
  border: 1px solid #e8dce2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.04);
}

:deep(.ui-field__label),
.editor-field span {
  color: #374151;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

:deep(.ui-field__control),
.editor-field input {
  min-height: 44px;
  padding: 0.7rem 0.85rem;
  border: 1px solid #d6c8cf;
  border-radius: 12px;
  outline: none;
  background: #fff;
  color: #111827;
  font-size: 0.95rem;
}

:deep(textarea.ui-field__control) {
  min-height: 110px;
  line-height: 1.45;
}

:deep(.ui-field__control:focus),
.editor-field input:focus {
  border-color: #c7355c;
  box-shadow: 0 0 0 3px rgba(199, 53, 92, 0.14);
}

.editor-field small {
  color: #6b7280;
  font-size: 0.78rem;
}
</style>
