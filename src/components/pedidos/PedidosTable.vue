<template>
  <div class="overflow-x-auto px-4">
    <div class="min-w-full bg-white shadow rounded-lg p-6 flex flex-col justify-center items-end">
      <button 
        class="bg-[#f266b3] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#e055a0] transition-colors flex items-center" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>Nuevo Pedido
      </button>
      
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#f266b3]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Producto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cantidad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="pedido in pedidos" :key="pedido.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700 font-medium select-all">#{{ pedido.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
              {{ pedido.producto?.nombre || `Producto #${pedido.producto_id}` }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ pedido.cantidad }}</td>
            <td class="px-6 py-4 text-sm capitalize">
              <span 
                class="px-2 py-1 rounded text-xs font-bold"
                :class="pedido.tipo === 'reposicion' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ pedido.tipo }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit capitalize"
                :class="pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
              >
                <i :class="pedido.estado === 'pendiente' ? 'fa-solid fa-clock' : 'fa-solid fa-check-circle'"></i>
                {{ pedido.estado }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 flex gap-4">
              <!-- Ver -->
              <div class="relative group">
                <button 
                  class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" 
                  @click="openViewModal(pedido)"
                  title="Ver detalles"
                >
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
              
              <!-- Cambiar Estado -->
              <div class="relative group" v-if="pedido.estado === 'pendiente'">
                <button 
                  class="text-green-600 px-2 py-1 rounded-md transition-colors hover:bg-green-600 hover:text-white cursor-pointer" 
                  @click="handleUpdateStatus(pedido.id, 'surtido')"
                  title="Marcar como Surtido"
                >
                  <i class="fa-solid fa-truck-ramp-box"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="pedidos.length === 0">
            <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="6">No hay pedidos registrados.</td>
          </tr>
        </tbody>
      </table>

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
