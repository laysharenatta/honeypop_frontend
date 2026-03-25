<template>
  <div class="flex flex-col gap-6">
    <!-- Header de la tabla / Acciones -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="relative flex items-center">
        <!-- Espacio para buscador si existiera, por ahora solo el botón de filtro -->
        <button 
          @click="toggleEstrategiaFilter"
          class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-white text-xs font-medium text-gray-500 transition-all hover:bg-gray-50"
          :title="filterTitle"
        >
          <i class="fa-solid fa-filter" :class="currentEstrategia ? 'text-[#f266b3]' : 'text-gray-300'"></i>
          <span>{{ currentEstrategia || 'Todas las estrategias' }}</span>
        </button>
      </div>
      
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo registro
      </button>
    </div>

    <!-- Contenedor de la Tabla -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Categoría</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Stock</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Mínimo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Proveedor</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Costo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Estrategia</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ producto.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ producto.nombre }}</div>
                <div class="text-[10px] text-gray-400 truncate max-w-[150px]">{{ producto.descripcion }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ producto.categoria }}</td>
              <td class="px-6 py-4">
                <span 
                  v-if="producto.stock_actual <= producto.stock_minimo" 
                  class="px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-lg bg-rose-50 text-rose-500 border border-rose-100"
                >
                  {{ producto.stock_actual }}
                </span>
                <span v-else class="text-sm text-gray-600 font-medium">
                  {{ producto.stock_actual }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-400">{{ producto.stock_minimo }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ producto.proveedor.contacto }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">${{ producto.costo_unitario }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight"
                    :class="producto.estrategia_logistica === 'PUSH' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-orange-50 text-orange-500 border border-orange-100'"
                  >
                    {{ producto.estrategia_logistica }}
                  </span>
                  <!-- Selector rápido solo visible en hover o foco -->
                  <select 
                    :value="producto.estrategia_logistica"
                    @change="handleQuickEstrategiaUpdate(producto.id, $event.target.value)"
                    class="opacity-0 group-hover:opacity-100 text-[9px] font-bold border rounded-lg px-1 py-0.5 bg-white focus:ring-1 focus:ring-[#f266b3] focus:outline-none cursor-pointer transition-opacity"
                  >
                    <option value="PUSH">PUSH</option>
                    <option value="PULL">PULL</option>
                  </select>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Ver -->
                  <button @click="openViewModal(producto)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalle">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                  <!-- Editar -->
                  <button @click="openEditModal(producto)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <!-- Movimientos -->
                  <button @click="showMovements(producto.id)" class="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors" title="Movimientos">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  </button>
                  <!-- Pedido (Solo PULL) -->
                  <button v-if="producto.estrategia_logistica === 'PULL'" @click="showOrders(producto.id)" class="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Crear pedido">
                    <i class="fa-solid fa-truck"></i>
                  </button>
                  <!-- Eliminar -->
                  <button @click="deleteProducto(producto.id)" class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="productos.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="9">No se encontraron productos.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <ProductosModal 
        :isOpen="isOpen"
        :mode="mode"
        :producto="currentProducto"
        @save="handleSaveProducto"
        @close="isOpen = false"
      />

      <ConfirmDeleteModal
        :isOpen="isOpenConfirmDelete"
        @confirm="confirmDelete"
        @cancel="isOpenConfirmDelete = false"
      />

      <PedidosModal 
        :isOpen="isPedidoModalOpen"
        mode="create"
        :pedido="currentPedidoData"
        @save="handleSavePedido"
        @close="isPedidoModalOpen = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProductosModal from './ProductosModal.vue'
import PedidosModal from '../pedidos/PedidosModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'
import * as ProductosService from '@/services/ProductosService'
import * as PedidosService from '@/services/PedidosService'
import { useRouter } from 'vue-router'

const router = useRouter()

const productos = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentProducto = ref({
  nombre: '',
  descripcion: '',
  categoria: '',
  stock_actual: 0,
  stock_minimo: 0,
  proveedor_id: null,
  costo_unitario: 0.0,
})

const isOpenConfirmDelete = ref(false)
const productoIdToDelete = ref(null)
const currentEstrategia = ref(null) // null, 'PUSH', 'PULL'

// Pedidos Modal State
const isPedidoModalOpen = ref(false)
const currentPedidoData = ref({
  producto_id: null,
  cantidad: 1,
  tipo: 'reposicion',
  estado: 'pendiente'
})

const filterTitle = computed(() => {
  if (!currentEstrategia.value) return 'Filtrar por estrategia'
  return `Filtrando por: ${currentEstrategia.value}`
})

const fetchProductos = async () => {
  try {
    const params = {}
    if (currentEstrategia.value) {
      params.estrategia = currentEstrategia.value
    }
    productos.value = await ProductosService.getAll(params)
  } catch (error) {
    console.error(error)
  }
}

const toggleEstrategiaFilter = () => {
  if (currentEstrategia.value === null) {
    currentEstrategia.value = 'PUSH'
  } else if (currentEstrategia.value === 'PUSH') {
    currentEstrategia.value = 'PULL'
  } else {
    currentEstrategia.value = null
  }
  fetchProductos()
}

const openAddModal = () => {
  mode.value = 'create';
  currentProducto.value = {
    nombre: '',
    descripcion: '',
    categoria: '',
    stock_actual: 0,
    stock_minimo: 0,
    proveedor_id: null,
    costo_unitario: 0.0,
  };
  isOpen.value = true;
}

const openEditModal = (producto) => {
  mode.value = 'edit'
  currentProducto.value = { ...producto }
  isOpen.value = true
}

const openViewModal = (producto) => {
  mode.value = 'view'
  currentProducto.value = { ...producto }
  isOpen.value = true
}

const handleSaveProducto = async (data) => {
  try {
    if (mode.value === 'create') {
      await ProductosService.create(data)
    } else if (mode.value === 'edit') {
      await ProductosService.update(currentProducto.value.id, data)
    }
    await fetchProductos()
    isOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const deleteProducto = (id) => {
  productoIdToDelete.value = id
  isOpenConfirmDelete.value = true
}

const showMovements = (id) => {
  router.push({ name: 'productos-movimientos', params: { id } })
}

const showOrders = (productId) => {
  currentPedidoData.value = {
    producto_id: productId,
    cantidad: 1,
    tipo: 'reposicion',
    estado: 'pendiente'
  }
  isPedidoModalOpen.value = true
}

const handleSavePedido = async (data) => {
  try {
    await PedidosService.create(data)
    isPedidoModalOpen.value = false
    // Opcionalmente podrías mostrar un aviso de éxito aquí
  } catch (error) {
    console.error('Error al crear pedido desde productos:', error)
  }
}

const handleQuickEstrategiaUpdate = async (id, nuevaEstrategia) => {
  try {
    await ProductosService.updateEstrategia(id, nuevaEstrategia)
    await fetchProductos() // Recargamos para ver el cambio reflejado
  } catch (error) {
    console.error('Error al actualizar estrategia rápida:', error)
  }
}

const confirmDelete = async () => {
  try {
    await ProductosService.deleteProducto(productoIdToDelete.value)
    await fetchProductos()
    isOpenConfirmDelete.value = false
    productoIdToDelete.value = null
  } catch (error) {
    console.error(error)
    isOpenConfirmDelete.value = false
  }
}

onMounted(() => {
  fetchProductos()
})
</script>

