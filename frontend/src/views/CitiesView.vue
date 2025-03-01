<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCitiesStore } from '../stores/cities';

import CityCreateForm from '../components/CityCreateForm.vue'
import CityCard from '../components/CityCard.vue'

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
    cityStore.createCity(newCity);
}

</script>

<template>
    <div>
        <CityCreateForm @submit="createCity" />
        <CityCard :key="city.id" v-for="city in cityStore.cities" :city="city" @select-city="goToCity" />
    </div>
</template>