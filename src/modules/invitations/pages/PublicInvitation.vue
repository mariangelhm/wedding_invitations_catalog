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

// Mock async fetch by invitation ID.
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
    <!--
      Full-screen centered layout keeps focus exclusively on invitation content.
      No navigation is shown to preserve a clean presentation experience.
    -->
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
  background: linear-gradient(180deg, #fff9fc 0%, #f9f7ff 100%);
}

.public-invitation-container {
  width: min(420px, 100%);
  margin: auto;
}
</style>
