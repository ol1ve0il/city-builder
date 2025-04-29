<script setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useBuildingsStore } from '../stores/buildings';
import CityScene from '../components/CityScene.vue';
import CitySceneToolbar from '../components/CitySceneToolbar.vue';

const route = useRoute();
const cityId = Number(route.params.id);

const buildingStore = useBuildingsStore();

onMounted(() => {
  buildingStore.fetchBuildingsByCity(cityId);
})

const buildingsLoaded = computed(() => buildingStore.buildings.length > 0);

</script>

<template>
  <div class="scene-block" v-if="buildingsLoaded">
    <CitySceneToolbar class="scene-toolbar" :cityId="cityId"/>
    <CityScene class="scene-interface"/>
  </div>
</template>

<style scoped>
.scene-block {
  display: flex;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
}

.scene-toolbar {
  min-width: 250px;
}
</style>