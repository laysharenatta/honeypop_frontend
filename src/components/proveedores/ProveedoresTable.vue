<template>
  <div class="overflow-x-auto">
    <div class="min-w-full bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#f266b3]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Dirección</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Correo</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="proveedor in proveedores" :key="proveedor.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.nombre }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.direccion }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.telefono }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ proveedor.email }}</td>
          </tr>
          <tr v-if="proveedores.length === 0">
            <td class="px-6 py-4 text-sm text-gray-500 text-center" colspan="5">No hay proveedores.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const proveedores = ref([])

const fetchProveedores = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/proveedores', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 20|wQK5lPvHfT6cMmKf9c8hao8vjrcHncGc6UsoDDWyed72773f',
      },
    })

    proveedores.value = response.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchProveedores()
})
</script>

