<script setup>
defineProps(['headers', 'cities'])
const emit = defineEmits(['select-city'])
</script>

<template>
  <div class="w-full max-w-5xl my-5 mx-auto rounded-lg overflow-hidden shadow-lg">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="bg-[#007bff] text-white p-2.5 text-left" v-for="(header, i) in headers" :key="`header-${i}`">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-[#f1f1f1] hover:cursor-pointer" v-for="city in cities" :key="city.id" @click="emit('select-city', city.id)">
          <td class="p-2.5 border-b-1 border-b-[#ddd]" v-bind:key="i" v-for="(header, i) in headers">{{ city[header] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
