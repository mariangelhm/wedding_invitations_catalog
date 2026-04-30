<!--
  Public invitation presentation page.
  Intentionally renders without navbar/links to avoid dashboard-like chrome.
-->
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import RomanticTemplate from '../templates/romantic/Template.vue';

const route = useRoute();
const invitationId = route.params.id;

const isLoading = ref(true);
const invitation = ref(null);

const fetchInvitationById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        base: {
          names: 'Emma & Liam',
          date: 'June 14, 2027',
          location: 'Rose Garden Hall',
          message: 'We would love to celebrate our special day with you.',
        },
      });
    }, 350);
  });
};

onMounted(async () => {
  invitation.value = await fetchInvitationById(invitationId);
  isLoading.value = false;
});
</script>

<template>
  <main class="public-invitation-page">
    <div class="bg-shape bg-shape--one" aria-hidden="true"></div>
    <div class="bg-shape bg-shape--two" aria-hidden="true"></div>

    <section class="public-invitation-container">
      <RomanticTemplate
        v-if="!isLoading && invitation"
        :names="invitation.base.names"
        :date="invitation.base.date"
        :location="invitation.base.location"
        :message="invitation.base.message"
      />
    </section>
  </main>
</template>

<style scoped>
.public-invitation-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, #fce7f3 0%, transparent 45%),
    radial-gradient(circle at bottom right, #ede9fe 0%, transparent 45%),
    linear-gradient(180deg, #fff9fc 0%, #f9f7ff 100%);
}

.bg-shape {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
}

.bg-shape--one {
  width: 220px;
  height: 220px;
  top: 10%;
  right: -70px;
  background: rgba(244, 114, 182, 0.12);
}

.bg-shape--two {
  width: 180px;
  height: 180px;
  bottom: 12%;
  left: -60px;
  background: rgba(167, 139, 250, 0.12);
}

.public-invitation-container {
  width: min(420px, 100%);
  margin: auto;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 12px 24px rgba(15, 23, 42, 0.12));
}

/* Mobile-first safety: allow full-width container and prevent accidental horizontal overflow. */
@media (max-width: 640px) {
  .public-invitation-page {
    padding: 0.6rem;
  }

  .public-invitation-container {
    width: 100%;
    max-width: none;
  }
}
</style>
