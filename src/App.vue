<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main>
    <nav>
      <RouterLink to="/">Один лифт</RouterLink>
      <RouterLink to="/lifts">Несколько лифтов</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>

<style scoped>
</style>
