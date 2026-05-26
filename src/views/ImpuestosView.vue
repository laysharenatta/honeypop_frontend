<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-[#f266b3] to-[#e04fa0] rounded-xl">
            <i class="fa-solid fa-percent text-white text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Impuestos</h1>
            <p class="text-sm text-gray-500 mt-0.5">Gestión de tasas impositivas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <ImpuestosTable />
    </div>
  </div>
</template>

<script setup>
import ImpuestosTable from '@/components/impuestos/ImpuestosTable.vue'
</script>
