import { defineStore } from "pinia";
import axios from 'axios';

import { Building } from "../models/building";
import { City } from "../models/city";

export const useBuildingsStore = defineStore('buildingStore', {
    state: () => ({
        buildings: [] as Building[],
    }),
    actions: {
        async fetchBuildingsByCity(cityId: City['id']) {
            try {
                const response = await axios.get(`http://localhost:3000/cities/${cityId}/buildings`)
                this.buildings = response.data
            } catch (error) {
                console.error('Ошибка при загрузке построек города:', error);
            }
        },
        async createBuilding(cityId: City['id'], building: Building) {
            try {
                const response = await axios.post(`http://localhost:3000/cities/${cityId}/buildings`, building)
                this.buildings.push(response.data);
            } catch (error) {
                console.error('Ошибка при создании постройки:', error);
            }
        }
    }
})