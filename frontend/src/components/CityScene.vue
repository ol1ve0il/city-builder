<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { useCityScene } from '../composables/useCityScene';

const props = defineProps<{ buildings: any[] }>();
const emits = defineEmits(['select-building', 'update-building']);
const { buildings } = toRefs(props);
const threeContainer = ref<HTMLElement | null>(null);

useCityScene(threeContainer, buildings, emits);
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 1000px;
  background: #ddd;
  border-radius: 8px;
}
</style>
