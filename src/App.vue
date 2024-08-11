<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main>
    <nav class="nav">
      <RouterLink to="/vue-lift/">Один лифт</RouterLink>
      <RouterLink  to="/vue-lift/lifts">Несколько лифтов</RouterLink>
      <RouterLink  to="/vue-lift/task">Описание</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>

<style scoped>

nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
