<script setup>
const props = defineProps(['headers', 'cities'])
const emit = defineEmits(['select-city'])
</script>

<template>
  <div class="cities-table">
    <table>
      <thead>
        <tr>
          <th v-for="(header, i) in headers" :key="`header-${i}`">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="city in cities" :key="city.id" @click="emit('select-city', city.id)">
          <td v-for="header in headers">{{ city[header] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cities-table {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: left;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background: #f1f1f1;
  cursor: pointer;
}
</style>
