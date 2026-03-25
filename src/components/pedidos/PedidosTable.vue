<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo Pedido
      </button>
    </div>
    
    <!-- Contenedor de la Tabla -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Producto</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Cantidad</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Estado</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="pedido in pedidos" :key="pedido.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ pedido.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ pedido.producto?.nombre || `Producto #${pedido.producto_id}` }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ pedido.cantidad }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight uppercase"
                  :class="pedido.tipo === 'reposicion' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-purple-50 text-purple-500 border border-purple-100'"
                >
                  {{ pedido.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 uppercase">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border"
                  :class="pedido.estado === 'pendiente' 
                    ? 'bg-amber-50 text-amber-500 border-amber-100' 
                    : 'bg-emerald-50 text-emerald-500 border-emerald-100'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="pedido.estado === 'pendiente' ? 'bg-amber-400' : 'bg-emerald-400'"></span>
                  {{ pedido.estado }}
                </span>
              </td>
              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Ver -->
                  <button @click="openViewModal(pedido)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                  
                  <!-- Marcar como Surtido -->
                  <button 
                    v-if="pedido.estado === 'pendiente'"
                    @click="handleUpdateStatus(pedido.id, 'surtido')"
                    class="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" 
                    title="Marcar como Surtido"
                  >
                    <i class="fa-solid fa-truck-ramp-box"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pedidos.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="6">No hay pedidos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <PedidosModal 
        :isOpen="isOpen"
        :mode="mode"
        :pedido="currentPedido"
        @save="handleSavePedido"
        @close="isOpen = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as PedidosService from '@/services/PedidosService'
import PedidosModal from './PedidosModal.vue'

const pedidos = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentPedido = ref({
  producto_id: null,
  cantidad: 1,
  tipo: 'reposicion',
  estado: 'pendiente',
})

const fetchPedidos = async () => {
  try {
    const data = await PedidosService.getAll()
    pedidos.value = data
  } catch (error) {
    console.error('Error fetching pedidos:', error)
  }
}

const openAddModal = () => {
  mode.value = 'create';
  currentPedido.value = {
    producto_id: null,
    cantidad: 1,
    tipo: 'reposicion',
    estado: 'pendiente',
  };
  isOpen.value = true;
}

const openViewModal = (pedido) => {
  mode.value = 'view'
  currentPedido.value = { ...pedido }
  isOpen.value = true
}

const handleSavePedido = async (data) => {
  try {
    if (mode.value === 'create') {
      await PedidosService.create(data)
    }
    await fetchPedidos()
    isOpen.value = false
  } catch (error) {
    console.error('Error saving pedido:', error)
  }
}

const handleUpdateStatus = async (id, status) => {
  try {
    await PedidosService.updateStatus(id, { estado: status })
    await fetchPedidos()
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

onMounted(() => {
  fetchPedidos()
})
</script>
