<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBuildingsStore } from '../stores/buildings'
import type { Building } from '../models/building'

const props = defineProps<{ cityId: number }>()

// Ключи полей и их подписи
const params: Record<
  keyof Pick<Building, 'x' | 'z' | 'width' | 'height' | 'depth' | 'rotation'>,
  string
> = {
  x: 'X',
  z: 'Z',
  width: 'W',
  height: 'H',
  depth: 'D',
  rotation: 'R',
}

const buildingStore = useBuildingsStore()
const { selectedBuilding } = storeToRefs(buildingStore)

// Локальное состояние ввода
const inputValues = ref<Record<string, number>>({})

// Создание
const createBuilding = () =>
  buildingStore.createBuilding(props.cityId, {
    cityId: props.cityId,
    type: 'FACTORY',
    width: 2,
    height: 5,
    depth: 2,
    x: 0,
    z: 0,
    color: '#121212',
  })

// Удаление
const removeBuilding = () => {
  if (selectedBuilding.value) {
    buildingStore.removeBuilding(props.cityId, selectedBuilding.value.id)
  }
}

// Заполняем при выборе здания
watch(selectedBuilding, (newBuilding) => {
  if (newBuilding) {
    inputValues.value = {
      x: newBuilding.x,
      z: newBuilding.z,
      width: newBuilding.width,
      height: newBuilding.height,
      depth: newBuilding.depth,
      rotation: newBuilding.rotation || 0,
    }
  } else {
    inputValues.value = {}
  }
})

// Отправка данных при Enter или blur
const submitParam = (key: keyof Building) => {
  if (!selectedBuilding.value) return
  const newValue = inputValues.value[key]
  if (newValue !== selectedBuilding.value[key]) {
    buildingStore.updateBuilding(props.cityId, selectedBuilding.value.id, {
      [key]: newValue,
    })
  }
}
</script>

<template>
  <div class="w-64 bg-white p-4 rounded-xl shadow space-y-4 text-sm border border-gray-200">
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Управление</h3>
      <div class="flex flex-col gap-2">
        <button
          @click="createBuilding"
          class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 transition"
        >
          Создать
        </button>
        <button
          @click="removeBuilding"
          :disabled="selectedBuilding == null"
          class="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 transition disabled:opacity-50"
        >
          Удалить
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Позиция</h3>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="[key, label] in Object.entries(params)"
          :key="key"
          class="flex flex-col"
        >
          <label :for="`input-${key}`" class="text-gray-500 text-xs mb-1">{{ label }}</label>
          <input
            :disabled="!selectedBuilding"
            type="number"
            :id="`input-${key}`"
            v-model="inputValues[key]"
            @keydown.enter="submitParam(key)"
            @blur="submitParam(key)"
            class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>