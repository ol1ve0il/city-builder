<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCityScene } from '../composables/useCityScene'

const threeContainer = ref<HTMLElement | null>(null)

useCityScene(threeContainer)
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 1000px;
  background: #ddd;
  border-radius: 8px;
}
</style>
