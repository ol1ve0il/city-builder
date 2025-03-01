<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useCitiesStore } from '../stores/cities';
import { useBuildingsStore } from '../stores/buildings';
import CityScene from '../components/CityScene.vue';

const route = useRoute();
const cityId = route.params.id;

const cityStore = useCitiesStore();
const buildingStore = useBuildingsStore();

const selectedCity = ref(null);

watch(() => cityStore.selectedCity, async (newCity) => {
  if (newCity) {
    selectedCity.value = newCity;
  }
});

onMounted(() => {
  buildingStore.fetchBuildingsByCity(cityId);
})

</script>

<template>
  <div v-if="selectedCity && buildingStore.buildings.length > 0">
    <h2>{{ selectedCity.name }}</h2>
    <CityScene :buildings="buildingStore.buildings"/>
  </div>
  <p v-else>Загрузка данных...</p>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>