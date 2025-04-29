<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import './app.css'
</script>

<template>
  <div class="wrapper">
    <AppHeader />
    <div class="wrapper-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.wrapper-content {
  flex: 1;
  padding-top: 60px; /* Отступ, чтобы контент не залазил под шапку */
}
</style>
