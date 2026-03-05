<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                <h2 class="text-xl font-bold text-gray-800">
                    {{ modalTitle }}
                </h2>
                <button class="text-gray-400 hover:text-gray-600 transition-colors text-2xl" @click="handleCancel">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1">
                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <!-- Producto -->
                    <div>
                        <label for="producto_id" class="block text-sm font-semibold text-gray-700 mb-1">Producto:</label>
                        <select
                            id="producto_id"
                            v-model="formData.producto_id"
                            :class="['w-full px-4 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#f266b3] focus:border-transparent outline-none', isViewMode ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300']"
                            :disabled="isViewMode"
                            required
                        >
                            <option :value="null" disabled>Seleccione un producto</option>
                            <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                                {{ prod.nombre }} (Stock: {{ prod.stock_actual }})
                            </option>
                        </select>
                    </div>

                    <!-- Cantidad -->
                    <div>
                        <label for="cantidad" class="block text-sm font-semibold text-gray-700 mb-1">Cantidad:</label>
                        <input
                            id="cantidad"
                            v-model.number="formData.cantidad"
                            type="number"
                            min="1"
                            :class="['w-full px-4 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#f266b3] focus:border-transparent outline-none', isViewMode ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300']"
                            :readonly="isViewMode"
                            placeholder="Ingrese la cantidad"
                            required
                        />
                    </div>

                    <!-- Tipo -->
                    <div>
                        <label for="tipo" class="block text-sm font-semibold text-gray-700 mb-1">Tipo de Pedido:</label>
                        <select
                            id="tipo"
                            v-model="formData.tipo"
                            :class="['w-full px-4 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#f266b3] focus:border-transparent outline-none', isViewMode ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'border-gray-300']"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="reposicion">Reposición (Stock)</option>
                            <option value="venta">Venta (Cliente)</option>
                        </select>
                    </div>

                    <!-- Estado (Solo visible en View) -->
                    <div v-if="isViewMode">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Estado Actual:</label>
                        <div 
                          class="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium capitalize"
                        >
                          {{ formData.estado }}
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button 
                  class="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" 
                  @click="handleCancel"
                >
                    Cancelar
                </button>
                <button
                    v-if="!isViewMode"
                    class="px-5 py-2.5 bg-[#f266b3] text-white rounded-lg text-sm font-semibold hover:bg-[#e055a0] shadow-md hover:shadow-lg transition-all active:scale-95"
                    @click="handleSubmit"
                >
                    {{ isEditMode ? 'Actualizar' : 'Crear Pedido' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import * as ProductosService from '@/services/ProductosService'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: 'create',
    },
    pedido: {
        type: Object,
        default: () => ({
            producto_id: null,
            cantidad: 1,
            tipo: 'reposicion',
            estado: 'pendiente',
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.pedido })
const productos = ref([])

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() => {
    const titles = {
        create: 'Nuevo Pedido',
        edit: 'Editar Pedido',
        view: 'Detalles del Pedido',
    }
    return titles[props.mode] || 'Pedido'
})

const fetchProductos = async () => {
  try {
    productos.value = await ProductosService.getAll()
  } catch (error) {
    console.error('Error fetching productos for modal:', error)
  }
}

watch(() => props.pedido, (newVal) => {
    formData.value = { ...newVal }
})

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      fetchProductos()
    }
})

const handleSubmit = () => {
    if (!formData.value.producto_id) {
      alert('Por favor seleccione un producto')
      return
    }
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}

onMounted(() => {
  fetchProductos()
})
</script>
