<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useCitiesStore } from '../stores/cities';
import { useBuildingsStore } from '../stores/buildings';
import CityScene from '../components/CityScene.vue';
import CitySceneToolbar from '../components/CitySceneToolbar.vue';

const route = useRoute();
const cityId = route.params.id;

const cityStore = useCitiesStore();
const buildingStore = useBuildingsStore();

const selectedCity = ref(null);

watch(() => cityStore.selectedCity, (newCity) => {
  if (newCity) {
    selectedCity.value = newCity;
  }
});

onMounted(() => {
  buildingStore.fetchBuildingsByCity(cityId);
})

</script>

<template>
  <div v-if="selectedCity">
    <div class="scene-block">
      <CitySceneToolbar class="scene-toolbar" :params="['X', 'Y', 'W', 'H', 'D', 'R']" />
      <CityScene class="scene-interface" :buildings="buildingStore.buildings" />
    </div>
  </div>
  <p v-else class="loading-message">Загрузка данных...</p>
</template>

<style scoped>
.scene-block {
  display: flex;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  padding: 20px;
}
</style>