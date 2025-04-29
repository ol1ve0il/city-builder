<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBuildingsStore } from '../stores/buildings';
import type { Building } from '../models/building';

const props = defineProps<{ cityId: number }>();

// Ключи полей и их подписи
const params: Record<keyof Pick<Building, 'x' | 'z' | 'width' | 'height' | 'depth' | 'rotation'>, string> = {
  x: 'X',
  z: 'Z',
  width: 'W',
  height: 'H',
  depth: 'D',
  rotation: 'R',
};

const buildingStore = useBuildingsStore();
const { selectedBuilding } = storeToRefs(buildingStore);

// Локальное состояние ввода
const inputValues = ref<Record<string, number>>({});

// Создание
const createBuilding = () => buildingStore.createBuilding(props.cityId, {
  cityId: props.cityId,
  type: 'FACTORY',
  width: 2,
  height: 5,
  depth: 2,
  x: 0,
  z: 0,
  color: "#121212"
});

// Удаление
const removeBuilding = () => {
  if (selectedBuilding.value) {
    buildingStore.removeBuilding(props.cityId, selectedBuilding.value.id);
  }
};

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
    };
  } else {
    inputValues.value = {};
  }
});

// Отправка данных при Enter или blur
const submitParam = (key: keyof Building) => {
  if (!selectedBuilding.value) return;
  const newValue = inputValues.value[key];
  if (newValue !== selectedBuilding.value[key]) {
    buildingStore.updateBuilding(props.cityId, selectedBuilding.value.id, {
      [key]: newValue,
    });
  }
};
</script>

<template>
    <div class="toolbar-block">
      <h3 class="toolbar-title">Управление</h3>
      <div class="toolbar-buttons">
        <button @click="createBuilding">Создать</button>
        <button @click="removeBuilding" :disabled="selectedBuilding == null">Удалить</button>
      </div>
  
      <h3 class="toolbar-title">Позиция</h3>
      <div class="toolbar-position">
        <div
          v-for="[key, label] in Object.entries(params)"
          :key="key"
          class="input-container"
        >
          <label :for="`input-${key}`">{{ label }}</label>
          <input
            :disabled="!selectedBuilding"
            type="number"
            :id="`input-${key}`"
            v-model="inputValues[key]"
            @keydown.enter="submitParam(key)"
            @blur="submitParam(key)"
            />
        </div>
      </div>
    </div>
  </template>
  

<style scoped>
.toolbar-block {
    width: 250px;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Чтобы ничего не выходило за пределы */
}

.toolbar-title {
    font-size: 1rem;
    margin-bottom: 10px;
    color: #333;
}

.toolbar-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
}

button {
    padding: 8px;
    border: none;
    border-radius: 5px;
    background: #007bff;
    color: white;
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    background: #0056b3;
}

.toolbar-position {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Используем две колонки */
    gap: 10px;
    max-width: 100%; /* Ограничиваем ширину, чтобы поля не вылезали */
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

label {
    font-size: 0.9rem;
    color: #666;
}

input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%; /* Ограничиваем ширину поля */
    box-sizing: border-box; /* Учитываем padding и border в расчете ширины */
}
</style>