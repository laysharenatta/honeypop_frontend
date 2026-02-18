<template>
    
  <div class="min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold text-center py-8">Proveedores</h1>
    <p class="text-center text-gray-600 mb-8">Nuestros proveedores son los responsables de nuestros productos.</p>
    <ProveedoresTable />
  </div>

</template>

<script setup>
import ProveedoresTable from '@/components/proveedores/ProveedoresTable.vue';
</script>