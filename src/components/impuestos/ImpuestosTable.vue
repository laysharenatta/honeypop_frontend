<template>
  <div class="flex flex-col gap-6">
    
    <!-- Header -->
    <div class="flex justify-end items-center">
      <button
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm"
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo Impuesto
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">

          <!-- Head -->
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                ID
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Nombre
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Código
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Porcentaje
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Descripción
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Estado
              </th>

              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Acciones
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-gray-50">

            <tr
              v-for="impuesto in impuestos"
              :key="impuesto.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              
              <!-- ID -->
              <td class="px-6 py-4 text-sm font-medium text-gray-400">
                #{{ impuesto.id }}
              </td>

              <!-- Nombre -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ impuesto.nombre }}
                </div>
              </td>

              <!-- Código -->
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase bg-gray-100 text-gray-600">
                  {{ impuesto.codigo }}
                </span>
              </td>

              <!-- Porcentaje -->
              <td class="px-6 py-4 text-sm font-bold text-gray-900">
                {{ parseFloat(impuesto.porcentaje).toFixed(2) }}%
              </td>

              <!-- Descripción -->
              <td
                class="px-6 py-4 text-sm text-gray-600 max-w-[220px] truncate"
                :title="impuesto.descripcion"
              >
                {{ impuesto.descripcion || '-' }}
              </td>

              <!-- Estado -->
              <td class="px-6 py-4 uppercase">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border"
                  :class="
                    impuesto.activo
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                      : 'bg-red-50 text-red-500 border-red-100'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="impuesto.activo ? 'bg-emerald-400' : 'bg-red-400'"
                  ></span>

                  {{ impuesto.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  <!-- Ver -->
                  <button
                    @click="openViewModal(impuesto)"
                    class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <i class="fa-regular fa-eye"></i>
                  </button>

                  <!-- Editar -->
                  <button
                    @click="openEditModal(impuesto)"
                    class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>

                  <!-- Eliminar -->
                  <button
                    @click="handleDelete(impuesto)"
                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </button>

                </div>
              </td>

            </tr>

            <!-- Empty -->
            <tr v-if="impuestos.length === 0">
              <td
                colspan="7"
                class="px-6 py-12 text-sm text-gray-400 text-center italic"
              >
                No hay impuestos registrados en el sistema.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal CRUD -->
    <ImpuestosModal
      :isOpen="isOpen"
      :mode="mode"
      :impuesto="currentImpuesto"
      @save="handleSaveImpuesto"
      @close="isOpen = false"
    />

    <!-- Modal Delete -->
    <ConfirmDeleteModal
      :isOpen="isOpenConfirmDelete"
      @confirm="confirmDelete"
      @cancel="isOpenConfirmDelete = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as ImpuestosService from '@/services/ImpuestosService'

import ImpuestosModal from './ImpuestosModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'

const impuestos = ref([])

const isOpen = ref(false)
const mode = ref('create')

const currentImpuesto = ref({
  codigo: '',
  nombre: '',
  porcentaje: 0,
  descripcion: '',
  activo: true,
})

const isOpenConfirmDelete = ref(false)
const idToDelete = ref(null)

const fetchImpuestos = async () => {
  try {
    const data = await ImpuestosService.getAll()

    impuestos.value = Array.isArray(data)
      ? data
      : (data.data || [])

  } catch (error) {
    console.error('Error fetching impuestos:', error)
  }
}

const openAddModal = () => {
  mode.value = 'create'

  currentImpuesto.value = {
    codigo: '',
    nombre: '',
    porcentaje: 0,
    descripcion: '',
    activo: true,
  }

  isOpen.value = true
}

const openEditModal = (impuesto) => {
  mode.value = 'edit'
  currentImpuesto.value = { ...impuesto }

  isOpen.value = true
}

const openViewModal = (impuesto) => {
  mode.value = 'view'
  currentImpuesto.value = { ...impuesto }

  isOpen.value = true
}

const handleSaveImpuesto = async (data) => {
  try {

    if (mode.value === 'create') {
      await ImpuestosService.create(data)
    }

    if (mode.value === 'edit') {
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
  idToDelete.value = impuesto.id
  isOpenConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {

    await ImpuestosService.deleteImpuesto(idToDelete.value)

    await fetchImpuestos()

    isOpenConfirmDelete.value = false
    idToDelete.value = null

  } catch (error) {
    console.error('Error deleting impuesto:', error)

    isOpenConfirmDelete.value = false
  }
}

onMounted(() => {
  fetchImpuestos()
})
</script>