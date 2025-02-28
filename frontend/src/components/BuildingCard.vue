<script setup>
defineProps(['building'])
</script>

<template>
<li>{{ building.name }} - ({{ building.x }}:{{ building.y }})</li>
</template>
