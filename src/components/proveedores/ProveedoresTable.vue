<template>
  <div class="overflow-x-auto">
    <div class="min-w-full bg-white shadow rounded-lg p-4 flex flex-col justify-center items-end">
      <button class="bg-[#f266b3] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#e055a0] transition-colors" @click="openAddModal"><i class="fa-solid fa-plus mr-2"></i>Nuevo registro</button>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#f266b3]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contacto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Correo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="proveedor in proveedores" :key="proveedor.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.contacto }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.telefono }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.correo }}</td>
            <td class="px-6 py-4 text-sm text-gray-700 flex gap-4">
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openViewModal(proveedor)"><i class="fa-regular fa-eye"></i></button>
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="openEditModal(proveedor)"><i class="fa-regular fa-pen-to-square"></i></button>
              <button class="text-[#f266b3] px-2 py-1 rounded-md text-s
              transition-colors hover:bg-[#e055a0] hover:text-white cursor-pointer" @click="deleteProveedor(proveedor.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="proveedores.length === 0">
            <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="6">No hay proveedores.</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <ProveedoresModal 
        :isOpen="isOpen"
        :mode="mode"
        :proveedor="currentProveedor"
        @save="handleSaveProveedor"
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
import ProveedoresModal from './ProveedoresModal.vue'
import ConfirmDeleteModal from '../widgets/ConfirmDeleteModal.vue'

const proveedores = ref([])
const isOpen = ref(false)
const mode = ref('create')
const currentProveedor = ref({
  nombre: '',
  contacto: '',
  telefono: '',
  correo: '',
})

const isOpenConfirmDelete = ref(false)
const proveedorIdToDelete = ref(null)

const fetchProveedores = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/proveedores', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
      },
    })
    proveedores.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const openAddModal = () => {
  mode.value = 'create';
  currentProveedor.value = {
    nombre: '',
    contacto: '',
    telefono: '',
    correo: '',
  };
  isOpen.value = true;
}

const openEditModal = (proveedor) => {
  mode.value = 'edit'
  currentProveedor.value = { ...proveedor }
  isOpen.value = true
}

const openViewModal = (proveedor) => {
  mode.value = 'view'
  currentProveedor.value = { ...proveedor }
  isOpen.value = true
}

const handleSaveProveedor = async (data) => {
  try {
    if (mode.value === 'create') {
      await axios.post('http://localhost:8000/api/proveedores', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
        },
      })
    } else if (mode.value === 'edit') {
      await axios.put(`http://localhost:8000/api/proveedores/${currentProveedor.value.id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
        },
      })
    }
    await fetchProveedores()
    isOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const deleteProveedor = (id) => {
  proveedorIdToDelete.value = id
  isOpenConfirmDelete.value = true
}

const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/proveedores/${proveedorIdToDelete.value}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 1|46a1I8p3nRMVQnRdHdvj8sIiY8d0M273UljXxlu15f12f98a',
      },
    })
    await fetchProveedores()
    isOpenConfirmDelete.value = false
    proveedorIdToDelete.value = null
  } catch (error) {
    console.error(error)
    isOpenConfirmDelete.value = false
  }
}

onMounted(() => {
  fetchProveedores()
})
</script>

