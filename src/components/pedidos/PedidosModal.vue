<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        {{ modalTitle }}
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Gestión de orden de abastecimiento.</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl" @click="handleCancel">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="px-8 pb-8 overflow-y-auto flex-1">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Producto -->
                    <div class="flex flex-col gap-1.5">
                        <label for="producto_id" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Producto</label>
                        <select
                            id="producto_id"
                            v-model="formData.producto_id"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent appearance-none cursor-pointer',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :disabled="isViewMode"
                            required
                        >
                            <option :value="null" disabled>Seleccionar producto...</option>
                            <option v-for="prod in productos" :key="prod.id" :value="prod.id">
                                {{ prod.nombre }} (Stock: {{ prod.stock_actual }})
                            </option>
                        </select>
                    </div>

                    <!-- Cantidad -->
                    <div class="flex flex-col gap-1.5">
                        <label for="cantidad" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Cantidad</label>
                        <input
                            id="cantidad"
                            v-model.number="formData.cantidad"
                            type="number"
                            min="1"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="0"
                            required
                        />
                    </div>

                    <!-- Tipo -->
                    <div class="flex flex-col gap-1.5">
                        <label for="tipo" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Tipo de Pedido</label>
                        <select
                            id="tipo"
                            v-model="formData.tipo"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent appearance-none cursor-pointer',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="reposicion">Reposición (Stock)</option>
                            <option value="venta">Venta (Cliente)</option>
                        </select>
                    </div>

                    <!-- Estado (Solo visible en View) -->
                    <div v-if="isViewMode" class="flex flex-col gap-1.5">
                        <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Estado Actual</label>
                        <div 
                          class="py-2 border-0 border-b border-gray-100 text-sm text-gray-400 font-medium capitalize"
                        >
                          {{ formData.estado }}
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-8 bg-gray-50/50 rounded-b-2xl border-t border-gray-100">
                <button 
                  class="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider" 
                  @click="handleCancel"
                >
                    Cerrar
                </button>
                <button
                    v-if="!isViewMode"
                    class="px-6 py-2.5 bg-[#f266b3] text-white rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm"
                    @click="handleSubmit"
                >
                    {{ isEditMode ? 'Guardar Cambios' : 'Generar Pedido' }}
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
