import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Cas9View from '@/views/Cas9View.vue'
import Cas9ResultView from '@/views/Cas9ResultView.vue'
import Cas12aView from '@/views/Cas12aView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cas9',
      name: 'cas9',
      component: Cas9View
    },
    {
      path: '/cas9_result',
      name: 'cas9_result',
      component: Cas9ResultView
    },
    {
      path: '/cas12a',
      name: 'cas12a',
      component: Cas12aView
    },
  ]
})

export default router
