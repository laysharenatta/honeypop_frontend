<template>
    
  <div class="min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-center py-8">Productos</h1>
    <p class="text-center text-gray-600 mb-8">Nuestros productos son elaborados con la mejor calidad e higiene.</p>
    <ProductosTable />
  </div>

</template>

<script setup>
import ProductosTable from '@/components/productos/ProductosTable.vue';
</script>