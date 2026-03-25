<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">

      <!-- Header -->
      <div class="flex justify-between items-center p-8">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 tracking-tight">Detalle de Orden</h2>
          <p class="text-[10px] font-bold text-[#f266b3] uppercase tracking-widest mt-1">Nº ID: #{{ orden?.id }}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div v-if="orden" class="px-8 pb-4 overflow-y-auto flex-1 space-y-8">

        <!-- Info general -->
        <div class="grid grid-cols-2 gap-y-6 gap-x-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-50">
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 label-spacing">Cliente</p>
            <p class="text-sm font-semibold text-gray-800">{{ orden.client?.nombre || 'Desconocido' }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 label-spacing">Agente</p>
            <p class="text-sm font-semibold text-gray-800">{{ orden.user?.name || 'Desconocido' }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 label-spacing">Fecha de Venta</p>
            <p class="text-xs font-medium text-gray-500">{{ orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 label-spacing">Estado Actual</p>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border transition-colors uppercase"
              :class="!orden.estado 
                ? 'bg-amber-50 text-amber-500 border-amber-100' 
                : 'bg-emerald-50 text-emerald-500 border-emerald-100'"
            >
              <span class="w-1 h-1 rounded-full" :class="!orden.estado ? 'bg-amber-400' : 'bg-emerald-400'"></span>
              {{ !orden.estado ? 'Pendiente' : 'Completado' }}
            </span>
          </div>
        </div>

        <!-- Productos -->
        <div class="space-y-4">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Artículos Incluidos</p>
          <div v-if="orden.productos && orden.productos.length" class="space-y-2">
            <div
              v-for="(prod, i) in orden.productos"
              :key="i"
              class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-800">{{ prod.nombre || prod.name || `Art. #${prod.id}` }}</span>
                <span class="text-[10px] text-gray-400 font-medium">Categoría del producto</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="flex flex-col items-end">
                   <span class="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Cant.</span>
                   <span class="text-sm font-bold text-gray-600">x{{ prod.pivot?.cantidad || prod.cantidad || '—' }}</span>
                </div>
                <div class="flex flex-col items-end min-w-[60px]">
                   <span class="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Precio</span>
                   <span class="text-sm font-bold text-gray-900">${{ prod.pivot?.precio_unitario || prod.precio || prod.costo_unitario || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 italic text-center py-4">Sin detalle de productos disponible.</p>
        </div>

        <!-- Total -->
        <div class="flex flex-col items-end pt-2">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monto Total Recaudado</span>
          <span class="text-3xl font-bold text-[#f266b3] tracking-tighter">${{ orden.total }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-8 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
        <button
          class="w-full py-3 bg-[#f266b3] text-white rounded-xl text-sm font-semibold hover:bg-[#e04fa0] shadow-sm transition-all active:scale-95"
          @click="emit('close')"
        >
          Cerrar Detalle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  orden: { type: Object, default: null }
})

const emit = defineEmits(['close'])
</script>
