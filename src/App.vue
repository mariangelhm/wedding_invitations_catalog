<!--
  Root app shell.
  Provides simple global navigation links and the routed page outlet.
-->
<template>
  <div class="app-shell">
    <!--
      Navigation links map directly to main routes so flows are easy to access
      during development and manual QA.
    -->
    <nav class="app-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/catalog">Catalog</RouterLink>
      <RouterLink to="/editor">Editor</RouterLink>
      <RouterLink to="/i/demo-invitation">Public Invitation</RouterLink>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
/* Keep shell styling minimal and functional. */
.app-shell {
  display: grid;
  gap: 1rem;
}

.app-nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
</style>
