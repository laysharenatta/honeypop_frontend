<template>
  <nav class="bg-white border-b-4 border-[#f266b3] shadow-sm">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="text-xl font-semibold text-[#f266b3] tracking-wide">
          Honeypop 
        </div>

        <!-- Links -->
        <div class="flex space-x-8">
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

      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>