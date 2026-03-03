<template>
  <div class="overflow-x-auto">
    <div class="min-w-full bg-white shadow rounded-lg p-4 flex flex-col justify-center items-end">
      <button class="bg-[#f266b3] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#e055a0] transition-colors" @click="openAddModal"><i class="fa-solid fa-plus mr-2"></i>Nuevo registro</button>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#f266b3]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cantidad</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Motivo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="movimiento in movimientos" :key="movimiento.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ movimiento.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ movimiento.tipo }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ movimiento.cantidad }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ movimiento.motivo }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ movimiento.fecha }}</td>

            <td class="px-6 py-4 text-sm text-gray-700 flex gap-4">
              <!-- Ver -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openViewModal(movimiento)">
                  <i class="fa-regular fa-eye"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver
                </span>
              </div>
              <!-- Editar -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openEditModal(movimiento)">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Editar
                </span>
              </div>
              <!-- Eliminar -->
              <div class="relative group">
                <button class="text-[#f266b3] px-2 py-1 rounded-md transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="deleteMovimiento(movimiento.id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
                <span class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Eliminar
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="movimientos.length === 0">
            <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="9">No hay movimientos.</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <ProductosMovimientosModal
        :isOpen="isOpen"
        :mode="mode"
        :movimiento="currentMovimiento"
        @save="handleSaveMovimiento"
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
import ProductosMovimientosModal from './ProductosMovimientosModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// router eliminado — no se navega desde aquí


const movimientos = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentMovimiento = ref({
  tipo: '',
  cantidad: 0,
  motivo: '',
})

const isOpenConfirmDelete = ref(false)
const movimientoIdToDelete = ref(null)

const fetchMovimientos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/productos/' + route.params.id + '/movimientos', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
    movimientos.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const openAddModal = () => {
  mode.value = 'create';
  currentMovimiento.value = {
    tipo: '',
    cantidad: 0,
    motivo: '',
  };
  isOpen.value = true;
}

const openEditModal = (movimiento) => {
  mode.value = 'edit'
  currentMovimiento.value = { ...movimiento }
  isOpen.value = true
}

const openViewModal = (movimiento) => {
  mode.value = 'view'
  currentMovimiento.value = { ...movimiento }
  isOpen.value = true
}

const handleSaveMovimiento = async (data) => {
  try {
    const payload = {
      producto_id: route.params.id,
      tipo: data.tipo,
      cantidad: data.cantidad,
      motivo: data.motivo,
    }
    if (mode.value === 'create') {
      await axios.post('http://localhost:8000/api/inventario/movimientos', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
    } else if (mode.value === 'edit') {
      await axios.put(`http://localhost:8000/api/inventario/movimientos/${currentMovimiento.value.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
    }
    await fetchMovimientos()
    isOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const deleteMovimiento = (id) => {
  movimientoIdToDelete.value = id
  isOpenConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/inventario/movimientos/${movimientoIdToDelete.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
    await fetchMovimientos()
    isOpenConfirmDelete.value = false
    movimientoIdToDelete.value = null
  } catch (error) {
    console.error(error)
    isOpenConfirmDelete.value = false
  }
}

onMounted(() => {
  fetchMovimientos()
})
</script>

