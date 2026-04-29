<!--
  Public invitation page.
  Loads invitation data by URL param and renders it with a template.
-->
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import RomanticTemplate from '../templates/romantic/Template.vue';

const route = useRoute();

// Route param source of truth for invitation lookup (e.g. /i/abc123).
const invitationId = route.params.id;

const isLoading = ref(true);
const invitation = ref(null);

// Mock async fetch function.
// In production this would call a backend endpoint by invitationId.
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
  isLoading.value = true;
  invitation.value = await fetchInvitationById(invitationId);
  isLoading.value = false;
});
</script>

<template>
  <main>
    <h1>Public Invitation</h1>

    <p v-if="isLoading">Loading invitation...</p>

    <section v-else-if="invitation">
      <p><strong>Invitation ID:</strong> {{ invitation.id }}</p>

      <!--
        Dynamic rendering note:
        All displayed values come from fetched invitation data,
        then are passed into the romantic template as props.
      -->
      <RomanticTemplate
        :names="invitation.base.names"
        :date="invitation.base.date"
        :location="invitation.base.location"
        :message="invitation.base.message"
      />
    </section>
  </main>
</template>
