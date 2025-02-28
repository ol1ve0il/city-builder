<script setup>
const emit = defineEmits(['submit'])

const newBuilding = {name: '', x: 0, y: 0};
</script>

<template>
    <form @submit.prevent="emit('submit', newBuilding)">
        <label for="buildingName">Name</label>
        <input id="buildingName" type="text" v-model="newBuilding.name">

        <label for="buildingX">X</label>
        <input id="buildingX" type="number" v-model="newBuilding.x">

        <label for="buildingY">Y</label>
        <input id="buildingY" type="number" v-model="newBuilding.y">

        <button type="submit">submit</button>
    </form>
</template>