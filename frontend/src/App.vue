<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import './app.css'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <div class="flex-1 pt-[60px]">
      <RouterView />
    </div>
  </div>
</template>
