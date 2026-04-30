<!--
  Romantic invitation template.
  Clean card-based presentation to keep focus on the invitation content.
-->
<script setup>
import './style.css';

defineProps({
  names: { type: String, default: '' },
  date: { type: String, default: '' },
  location: { type: String, default: '' },
  message: { type: String, default: '' },
});
</script>

<template>
  <!--
    Design decisions:
    - Card container improves readability and visual hierarchy.
    - Centered text creates a ceremonial invitation feel.
    - Soft animation adds polish without distracting from content.
  -->
  <div class="romantic-template-shell">
    <article class="romantic-template-card">
      <h2 class="romantic-template__names">{{ names || 'Your Names Here' }}</h2>
      <p class="romantic-template__date">{{ date || 'Event Date' }}</p>
      <p class="romantic-template__location">{{ location || 'Event Location' }}</p>
      <p class="romantic-template__message">{{ message || 'Your invitation message will appear here.' }}</p>
    </article>
  </div>
</template>
