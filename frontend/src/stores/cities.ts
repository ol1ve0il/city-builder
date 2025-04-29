import { defineStore } from 'pinia'
import axios from 'axios'

import { City } from '../models/city'

export const useCitiesStore = defineStore('cityStore', {
  state: () => ({
    cities: [] as City[],
    selectedCity: null as City | null,
  }),

  actions: {
    async fetchCities() {
      try {
        const response = await axios.get('http://localhost:3000/cities')
        this.cities = response.data
      } catch (error) {
        console.error('Ошибка при загрузке городов:', error)
      }
    },
    async createCity(city: City) {
      try {
        const response = await axios.post('http://localhost:3000/cities', city)
        this.cities.push(response.data)
      } catch (error) {
        console.error('Ошибка при создании города:', error)
      }
    },
    selectCity(id: City['id']) {
      this.selectedCity = this.cities.find((city) => city.id == id) || null
    },
  },
})
