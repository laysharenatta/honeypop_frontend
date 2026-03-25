<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Directorio</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Proveedores</h1>
      <p class="text-xs text-gray-400 mt-1">Gestión de socios comerciales y abastecedores.</p>
    </header>

    <div class="animate-slide-up">
      <ProveedoresTable />
    </div>
  </div>
</template>

<script setup>
import ProveedoresTable from '@/components/proveedores/ProveedoresTable.vue';
</script>