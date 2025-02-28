<script setup>
import { useRoute } from 'vue-router';

import { useCitiesStore } from '../stores/cities';
import { useBuildingsStore } from '../stores/buildings';

import BuildingCreateForm from '../components/BuildingCreateForm.vue'
import BuildingCard from '../components/BuildingCard.vue'

const route = useRoute();
const cityId = route.params.id;

const cityStore = useCitiesStore();
const buildingStore = useBuildingsStore();

const selectedCity = cityStore.selectedCity;

buildingStore.fetchBuildingsByCity(cityId);

function createBuilding(newBuilding) {
    buildingStore.createBuilding(cityId, newBuilding.name, newBuilding.x, newBuilding.y)
}
</script>

<template>
    <BuildingCreateForm @submit="createBuilding"/>
    <BuildingCard :key="building.id" v-for="building in buildingStore.buildings" :building="building"/>
</template>