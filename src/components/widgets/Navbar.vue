<template>
  <nav class="bg-white border-b-4 border-[#f266b3] shadow-sm">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="text-xl font-semibold text-[#f266b3] tracking-wide">
          Honeypop
        </div>

        <!-- Desktop Links -->
        <div class="hidden md:flex space-x-8">
          <RouterLink
            to="/"
            class="relative font-medium text-gray-700 transition duration-300 hover:text-[#f266b3]"
            active-class="text-[#f266b3]"
          >
            Inicio
          </RouterLink>

          <RouterLink
            to="/proveedores"
            class="relative font-medium text-gray-700 transition duration-300 hover:text-[#f266b3]"
            active-class="text-[#f266b3]"
          >
            Proveedores
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="isOpen = !isOpen"
          :aria-expanded="isOpen.toString()"
          aria-label="Toggle menu"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-[#f266b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#f266b3]"
        >
          <svg v-if="!isOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-show="isOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 bg-white">
        <RouterLink
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[#f266b3] hover:text-white"
          active-class="bg-[#f266b3] text-white"
          @click="isOpen = false"
        >
          Inicio
        </RouterLink>

        <RouterLink
          to="/proveedores"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[#f266b3] hover:text-white"
          active-class="bg-[#f266b3] text-white"
          @click="isOpen = false"
        >
          Proveedores
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(false)
</script>