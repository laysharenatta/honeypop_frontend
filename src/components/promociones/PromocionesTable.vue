<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nueva Promoción
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
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Valor</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Fecha Inicio</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Fecha Fin</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Estado</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="promocion in promociones" :key="promocion.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ promocion.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ promocion.nombre }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {{ promocion.tipo_descuento === 'porcentaje' ? '%' : '$' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ formatValue(promocion.valor, promocion.tipo_descuento) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(promocion.fecha_inicio) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(promocion.fecha_fin) }}</td>
              <td class="px-6 py-4 text-sm">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    promocion.estado === 'activo' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ promocion.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openViewModal(promocion)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye text-xs"></i>
                  </button>
                  <button @click="openEditModal(promocion)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <i class="fa-regular fa-pen-to-square text-xs"></i>
                  </button>
                  <button @click="handleDelete(promocion.id)" class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="promociones.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="8">No hay promociones registradas en el sistema.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <PromocionesModal 
        :isOpen="isOpen"
        :mode="mode"
        :promocion="currentPromocion"
        @save="handleSave"
        @close="isOpen = false"
      />

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
import * as PromocionesService from '@/services/PromocionesService'
import PromocionesModal from './PromocionesModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'

const promociones = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentPromocion = ref({
  nombre: '',
  descripcion: '',
  tipo_descuento: '',
  valor: 0,
  fecha_inicio: '',
  fecha_fin: '',
  estado: 'activo',
})

const isOpenConfirmDelete = ref(false)
const idToDelete = ref(null)

const fetchPromociones = async () => {
  try {
    const data = await PromocionesService.getAll()
    promociones.value = Array.isArray(data) ? data : (data.data || [])
  } catch (error) {
    console.error('Error fetching promociones:', error)
  }
}

const openAddModal = () => {
  mode.value = 'create'
  currentPromocion.value = {
    nombre: '',
    descripcion: '',
    tipo_descuento: '',
    valor: 0,
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo',
  }
  isOpen.value = true
}

const openEditModal = (promocion) => {
  mode.value = 'edit'
  currentPromocion.value = { ...promocion }
  isOpen.value = true
}

const openViewModal = (promocion) => {
  mode.value = 'view'
  currentPromocion.value = { ...promocion }
  isOpen.value = true
}

const handleSave = async (data) => {
  try {
    if (mode.value === 'create') {
      await PromocionesService.create(data)
    } else if (mode.value === 'edit') {
      await PromocionesService.update(currentPromocion.value.id, data)
    }
    await fetchPromociones()
    isOpen.value = false
  } catch (error) {
    console.error('Error saving promocion:', error)
  }
}

const handleDelete = (id) => {
  idToDelete.value = id
  isOpenConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {
    await PromocionesService.deletePromocion(idToDelete.value)
    await fetchPromociones()
    isOpenConfirmDelete.value = false
  } catch (error) {
    console.error('Error deleting promocion:', error)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatValue = (value, tipo) => {
  if (tipo === 'porcentaje') {
    return `${parseFloat(value).toFixed(2)}%`
  }
  return `$${parseFloat(value).toFixed(2)}`
}

onMounted(() => {
  fetchPromociones()
})
</script>
