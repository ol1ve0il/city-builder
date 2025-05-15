<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useBuildingsStore } from '../stores/buildings'
import CityScene from '../components/CityScene.vue'
import CitySceneToolbar from '../components/CitySceneToolbar.vue'

const route = useRoute()
const cityId = Number(route.params.id)

const buildingStore = useBuildingsStore()

onMounted(() => {
  buildingStore.fetchBuildingsByCity(cityId)
})

const buildingsLoaded = computed(() => buildingStore.buildings.length > 0)
</script>

<template>
  <div class="flex gap-[20px] p-[20px] items-start" v-if="buildingsLoaded">
    <CitySceneToolbar :cityId="cityId" />
    <CityScene class="scene-interface" />
  </div>
</template>