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
const selectedBuilding = ref(null);

const selectBuilding = (id) => {
  console.log("🚀 ~ selectBuilding ~ id:", id)
  selectedBuilding.value = buildingStore.buildings.find((building) => building.id == id);
}

const updateBuilding = (id, newData) => {
  buildingStore.updateBuilding(selectedCity.value.id, selectedBuilding.value.id, newData);
  selectBuilding(id); 
  console.log(selectedBuilding.value)
}

const createBuilding = () => {
  buildingStore.createBuilding(selectedCity.value.id, {
    cityId: selectedCity.value.id,
    type: 'FACTORY',
    width: 2,
    height: 5,
    depth: 2,
    x: 0,
    z: 0,
    color: "#121212"
  })
};

const removeBuilding = () => {
  if (confirm('Do you want to remove this building?')) {
    buildingStore.removeBuilding(selectedCity.value.id, selectedBuilding.value.id);
  }
};

watch(() => cityStore.selectedCity, (newCity) => {
  if (newCity) {
    selectedCity.value = newCity;
  }
});

onMounted(() => {
  buildingStore.fetchBuildingsByCity(cityId);
})

const params = {
  x: 'X',
  z: 'Z',
  width: 'W',
  height: 'H',
  depth: 'D',
  rotation: 'R',
}

</script>

<template>
  <div v-if="selectedCity">
    <div class="scene-block">
      <CitySceneToolbar class="scene-toolbar" 
        :selectedBuilding="selectedBuilding" 
        :params="params"
        @create-building="createBuilding"
        @update-building="updateBuilding" 
        @remove-building="removeBuilding"
      />
      <CityScene 
        class="scene-interface" 
        :buildings="buildingStore.buildings" 
        @select-building="selectBuilding"
        @update-building="updateBuilding" />
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

.scene-toolbar {
  min-width: 250px;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  padding: 20px;
}
</style>