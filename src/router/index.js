import HomeView from '@/views/HomeView.vue'
import ProveedoresView from '@/views/ProveedoresView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: ProveedoresView,
    },


    
  ],
})

export default router
