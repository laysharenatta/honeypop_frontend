<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Inventario</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Kardex de Producto</h1>
      <p class="text-xs text-gray-400 mt-1">Historial detallado de movimientos para el producto <span class="font-bold text-[#f266b3]">#{{ route.params.id }}</span></p>
    </header>

    <div class="animate-slide-up">
      <ProductosMovimientosTable />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
import ProductosMovimientosTable from '@/components/movimientos/ProductosMovimientosTable.vue';
</script>