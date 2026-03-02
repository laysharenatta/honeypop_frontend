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
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.descripcion }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.categoria }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.stock_actual }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.stock_minimo }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.proveedor.contacto }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ producto.costo_unitario }}</td>

            <td class="px-6 py-4 text-sm text-gray-700 flex gap-4">
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openViewModal(producto)"><i class="fa-regular fa-eye"></i></button>
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openEditModal(producto)"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="deleteProducto(producto.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="productos.length === 0">
            <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="9">No hay productos.</td>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductosModal from './ProductosModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'

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

const fetchProductos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/productos', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
      },
    })
    productos.value = response.data
  } catch (error) {
    console.error(error)
  }
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
      await axios.post('http://localhost:8000/api/productos', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
        },
      })
    } else if (mode.value === 'edit') {
      await axios.put(`http://localhost:8000/api/productos/${currentProducto.value.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
        },
      })
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

const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/productos/${productoIdToDelete.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
      },
    })
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

