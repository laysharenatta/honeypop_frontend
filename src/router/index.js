import HomeView from '@/views/HomeView.vue';
import ProveedoresView from '@/views/ProveedoresView.vue';
import ProductosView from '@/views/ProductosView.vue';
import LoginView from '@/views/LoginView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ProductosMovimientosView from '@/views/ProductosMovimientosView.vue';
import PedidosView from '@/views/PedidosView.vue';
import OrdenesView from '@/views/OrdenesView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ClientesView from '@/views/ClientesView.vue';
import ProcesosInternos from '@/views/ProcesosInternos.vue';
import Recursos from '@/views/Recursos.vue';
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated, rol } = useAuth();

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
        requiresAuth: true,
        roles: ['administrador']
      }
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductosView,
      meta: {
        requiresAuth: true,
        roles: ['administrador', 'ventas']
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
        requiresAuth: true,
        roles: ['administrador', 'logistica', 'logística']
      }
    },
    {
      path: '/ordenes',
      name: 'ordenes',
      component: OrdenesView,
      meta: {
        requiresAuth: true,
        roles: ['administrador', 'ventas']
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        roles: ['administrador']
      }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: ClientesView,
      meta: {
        requiresAuth: true,
        roles: ['administrador', 'ventas']
      }
    },
    {
      path: '/procesos-internos',
      name: 'procesos-internos',
      component: ProcesosInternos,
      meta: {
        requiresAuth: true,
        roles: ['administrador']
      }
    },
    {
      path: '/recursos',
      name: 'recursos',
      component: Recursos,
      meta: {
        requiresAuth: true,
        roles: ['administrador', 'logistica', 'logística']
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' });
  } else if (!to.meta.requiresAuth && isAuthenticated.value) {
    // Redirigir según el rol si intenta ir al login estando ya autenticado
    const target = getLandingPageByRol(rol.value);
    next({ name: target });
  } else if (to.name === 'home' && isAuthenticated.value) {
    // Redirigir a la vista específica del rol al entrar a la raíz
    const target = getLandingPageByRol(rol.value);
    next({ name: target });
  } else if (to.meta.roles && rol.value && !to.meta.roles.includes(rol.value)) {
    // El usuario no tiene el rol necesario para esta ruta
    const target = getLandingPageByRol(rol.value);
    next({ name: target });
  } else {
    next();
  }
});

function getLandingPageByRol(userRol) {
  switch (userRol) {
    case 'administrador':
      return 'dashboard';
    case 'ventas':
      return 'ordenes';
    case 'logística':
    case 'logistica':
      return 'pedidos';
    default:
      return 'home';
  }
}

export default router;
