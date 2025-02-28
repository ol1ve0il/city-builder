<script setup>
defineProps(['city'])
const emit = defineEmits(['selectCity'])
</script>

<template>
<li @click="emit('selectCity', city.id)">{{ city.name }} - {{ city.size }}</li>
</template>
