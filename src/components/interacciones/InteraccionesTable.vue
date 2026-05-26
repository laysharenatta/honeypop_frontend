<template>
  <div class="flex flex-col gap-6">

    <!-- Header / Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3">

        <!-- Search -->
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar cliente o usuario..."
            class="w-64 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-100"
          />

          <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
        </div>

        <!-- Tipo Filter -->
        <button
          @click="toggleTipoFilter"
          class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white text-xs font-medium text-gray-500 transition-all hover:bg-gray-50"
        >
          <i
            class="fa-solid fa-filter"
            :class="currentTipo ? 'text-[#f266b3]' : 'text-gray-300'"
          ></i>

          <span>
            {{ currentTipo || 'Todos los tipos' }}
          </span>
        </button>

      </div>

      <!-- Add -->
      <button
        class="inline-flex items-center justify-center bg-[#f266b3] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm"
        @click="openAddModal"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        Nueva interacción
      </button>
    </div>

    <!-- Table -->
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
                Cliente
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Tipo
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Descripción
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Fecha
              </th>

              <th class="px-6 py-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Usuario
              </th>

            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-gray-50">

            <tr
              v-for="interaccion in filteredInteracciones"
              :key="interaccion.id"
              class="hover:bg-gray-50/50 transition-colors"
            >

              <!-- ID -->
              <td class="px-6 py-4 text-sm font-medium text-gray-400">
                #{{ interaccion.id }}
              </td>

              <!-- Cliente -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ interaccion.cliente?.nombre }}
                </div>
              </td>

              <!-- Tipo -->
              <td class="px-6 py-4">

                <span
                  class="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight border uppercase"
                  :class="getTipoClasses(interaccion.tipo)"
                >
                  {{ interaccion.tipo }}
                </span>

              </td>

              <!-- Descripcion -->
              <td
                class="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate"
                :title="interaccion.descripcion"
              >
                {{ interaccion.descripcion }}
              </td>

              <!-- Fecha -->
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(interaccion.fecha) }}
              </td>

              <!-- Usuario -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-700">
                  {{ interaccion.usuario?.name }}
                </div>
              </td>

            </tr>

            <!-- Empty -->
            <tr v-if="filteredInteracciones.length === 0">
              <td
                colspan="6"
                class="px-6 py-12 text-sm text-gray-400 text-center italic"
              >
                No se encontraron interacciones.
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <!-- Modal -->
      <InteraccionesModal
        :isOpen="isOpen"
        @save="handleSaveInteraccion"
        @close="isOpen = false"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import * as InteraccionesService from '@/services/InteraccionesService'

import InteraccionesModal from './InteraccionesModal.vue'

const interacciones = ref([])

const isOpen = ref(false)

const search = ref('')

const currentTipo = ref(null)

const fetchInteracciones = async () => {
  try {

    interacciones.value = await InteraccionesService.getAll()

  } catch (error) {
    console.error('Error fetching interacciones:', error)
  }
}

const filteredInteracciones = computed(() => {

  return interacciones.value.filter((interaccion) => {

    const matchesTipo =
      !currentTipo.value ||
      interaccion.tipo === currentTipo.value

    const searchValue = search.value.toLowerCase()

    const matchesSearch =
      interaccion.cliente?.nombre
        ?.toLowerCase()
        .includes(searchValue) ||

      interaccion.usuario?.name
        ?.toLowerCase()
        .includes(searchValue)

    return matchesTipo && matchesSearch
  })
})

const toggleTipoFilter = () => {

  if (currentTipo.value === null) {
    currentTipo.value = 'llamada'
  }

  else if (currentTipo.value === 'llamada') {
    currentTipo.value = 'correo'
  }

  else if (currentTipo.value === 'correo') {
    currentTipo.value = 'reunion'
  }

  else {
    currentTipo.value = null
  }
}

const openAddModal = () => {
  isOpen.value = true
}

const handleSaveInteraccion = async (data) => {
  try {

    await InteraccionesService.create(data)

    await fetchInteracciones()

    isOpen.value = false

  } catch (error) {
    console.error('Error saving interaccion:', error)
  }
}

const getTipoClasses = (tipo) => {

  switch (tipo) {

    case 'llamada':
      return 'bg-blue-50 text-blue-500 border-blue-100'

    case 'correo':
      return 'bg-violet-50 text-violet-500 border-violet-100'

    case 'reunion':
      return 'bg-emerald-50 text-emerald-500 border-emerald-100'

    default:
      return 'bg-gray-50 text-gray-500 border-gray-100'
  }
}

const formatDate = (date) => {

  return new Date(date).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

onMounted(() => {
  fetchInteracciones()
})
</script>