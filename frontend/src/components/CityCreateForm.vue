<script setup>
const emit = defineEmits(['submit'])

const newCity = {name: '', size: ''};
</script>

<template>
    <form @submit.prevent="emit('submit', newCity)">
        <label for="cityName">Name</label>
        <input id="cityName" type="text" v-model="newCity.name">

        <label for="citySize">Size</label>
        <input id="citySize" type="text" v-model="newCity.size">

        <button type="submit">submit</button>
    </form>
</template>