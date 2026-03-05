import HomeView from '@/views/HomeView.vue';
import ProveedoresView from '@/views/ProveedoresView.vue';
import ProductosView from '@/views/ProductosView.vue';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ProductosMovimientosView from '@/views/ProductosMovimientosView.vue';
import PedidosView from '@/views/PedidosView.vue';
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated } = useAuth();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: ProveedoresView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/productos/:id/movimientos',
      name: 'productos-movimientos',
      component: ProductosMovimientosView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: PedidosView,
      meta: {
        requiresAuth: true
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' });
  } else if (!to.meta.requiresAuth && isAuthenticated.value) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
