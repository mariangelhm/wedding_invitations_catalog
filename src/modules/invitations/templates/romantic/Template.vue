<!--
  Romantic invitation template.
  Provides a clean centered composition with soft color styling.
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
    - names as visual focal point
    - date/location as event metadata
    - message as personal body copy
  -->
  <article class="romantic-template">
    <h2 class="romantic-template__names">{{ names || 'Your Names Here' }}</h2>
    <p class="romantic-template__date">{{ date || 'Event Date' }}</p>
    <p class="romantic-template__location">{{ location || 'Event Location' }}</p>
    <p class="romantic-template__message">{{ message || 'Your invitation message will appear here.' }}</p>
  </article>
</template>
