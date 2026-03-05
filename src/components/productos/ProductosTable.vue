<template>
  <div class="overflow-x-auto">
    <div class="min-w-full bg-white shadow rounded-lg p-4 flex flex-col justify-center items-end">
      <button class="bg-[#f266b3] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#e055a0] transition-colors" @click="openAddModal"><i class="fa-solid fa-plus mr-2"></i>Nuevo registro</button>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#f266b3]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Categoría</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stock Actual</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stock Mínimo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Proveedor</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Costo Unitario</th>
             <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
               <div class="flex items-center gap-2">
                 Estrategia
                 <button 
                   @click="toggleEstrategiaFilter"
                   class="hover:bg-white/20 p-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                   :title="filterTitle"
                 >
                   <i class="fa-solid fa-filter text-[10px]" :class="currentEstrategia ? 'text-white' : 'text-white/50'"></i>
                   <span v-if="currentEstrategia" class="text-[10px] font-bold">{{ currentEstrategia }}</span>
                 </button>
               </div>
             </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.descripcion }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.categoria }}</td>
            <td class="px-6 py-4 text-sm">
              <span v-if="producto.stock_actual <= producto.stock_minimo" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                {{ producto.stock_actual }}
              </span>
              <span v-else class="text-gray-700">
                {{ producto.stock_actual }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.stock_minimo }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.proveedor.contacto }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.costo_unitario }}</td>
            <td class="px-6 py-4 text-sm font-bold">
              <span :class="producto.estrategia_logistica === 'PUSH' ? 'text-blue-600 bg-blue-50 px-2 py-1 rounded' : 'text-orange-600 bg-orange-50 px-2 py-1 rounded'">
                {{ producto.estrategia_logistica }}
              </span>
            </td>

            <td class="px-6 py-4 text-sm text-gray-700 flex gap-4">
              <!-- Ver -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openViewModal(producto)">
                  <i class="fa-regular fa-eye"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver
                </span>
              </div>
              <!-- Editar -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openEditModal(producto)">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Editar
                </span>
              </div>
              <!-- Eliminar -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="deleteProducto(producto.id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Eliminar
                </span>
              </div>
              <!-- Movimientos -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="showMovements(producto.id)">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Movimientos
                </span>
              </div>

              <div class="relative group" v-if="producto.estrategia_logistica === 'PULL'">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="showOrders(producto.id)">
                  <i class="fa-solid fa-truck"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Pedido
                </span>
              </div>

               <!-- Selector rápido de estrategia -->
               <div class="relative flex items-center">
                 <select 
                   :value="producto.estrategia_logistica"
                   @change="handleQuickEstrategiaUpdate(producto.id, $event.target.value)"
                   class="text-[10px] font-bold border rounded px-1 py-0.5 bg-gray-50 focus:ring-1 focus:ring-[#f266b3] focus:outline-none cursor-pointer"
                   :class="producto.estrategia_logistica === 'PUSH' ? 'text-blue-600 border-blue-200' : 'text-orange-600 border-orange-200'"
                 >
                   <option value="PUSH">PUSH</option>
                   <option value="PULL">PULL</option>
                 </select>
               </div>
             </td>
          </tr>
           <tr v-if="productos.length === 0">
             <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="10">No hay productos.</td>
           </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <ProductosModal 
        :isOpen="isOpen"
        :mode="mode"
        :producto="currentProducto"
        @save="handleSaveProducto"
        @close="isOpen = false"
      />

      <!-- Confirm Delete Modal -->
      <ConfirmDeleteModal
        :isOpen="isOpenConfirmDelete"
        @confirm="confirmDelete"
        @cancel="isOpenConfirmDelete = false"
      />

      <!-- Pedidos Modal -->
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

