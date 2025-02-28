<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCitiesStore } from '../stores/cities';

import CityCreateForm from '../components/CityCreateForm.vue'
import CityCard from '../components/CityCard.vue'
import MapView from '../components/MapView.vue';


const router = useRouter();

const cityStore = useCitiesStore();

onMounted(() => {
    cityStore.fetchCities();
});

function goToCity(id) {
    try {
        cityStore.selectCity(id);
        router.push(`/cities/${id}`)
    } catch (error) {
        console.log(error)
    }
}

function createCity(newCity) {
    cityStore.createCity(newCity.name, newCity.size);
}

</script>

<template>
    <div>
        <MapView :cities="cityStore.cities" />

        <CityCreateForm @submit="createCity" />
        <CityCard :key="city.id" v-for="city in cityStore.cities" :city="city" @select-city="goToCity" />
    </div>
</template>