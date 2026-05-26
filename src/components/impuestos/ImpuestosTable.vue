<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo Impuesto
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
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Código</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Porcentaje</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Descripción</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Estado</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="impuesto in impuestos" :key="impuesto.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ impuesto.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ impuesto.nombre }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase bg-gray-100 text-gray-600">
                  {{ impuesto.codigo }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ impuesto.porcentaje }}%</td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ impuesto.descripcion || '-' }}
              </td>
              <td class="px-6 py-4 uppercase">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border"
                  :class="impuesto.activo 
                    ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                    : 'bg-red-50 text-red-500 border-red-100'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="impuesto.activo ? 'bg-emerald-400' : 'bg-red-400'"></span>
                  {{ impuesto.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <!-- Ver -->
                  <button @click="openViewModal(impuesto)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                  
                  <!-- Editar -->
                  <button @click="openEditModal(impuesto)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>

                  <!-- Eliminar -->
                  <button @click="handleDelete(impuesto)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="impuestos.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="7">No hay impuestos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <ImpuestosModal 
        :isOpen="isOpen"
        :mode="mode"
        :impuesto="currentImpuesto"
        @save="handleSaveImpuesto"
        @close="isOpen = false"
      />

      <!-- Confirm Delete Modal -->
      <ConfirmDeleteModal
        :isOpen="isDeleteOpen"
        :item="currentImpuesto"
        @confirm="confirmDelete"
        @cancel="isDeleteOpen = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as ImpuestosService from '@/services/ImpuestosService'
import ImpuestosModal from './ImpuestosModal.vue'
import ConfirmDeleteModal from '@/components/widgets/ConfirmDeleteModal.vue'

const impuestos = ref([])
const isOpen = ref(false)
const isDeleteOpen = ref(false)
const mode = ref('create')
const currentImpuesto = ref({
  nombre: '',
  codigo: '',
  porcentaje: 0,
  descripcion: '',
  activo: true,
})

const fetchImpuestos = async () => {
  try {
    const data = await ImpuestosService.getAll()
    impuestos.value = data
  } catch (error) {
    console.error('Error fetching impuestos:', error)
  }
}

const openAddModal = () => {
  mode.value = 'create'
  currentImpuesto.value = {
    nombre: '',
    codigo: '',
    porcentaje: 0,
    descripcion: '',
    activo: true,
  }
  isOpen.value = true
}

const openViewModal = (impuesto) => {
  mode.value = 'view'
  currentImpuesto.value = { ...impuesto }
  isOpen.value = true
}

const openEditModal = (impuesto) => {
  mode.value = 'edit'
  currentImpuesto.value = { ...impuesto }
  isOpen.value = true
}

const handleSaveImpuesto = async (data) => {
  try {
    if (mode.value === 'create') {
      await ImpuestosService.create(data)
    } else if (mode.value === 'edit') {
      await ImpuestosService.update(currentImpuesto.value.id, data)
    }
    await fetchImpuestos()
    isOpen.value = false
  } catch (error) {
    console.error('Error saving impuesto:', error)
    alert('Error al guardar el impuesto')
  }
}

const handleDelete = (impuesto) => {
  currentImpuesto.value = impuesto
  isDeleteOpen.value = true
}

const confirmDelete = async () => {
  try {
    await ImpuestosService.delete_resource(currentImpuesto.value.id)
    await fetchImpuestos()
    isDeleteOpen.value = false
  } catch (error) {
    console.error('Error deleting impuesto:', error)
    alert('Error al eliminar el impuesto')
  }
}

onMounted(() => {
  fetchImpuestos()
})
</script>
