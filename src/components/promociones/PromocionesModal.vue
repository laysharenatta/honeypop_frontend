<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        {{ modalTitle }}
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Gestión de promociones y descuentos.</p>
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
                        <label for="nombre" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Nombre de la Promoción</label>
                        <input
                            id="nombre"
                            v-model="formData.nombre"
                            type="text"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej. Black Friday 2024"
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
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent resize-none',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Detalles de la promoción..."
                            rows="3"
                        ></textarea>
                    </div>

                    <!-- Tipo de Descuento -->
                    <div class="flex flex-col gap-1.5">
                        <label for="tipo_descuento" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Tipo de Descuento</label>
                        <select
                            id="tipo_descuento"
                            v-model="formData.tipo_descuento"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="" disabled>Selecciona un tipo...</option>
                            <option value="porcentaje">Porcentaje (%)</option>
                            <option value="fijo">Monto Fijo ($)</option>
                        </select>
                    </div>

                    <!-- Valor -->
                    <div class="flex flex-col gap-1.5">
                        <label for="valor" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Valor del Descuento</label>
                        <input
                            id="valor"
                            v-model.number="formData.valor"
                            type="number"
                            step="0.01"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <!-- Fecha Inicio -->
                    <div class="flex flex-col gap-1.5">
                        <label for="fecha_inicio" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Fecha de Inicio</label>
                        <input
                            id="fecha_inicio"
                            v-model="formData.fecha_inicio"
                            type="date"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            required
                        />
                    </div>

                    <!-- Fecha Fin -->
                    <div class="flex flex-col gap-1.5">
                        <label for="fecha_fin" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Fecha de Fin</label>
                        <input
                            id="fecha_fin"
                            v-model="formData.fecha_fin"
                            type="date"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            required
                        />
                    </div>

                    <!-- Estado -->
                    <div class="flex flex-col gap-1.5">
                        <label for="estado" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Estado</label>
                        <select
                            id="estado"
                            v-model="formData.estado"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="" disabled>Selecciona un estado...</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-100">
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
                    {{ isEditMode ? 'Guardar Cambios' : 'Crear Promoción' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: 'create',
    },
    promocion: {
        type: Object,
        default: () => ({
            nombre: '',
            descripcion: '',
            tipo_descuento: '',
            valor: 0,
            fecha_inicio: '',
            fecha_fin: '',
            estado: 'activo',
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.promocion })

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')
const modalTitle = computed(() => {
    const titles = {
        create: 'Crear Promoción',
        edit: 'Editar Promoción',
        view: 'Detalles de Promoción',
    }
    return titles[props.mode] || 'Promoción'
})

watch(() => props.promocion, (newVal) => {
    formData.value = { ...newVal }
})

const handleCancel = () => {
    emit('close')
}

const handleSubmit = () => {
    if (validateForm()) {
        emit('save', formData.value)
    }
}

const validateForm = () => {
    // Validación básica
    if (!formData.value.nombre || !formData.value.tipo_descuento || formData.value.valor === null || !formData.value.fecha_inicio || !formData.value.fecha_fin || !formData.value.estado) {
        console.warn('Por favor completa todos los campos requeridos')
        return false
    }
    
    // Validar que fecha_fin >= fecha_inicio
    if (new Date(formData.value.fecha_fin) < new Date(formData.value.fecha_inicio)) {
        console.warn('La fecha de fin debe ser posterior a la fecha de inicio')
        return false
    }

    return true
}
</script>
