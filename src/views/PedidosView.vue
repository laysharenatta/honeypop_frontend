<template>
    
  <div class="min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-center py-8">Pedidos</h1>
    <p class="text-center text-gray-600 mb-8">Estado de los pedidos realizados a los proveedores.</p>
    <PedidosTable />
  </div>

</template>

<script setup>
import PedidosTable from '@/components/pedidos/PedidosTable.vue';
</script>