<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-800">
                    {{ modalTitle }}
                </h2>
                <button class="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center" @click="handleCancel">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto flex-1">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <!-- Nombre -->
                    <div>
                        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                        <input
                            id="nombre"
                            v-model="formData.nombre"
                            type="text"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="Nombre del producto"
                            required
                        />
                    </div>

                    <!-- Descripción -->
                    <div>
                        <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                        <textarea
                            id="descripcion"
                            v-model="formData.descripcion"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="Descripción del producto"
                            rows="3"
                        />
                    </div>

                    <!-- Categoría -->
                    <div>
                        <label for="categoria" class="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
                        <input
                            id="categoria"
                            v-model="formData.categoria"
                            type="text"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="Categoría"
                        />
                    </div>

                    <!-- Stock Actual -->
                    <div>
                        <label for="stock_actual" class="block text-sm font-medium text-gray-700 mb-1">Stock Actual:</label>
                        <input
                            id="stock_actual"
                            v-model.number="formData.stock_actual"
                            type="number"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="0"
                        />
                    </div>

                    <!-- Stock Mínimo -->
                    <div>
                        <label for="stock_minimo" class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo:</label>
                        <input
                            id="stock_minimo"
                            v-model.number="formData.stock_minimo"
                            type="number"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="0"
                        />
                    </div>

                    <!-- Proveedor -->
                    <div>
                        <label for="proveedor_id" class="block text-sm font-medium text-gray-700 mb-1">Proveedor:</label>
                        <select
                            id="proveedor_id"
                            v-model.number="formData.proveedor_id"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :disabled="isViewMode"
                        >
                            <option value="">Selecciona un proveedor</option>
                            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                                {{ proveedor.nombre }}
                            </option>
                        </select>
                    </div>

                    <!-- Costo Unitario -->
                    <div>
                        <label for="costo_unitario" class="block text-sm font-medium text-gray-700 mb-1">Costo Unitario:</label>
                        <input
                            id="costo_unitario"
                            v-model.number="formData.costo_unitario"
                            type="number"
                            step="0.01"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="0.00"
                        />
                    </div>

                    <!-- Estrategia Logística -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Estrategia Logística:</label>
                        <div class="grid grid-cols-2 gap-2 p-1 border border-gray-200 rounded-lg bg-gray-100/50">
                            <label 
                                :class="[
                                    'relative flex items-center justify-center py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer select-none',
                                    formData.estrategia_logistica === 'PUSH' 
                                        ? 'bg-white text-[#f266b3] shadow-sm ring-1 ring-black/5' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50',
                                    isViewMode ? 'cursor-not-allowed opacity-70' : ''
                                ]"
                            >
                                <input
                                    type="radio"
                                    v-model="formData.estrategia_logistica"
                                    value="PUSH"
                                    :disabled="isViewMode"
                                    class="sr-only"
                                />
                                <span class="relative z-10 flex items-center gap-2">
                                    <svg v-if="formData.estrategia_logistica === 'PUSH'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    PUSH
                                </span>
                            </label>

                            <label 
                                :class="[
                                    'relative flex items-center justify-center py-2 px-4 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer select-none',
                                    formData.estrategia_logistica === 'PULL' 
                                        ? 'bg-white text-[#f266b3] shadow-sm ring-1 ring-black/5' 
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50',
                                    isViewMode ? 'cursor-not-allowed opacity-70' : ''
                                ]"
                            >
                                <input
                                    type="radio"
                                    v-model="formData.estrategia_logistica"
                                    value="PULL"
                                    :disabled="isViewMode"
                                    class="sr-only"
                                />
                                <span class="relative z-10 flex items-center gap-2">
                                    <svg v-if="formData.estrategia_logistica === 'PULL'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    PULL
                                </span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-2 p-6 border-t border-gray-200">
                <button class="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors" @click="handleCancel">
                    Cancelar
                </button>
                <button
                    v-if="!isViewMode"
                    class="px-4 py-2 bg-[#f266b3] text-white rounded-md text-sm font-medium hover:bg-[#e055a0] cursor-pointer transition-colors"
                    @click="handleSubmit"
                >
                    {{ isEditMode ? 'Actualizar' : 'Crear' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import * as ProveedoresService from '@/services/ProveedoresService'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        enum: ['create', 'edit', 'view'],
        default: 'create',
    },
    producto: {
        type: Object,
        default: () => ({
            nombre: '',
            descripcion: '',
            categoria: '',
            stock_actual: 0,
            stock_minimo: 0,
            proveedor_id: null,
            costo_unitario: 0,
            estrategia_logistica: 'PUSH',
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.producto })
const proveedores = ref([])

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')
const modalTitle = computed(() => {
    const titles = {
        create: 'Crear Producto',
        edit: 'Editar Producto',
        view: 'Ver Producto',
    }
    return titles[props.mode] || 'Producto'
})

watch(() => props.producto, (newVal) => {
    formData.value = { ...newVal }
})

const fetchProveedores = async () => {
    try {
        proveedores.value = await ProveedoresService.getAll()
    } catch (error) {
        console.error('Error al cargar proveedores:', error)
    }
}

const handleSubmit = () => {
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}

onMounted(() => {
    fetchProveedores()
})
</script>