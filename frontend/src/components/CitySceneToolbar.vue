<script setup>

const props = defineProps(['params', 'selectedBuilding']);
const emits = defineEmits(['createBuilding', 'removeBuilding', 'updateBuilding']);

const createBuilding = () => emits('createBuilding');
const removeBuilding = () => emits('removeBuilding');
const updateBuilding = (value) => console.log(value.target.value);

const getBuildingValue = (params, param) => {
    if (!props.selectedBuilding) return
    const entry = Object.entries(params).find(([key, value]) => value === param);
    return entry ? props.selectedBuilding[entry[0]] : undefined;
}

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
            <div v-for="param in params" :key="param" class="input-container">
                <label :for="`input-${param}`">{{ param }}</label>
                <input 
                    :disabled="selectedBuilding == null" 
                    type="number" 
                    :id="`input-${param}`" 
                    :value="getBuildingValue(params, param)"
                    @input="updateBuilding"
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