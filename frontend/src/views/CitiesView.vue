<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCitiesStore } from '../stores/cities'

import CitiesTable from '../components/CitiesTable.vue'

const router = useRouter()

const cityStore = useCitiesStore()

onMounted(() => {
  cityStore.fetchCities()
})

function goToCity(id) {
  try {
    cityStore.selectCity(id)
    router.push(`/cities/${id}`)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="cities-view">
    <CitiesTable
      :headers="['id', 'name', 'size']"
      :cities="cityStore.cities"
      @select-city="goToCity"
    />
  </div>
</template>

<style scoped>
.cities-view {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>
