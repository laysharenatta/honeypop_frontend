<template>
  <div class="flex flex-col gap-6">
    <!-- Header / Acciones -->
    <div class="flex justify-end items-center">
      <button 
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm" 
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nuevo Cliente
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
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Contacto</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Teléfono</th>
              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Email</th>
              <th class="px-6 py-4 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 text-sm font-medium text-gray-400">#{{ cliente.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ cliente.nombre }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ cliente.contacto }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ cliente.telefono }}</td>
              <td class="px-6 py-4 text-sm text-gray-400 font-medium">{{ cliente.correo }}</td>
              <td class="px-6 py-1 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openViewModal(cliente)" class="p-2 text-gray-400 hover:text-[#f266b3] hover:bg-pink-50 rounded-lg transition-colors" title="Ver detalles">
                    <i class="fa-regular fa-eye text-xs"></i>
                  </button>
                  <button @click="openEditModal(cliente)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <i class="fa-regular fa-pen-to-square text-xs"></i>
                  </button>
                  <button @click="handleDelete(cliente.id)" class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                    <i class="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="clientes.length === 0">
              <td class="px-6 py-12 text-sm text-gray-400 text-center italic" colspan="6">No hay clientes registrados en el sistema.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <ClientesModal 
        :isOpen="isOpen"
        :mode="mode"
        :cliente="currentCliente"
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
import * as ClientesService from '@/services/ClientesService'
import ClientesModal from './ClientesModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'

const clientes = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentCliente = ref({
  nombre: '',
  contacto: '',
  telefono: '',
  correo: '',
})

const isOpenConfirmDelete = ref(false)
const idToDelete = ref(null)

const fetchClientes = async () => {
  try {
    const data = await ClientesService.getAll()
    clientes.value = Array.isArray(data) ? data : (data.data || [])
  } catch (error) {
    console.error('Error fetching clientes:', error)
  }
}

const openAddModal = () => {
  mode.value = 'create'
  currentCliente.value = {
    nombre: '',
    contacto: '',
    telefono: '',
    correo: '',
  }
  isOpen.value = true
}

const openEditModal = (cliente) => {
  mode.value = 'edit'
  currentCliente.value = { ...cliente }
  isOpen.value = true
}

const openViewModal = (cliente) => {
  mode.value = 'view'
  currentCliente.value = { ...cliente }
  isOpen.value = true
}

const handleSave = async (data) => {
  try {
    if (mode.value === 'create') {
      await ClientesService.create(data)
    } else if (mode.value === 'edit') {
      await ClientesService.update(currentCliente.value.id, data)
    }
    await fetchClientes()
    isOpen.value = false
  } catch (error) {
    console.error('Error saving cliente:', error)
  }
}

const handleDelete = (id) => {
  idToDelete.value = id
  isOpenConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {
    await ClientesService.deleteCliente(idToDelete.value)
    await fetchClientes()
    isOpenConfirmDelete.value = false
    idToDelete.value = null
  } catch (error) {
    console.error('Error deleting cliente:', error)
    isOpenConfirmDelete.value = false
  }
}

onMounted(() => {
  fetchClientes()
})
</script>
