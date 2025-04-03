<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { useCityScene } from '../composables/useCityScene';

const props = defineProps<{ buildings: any[] }>();
const { buildings } = toRefs(props);
const threeContainer = ref<HTMLElement | null>(null);

useCityScene(threeContainer, buildings);
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 600px;
  background: #ddd;
  border-radius: 8px;
}
</style>
