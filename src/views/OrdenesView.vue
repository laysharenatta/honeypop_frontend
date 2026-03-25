<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Ventas</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Órdenes Empresariales</h1>
      <p class="text-xs text-gray-400 mt-1">Historial de ventas y transacciones corporativas.</p>
    </header>

    <div class="animate-slide-up">
      <OrdenesTable />
    </div>
  </div>
</template>

<script setup>
import OrdenesTable from '@/components/ordenes/OrdenesTable.vue';
</script>
