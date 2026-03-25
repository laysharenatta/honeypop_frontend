<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Operaciones</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Pedidos</h1>
      <p class="text-xs text-gray-400 mt-1">Gestión de abastecimiento y reposición de stock.</p>
    </header>

    <div class="animate-slide-up">
      <PedidosTable />
    </div>
  </div>
</template>

<script setup>
import PedidosTable from '@/components/pedidos/PedidosTable.vue';
</script>