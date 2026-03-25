<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo Movimiento
      </button>
    </div>
    
    <!-- Contenedor de la Tabla -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">ID</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Cantidad</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Motivo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Fecha</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="movimiento in movimientos" :key="movimiento.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ movimiento.id }}</td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border uppercase"
                  :class="movimiento.tipo === 'entrada' 
                    ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                    : 'bg-rose-50 text-rose-500 border-rose-100'"
                >
                  <i :class="movimiento.tipo === 'entrada' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'" class="text-[8px]"></i>
                  {{ movimiento.tipo }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900">{{ movimiento.cantidad }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 w-fit px-2 py-0.5 rounded-lg border border-gray-100">
                  {{ movimiento.motivo }}
                </div>
              </td>
              <td class="px-6 py-4 text-[11px] text-gray-400 font-medium">
                {{ movimiento.fecha }}
              </td>

              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Ver -->
                  <button @click="openViewModal(movimiento)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye text-xs"></i>
                  </button>
                  <!-- Editar -->
                  <button @click="openEditModal(movimiento)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <i class="fa-regular fa-pen-to-square text-xs"></i>
                  </button>
                  <!-- Eliminar -->
                  <button @click="deleteMovimiento(movimiento.id)" class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="movimientos.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="6">No hay movimientos registrados para este producto.</td>
            </tr>
          </tbody>
        </table>
      </div>

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

