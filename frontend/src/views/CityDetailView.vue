<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useCitiesStore } from '../stores/cities';
import { useBuildingsStore } from '../stores/buildings';

import BuildingCreateForm from '../components/BuildingCreateForm.vue'
import BuildingCard from '../components/BuildingCard.vue'

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

function createBuilding(newBuilding) {
    buildingStore.createBuilding(cityId, newBuilding.name, newBuilding.x, newBuilding.y)
}
</script>

<template>
    <div v-if="selectedCity">
        <div>{{ selectedCity.name }}</div>
        <BuildingCreateForm @submit="createBuilding"/>
        <BuildingCard :key="building.id" v-for="building in buildingStore.buildings" :building="building"/>
    </div>
    <p v-else>Загрузка данных...</p>
</template>