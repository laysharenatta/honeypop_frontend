<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        {{ modalTitle }}
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Completa la información del producto.</p>
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
                    <!-- Nombre -->
                    <div class="flex flex-col gap-1.5">
                        <label for="nombre" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Nombre del Producto</label>
                        <input
                            id="nombre"
                            v-model="formData.nombre"
                            type="text"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej. Jabón de Miel"
                            required
                        />
                    </div>

                    <!-- Descripción -->
                    <div class="flex flex-col gap-1.5">
                        <label for="descripcion" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Descripción</label>
                        <textarea
                            id="descripcion"
                            v-model="formData.descripcion"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent resize-none',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Descripción detallada..."
                            rows="2"
                        />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Categoría -->
                        <div class="flex flex-col gap-1.5">
                            <label for="categoria" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Categoría</label>
                            <input
                                id="categoria"
                                v-model="formData.categoria"
                                type="text"
                                :class="[
                                    'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                    isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                                ]"
                                :readonly="isViewMode"
                                placeholder="Ej. Cuidado personal"
                            />
                        </div>

                        <!-- Proveedor -->
                        <div class="flex flex-col gap-1.5">
                            <label for="proveedor_id" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Proveedor</label>
                            <select
                                id="proveedor_id"
                                v-model.number="formData.proveedor_id"
                                :class="[
                                    'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent appearance-none cursor-pointer',
                                    isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                                ]"
                                :disabled="isViewMode"
                            >
                                <option value="" disabled>Seleccionar...</option>
                                <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                                    {{ proveedor.nombre }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <!-- Stock Actual -->
                        <div class="flex flex-col gap-1.5">
                            <label for="stock_actual" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Stock Actual</label>
                            <input
                                id="stock_actual"
                                v-model.number="formData.stock_actual"
                                type="number"
                                :class="[
                                    'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                    isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                                ]"
                                :readonly="isViewMode"
                                placeholder="0"
                            />
                        </div>

                        <!-- Stock Mínimo -->
                        <div class="flex flex-col gap-1.5">
                            <label for="stock_minimo" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Stock Mínimo</label>
                            <input
                                id="stock_minimo"
                                v-model.number="formData.stock_minimo"
                                type="number"
                                :class="[
                                    'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                    isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                                ]"
                                :readonly="isViewMode"
                                placeholder="0"
                            />
                        </div>

                        <!-- Costo Unitario -->
                        <div class="flex flex-col gap-1.5">
                            <label for="costo_unitario" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Costo Unitario</label>
                            <div class="flex items-center">
                                <span class="text-sm text-gray-400 mr-1">$</span>
                                <input
                                    id="costo_unitario"
                                    v-model.number="formData.costo_unitario"
                                    type="number"
                                    step="0.01"
                                    :class="[
                                        'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                        isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                                    ]"
                                    :readonly="isViewMode"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Estrategia Logística -->
                    <div class="flex flex-col gap-3">
                        <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Estrategia Logística</label>
                        <div class="grid grid-cols-2 gap-3 p-1 rounded-xl bg-gray-50 border border-gray-100">
                            <label 
                                :class="[
                                    'relative flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none',
                                    formData.estrategia_logistica === 'PUSH' 
                                        ? 'bg-white text-[#f266b3] shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600',
                                    isViewMode ? 'cursor-not-allowed opacity-60' : ''
                                ]"
                            >
                                <input
                                    type="radio"
                                    v-model="formData.estrategia_logistica"
                                    value="PUSH"
                                    :disabled="isViewMode"
                                    class="sr-only"
                                />
                                <span class="flex items-center gap-2">
                                    <svg v-if="formData.estrategia_logistica === 'PUSH'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                    PUSH
                                </span>
                            </label>

                            <label 
                                :class="[
                                    'relative flex items-center justify-center py-2.5 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none',
                                    formData.estrategia_logistica === 'PULL' 
                                        ? 'bg-white text-[#f266b3] shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600',
                                    isViewMode ? 'cursor-not-allowed opacity-60' : ''
                                ]"
                            >
                                <input
                                    type="radio"
                                    v-model="formData.estrategia_logistica"
                                    value="PULL"
                                    :disabled="isViewMode"
                                    class="sr-only"
                                />
                                <span class="flex items-center gap-2">
                                    <svg v-if="formData.estrategia_logistica === 'PULL'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                    PULL
                                </span>
                            </label>
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
                    {{ isEditMode ? 'Guardar Cambios' : 'Crear Producto' }}
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