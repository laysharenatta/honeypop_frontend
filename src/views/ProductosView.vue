<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Inventario</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Productos</h1>
      <p class="text-xs text-gray-400 mt-1">Gestión de catálogo, stock y proveedores.</p>
    </header>

    <div class="animate-slide-up">
      <ProductosTable />
    </div>
  </div>
</template>

<script setup>
import ProductosTable from '@/components/productos/ProductosTable.vue';
</script>