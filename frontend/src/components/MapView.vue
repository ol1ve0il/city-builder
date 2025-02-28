<template>
    <div id="mapContainer">
        <l-map :zoom="5" :center="[55.751244, 37.618423]" style="height: 500px; width: 100%;">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker v-for="city in cities" :key="city.id" :lat-lng="[city.latitude, city.longitude]"
                :icon="defaultIcon" @click="goToCity(city.id)"></l-marker>
        </l-map>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import { defineProps } from 'vue';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Указываем иконку вручную
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

defineProps({
    cities: Array,
});

const router = useRouter();

const goToCity = (id) => {
    router.push(`/cities/${id}`);
};
</script>

<style scoped>
#mapContainer {
    cursor: default;
    width: 100vw;
    height: 500px;
}
</style>