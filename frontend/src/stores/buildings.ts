import { defineStore } from 'pinia'
import axios from 'axios'

import { Building } from '../models/building'
import { City } from '../models/city'

export const useBuildingsStore = defineStore('buildingStore', {
  state: () => ({
    buildings: [] as Building[],
    selectedBuilding: null as Building | null,
  }),
  actions: {
    async fetchBuildingsByCity(cityId: City['id']) {
      try {
        const response = await axios.get(`http://localhost:3000/cities/${cityId}/buildings`)
        this.buildings = response.data
      } catch (error) {
        console.error('Ошибка при загрузке построек города:', error)
      }
    },
    async createBuilding(cityId: City['id'], building: Building) {
      console.log('🚀 ~ createBuilding ~ building:', building)
      try {
        const response = await axios.post(
          `http://localhost:3000/cities/${cityId}/buildings`,
          building,
        )
        this.buildings.push(response.data)
        this.selectBuilding(response.data.id)
      } catch (error) {
        console.error('Ошибка при создании постройки:', error)
      }
    },
    async updateBuilding(cityId: City['id'], id: Building['id'], newData: Partial<Building>) {
      try {
        const response = await axios.post(
          `http://localhost:3000/cities/${cityId}/buildings/${id}`,
          newData,
        )
        const updatedBuildingIndex = this.buildings.findIndex((building) => building.id == id)
        this.buildings[updatedBuildingIndex] = response.data
        this.selectBuilding(id)
      } catch (error) {
        console.error('Ошибка при изменении постройки', error)
        this.selectedBuilding = null
      }
    },
    async removeBuilding(cityId: City['id'], id: Building['id']) {
      try {
        await axios.delete(`http://localhost:3000/cities/${cityId}/buildings/${id}`)
        this.buildings = this.buildings.filter((building) => building.id !== id)
      } catch (error) {
        console.error('Ошибка при удалении постройки:', error)
      } finally {
        // Зачищаем выбранную постройку при удалении или ошибке
        if (this.selectedBuilding !== null) {
          this.selectedBuilding = null
        }
      }
    },
    selectBuilding(id: Building['id']) {
      this.selectedBuilding = this.buildings.find((building) => building.id === id) || null
      console.log('selected', this.selectedBuilding)
    },
  },
})
