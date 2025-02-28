import { defineStore } from "pinia";
import axios from 'axios';

export const useCitiesStore = defineStore('cityStore', {
    state: () => ({
        cities: [],
        selectedCity: null
    }),

    actions: {
        async fetchCities() {
            try {
                const response = await axios.get('http://localhost:3000/cities')
                this.cities = response.data;
            } catch (error) {
                console.error('Ошибка при загрузке городов:', error);
            }
        },
        async createCity(name, size) {
            try {
                const response = await axios.post('http://localhost:3000/cities', {name, size})
                this.cities.push(response.data);
            } catch (error) {
                console.error('Ошибка при создании города:', error);
            }
        },
        async selectCity(id) {
            try {
                const response = await axios.get(`http://localhost:3000/cities/${id}`)
                this.selectedCity = response.data
            } catch (error) {
                console.error('Ошибка получения данных о городе:', error);
            }
        }
    }
})