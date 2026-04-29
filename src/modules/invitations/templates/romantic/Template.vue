<!--
  Romantic invitation template.
  Uses a centered, minimal composition focused on readability and elegance.
-->
<script setup>
import './style.css';

// Template receives normalized invitation content from parent preview layer.
defineProps({
  names: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <!--
    Design structure:
    - vertically centered shell for a ceremonial feel
    - names emphasized as the primary focal point
    - date/location kept smaller as metadata
    - message in italic for a personal tone
  -->
  <div class="romantic-template-shell">
    <article class="romantic-template">
      <h2 class="romantic-template__names">{{ names || 'Your Names Here' }}</h2>
      <p class="romantic-template__date">{{ date || 'Event Date' }}</p>
      <p class="romantic-template__location">{{ location || 'Event Location' }}</p>
      <p class="romantic-template__message">{{ message || 'Your invitation message will appear here.' }}</p>
    </article>
  </div>
</template>
