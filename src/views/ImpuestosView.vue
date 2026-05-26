<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Configuración</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Gestión de Impuestos</h1>
      <p class="text-xs text-gray-400 mt-1">Administración de tasas impositivas y reglas fiscales del sistema.</p>
    </header>

    <div class="animate-slide-up">
      <ImpuestosTable />
    </div>
  </div>
</template>

<script setup>
import ImpuestosTable from '@/components/impuestos/ImpuestosTable.vue';
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.7s ease-out both;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
