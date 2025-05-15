<template>
  <div ref="threeContainer" class="w-full bg-gray rounded-lg h-[1000px]"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCityScene } from '../composables/useCityScene'

const threeContainer = ref<HTMLElement | null>(null)

useCityScene(threeContainer)
</script>