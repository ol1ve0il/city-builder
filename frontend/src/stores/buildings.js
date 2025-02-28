import { defineStore } from "pinia";
import axios from 'axios';

export const useBuildingsStore = defineStore('buildingStore', {
    state: () => ({
        buildings: [],
    }),
    actions: {
        async fetchBuildingsByCity(cityId) {
            try {
                const response = await axios.get(`http://localhost:3000/cities/${cityId}/buildings`)
                this.buildings = response.data
            } catch (error) {
                console.error('Ошибка при загрузке построек города:', error);
            }
        },
        async createBuilding(cityId, name, x, y) {
            try {
                const response = await axios.post(`http://localhost:3000/cities/${cityId}/buildings`, { name, x, y })
                this.buildings.push(response.data);
            } catch (error) {
                console.error('Ошибка при создании постройки:', error);
            }
        }
    }
})