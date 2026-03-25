<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#f266b3] flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-lg leading-none mt-[-1px]">H</span>
          </div>
          <span class="text-lg font-semibold text-gray-800 tracking-tight">Honeypop</span>
        </div>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center space-x-1">

          <!-- Solo administrador -->
          <template v-if="rol === 'administrador'">
            <RouterLink
              to="/proveedores"
              class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
              active-class="!text-[#f266b3] !bg-pink-50"
            >
              Proveedores
            </RouterLink>
            <RouterLink
              to="/clientes"
              class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
              active-class="!text-[#f266b3] !bg-pink-50"
            >
              Clientes
            </RouterLink>
            <RouterLink
              to="/dashboard"
              class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
              active-class="!text-[#f266b3] !bg-pink-50"
            >
              Dashboard ERP
            </RouterLink>
          </template>

          <RouterLink
            to="/productos"
            class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
            active-class="!text-[#f266b3] !bg-pink-50"
          >
            Productos
          </RouterLink>

          <RouterLink
            v-if="rol === 'administrador' || rol === 'logistica' || rol === 'logística'"
            to="/pedidos"
            class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
            active-class="!text-[#f266b3] !bg-pink-50"
          >
            Pedidos
          </RouterLink>

          <RouterLink
            v-if="rol === 'administrador' || rol === 'ventas'"
            to="/ordenes"
            class="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-gray-900 hover:bg-gray-50"
            active-class="!text-[#f266b3] !bg-pink-50"
          >
            Órdenes
          </RouterLink>

          <div class="h-6 w-px bg-gray-100 mx-2"></div>

          <button
            type="button"
            class="ml-2 px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-rose-500 hover:bg-rose-50"
            @click="handleLogout"
          >
            Salir
          </button>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="isOpen = !isOpen"
          class="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <svg v-if="!isOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="isOpen" class="md:hidden border-t border-gray-50 bg-white">
        <div class="px-4 pt-2 pb-6 space-y-1">

          <template v-if="rol === 'administrador'">
            <RouterLink
              to="/proveedores"
              class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
              active-class="bg-pink-50 text-[#f266b3]"
              @click="isOpen = false"
            >
              Proveedores
            </RouterLink>
            <RouterLink
              to="/clientes"
              class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
              active-class="bg-pink-50 text-[#f266b3]"
              @click="isOpen = false"
            >
              Clientes
            </RouterLink>
            <RouterLink
              to="/dashboard"
              class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
              active-class="bg-pink-50 text-[#f266b3]"
              @click="isOpen = false"
            >
              Dashboard ERP
            </RouterLink>
          </template>

          <RouterLink
            to="/productos"
            class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
            active-class="bg-pink-50 text-[#f266b3]"
            @click="isOpen = false"
          >
            Productos
          </RouterLink>

          <RouterLink
            v-if="rol === 'administrador' || rol === 'logistica' || rol === 'logística'"
            to="/pedidos"
            class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
            active-class="bg-pink-50 text-[#f266b3]"
            @click="isOpen = false"
          >
            Pedidos
          </RouterLink>

          <RouterLink
            v-if="rol === 'administrador' || rol === 'ventas'"
            to="/ordenes"
            class="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-[#f266b3]"
            active-class="bg-pink-50 text-[#f266b3]"
            @click="isOpen = false"
          >
            Órdenes
          </RouterLink>

          <button
            type="button"
            class="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50"
            @click="handleLogout"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth';

const { logout, rol } = useAuth();
const router = useRouter();

const isOpen = ref(false);

const handleLogout = async () => {
  await logout();
  router.push('/login');
  isOpen.value = false;
};
</script>
