<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openCreateModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nueva Orden
      </button>
    </div>
    
    <!-- Contenedor de la Tabla -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Agente</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Total</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Estado</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Fecha</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="orden in ordenes" :key="orden.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ orden.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ orden.client?.nombre || 'Desconocido' }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ orden.user?.name || 'Desconocido' }}
              </td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900">
                ${{ orden.total }}
              </td>
              <td class="px-6 py-4 uppercase">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border transition-colors"
                  :class="!orden.estado 
                    ? 'bg-amber-50 text-amber-500 border-amber-100' 
                    : 'bg-emerald-50 text-emerald-500 border-emerald-100'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="!orden.estado ? 'bg-amber-400' : 'bg-emerald-400'"></span>
                  {{ !orden.estado ? 'Pendiente' : 'Completado' }}
                </span>
              </td>
              <td class="px-6 py-4 text-[11px] text-gray-400 font-medium">
                {{ new Date(orden.fecha).toLocaleDateString() }}
              </td>
              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Ver Detalles -->
                  <button @click="openViewModal(orden)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                  
                  <!-- Completar Orden -->
                  <button 
                    v-if="!orden.estado"
                    @click="handleUpdateStatus(orden.id)"
                    class="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" 
                    title="Marcar como Completado"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="ordenes.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="7">No hay órdenes empresariales registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <OrdenesModal 
        ref="createModalRef"
        :isOpen="isCreateModalOpen"
        @save="handleSaveOrden"
        @close="isCreateModalOpen = false"
      />

      <OrdenDetailModal 
        :isOpen="isViewModalOpen"
        :orden="currentOrden"
        @close="isViewModalOpen = false"
      />
    </div>
  </div>

  <!-- Overlay: Procesando -->
  <div v-if="isProcessing" class="fixed inset-0 bg-gray-900/10 backdrop-blur-md flex flex-col items-center justify-center z-[100] animate-in fade-in duration-300">
    <div class="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 border border-gray-100 text-center">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-pink-100 rounded-full"></div>
        <div class="w-16 h-16 border-4 border-[#f266b3] border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
      <div>
        <p class="text-xl font-semibold text-gray-900 tracking-tight">Procesando Orden</p>
        <p class="text-xs text-gray-400 mt-2 leading-relaxed">Optimizando inventario y registrando transacciones. Por favor espera un momento.</p>
      </div>
    </div>
  </div>

  <!-- Modal Éxito -->
  <div v-if="isSuccessOpen" class="fixed inset-0 bg-gray-900/10 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in zoom-in duration-300">
    <div class="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 text-center border border-gray-100">
      <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-400">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 tracking-tight">¡Éxito!</h2>
        <p class="text-xs text-gray-400 mt-2">La orden ha sido procesada y el inventario actualizado correctamente.</p>
      </div>
      
      <div class="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orden No. #{{ lastOrderId }}</p>
        <p class="text-3xl font-bold text-[#f266b3]">${{ lastOrderTotal }}</p>
      </div>

      <button
        class="w-full py-3.5 bg-[#f266b3] text-white rounded-xl text-sm font-semibold hover:bg-[#e04fa0] shadow-sm transition-all active:scale-95"
        @click="isSuccessOpen = false"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as OrdenesService from '@/services/OrdenesService'
import OrdenDetailModal from './OrdenDetailModal.vue'
import OrdenesModal from './OrdenesModal.vue'

const ordenes = ref([])
const isViewModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const createModalRef = ref(null)
const currentOrden = ref(null)
const isProcessing = ref(false)
const isSuccessOpen = ref(false)
const lastOrderId = ref(null)
const lastOrderTotal = ref(null)

const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const handleSaveOrden = async (payload) => {
  try {
    // Cerrar modal de creación y mostrar overlay de procesando
    isCreateModalOpen.value = false
    isProcessing.value = true

    const result = await OrdenesService.procesar(payload)

    // Guardar datos para la pantalla de éxito
    lastOrderId.value = result.id || result?.orden?.id || '—'
    lastOrderTotal.value = result.total || result?.orden?.total || '—'

    await fetchOrdenes()
    isSuccessOpen.value = true
  } catch (error) {
    console.error('Error procesando orden:', error)
    // Reabre el modal con el error si falla
    isCreateModalOpen.value = true
    if (createModalRef.value) {
      createModalRef.value.errorMessage = error.response?.data?.message || 'Error al procesar la orden. Inténtalo de nuevo.'
      createModalRef.value.isSubmitting = false
    }
  } finally {
    isProcessing.value = false
  }
}

const fetchOrdenes = async () => {
  try {
    const data = await OrdenesService.getAll()
    ordenes.value = data
  } catch (error) {
    console.error('Error fetching ordenes:', error)
  }
}

const openViewModal = (orden) => {
  currentOrden.value = { ...orden }
  isViewModalOpen.value = true
}

const handleUpdateStatus = async (id) => {
  if(confirm("¿Estás seguro de marcar esta orden como completada?")) {
      try {
        await OrdenesService.updateStatus(id, { estado: true })
        await fetchOrdenes()
      } catch (error) {
        console.error('Error updating status:', error)
      }
  }
}

onMounted(() => {
  fetchOrdenes()
})
</script>
