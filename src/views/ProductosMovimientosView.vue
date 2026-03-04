<template>
  <div class="min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-center py-8">Movimientos del producto {{ route.params.id }}</h1>
    <p class="text-center text-gray-600 mb-8">Movimientos de inventario del producto.</p>
    <ProductosMovimientosTable />
  </div>

</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
import ProductosMovimientosTable from '@/components/movimientos/ProductosMovimientosTable.vue';
</script>