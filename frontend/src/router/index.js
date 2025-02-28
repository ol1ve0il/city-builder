import { createMemoryHistory, createRouter } from 'vue-router'

import CitiesView from '../views/CitiesView.vue'
import CityDetailView from '../views/CityDetailView.vue'

const routes = [
  { path: '/', component: CitiesView },
  { path: '/cities/:id', component: CityDetailView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router