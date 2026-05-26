<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        {{ modalTitle }}
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Gestión de impuestos.</p>
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
                        <label for="nombre" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Nombre del Impuesto</label>
                        <input
                            id="nombre"
                            v-model="formData.nombre"
                            type="text"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej: IVA"
                            required
                        />
                    </div>

                    <!-- Código -->
                    <div class="flex flex-col gap-1.5">
                        <label for="codigo" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Código</label>
                        <input
                            id="codigo"
                            v-model="formData.codigo"
                            type="text"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej: IVA19"
                            required
                        />
                    </div>

                    <!-- Porcentaje -->
                    <div class="flex flex-col gap-1.5">
                        <label for="porcentaje" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Porcentaje (%)</label>
                        <input
                            id="porcentaje"
                            v-model.number="formData.porcentaje"
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            :class="[
                                'w-full px-1 py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="0.00"
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
                            placeholder="Descripción del impuesto..."
                            rows="3"
                        />
                    </div>

                    <!-- Activo -->
                    <div v-if="!isViewMode" class="flex items-center gap-3">
                        <input
                            id="activo"
                            v-model="formData.activo"
                            type="checkbox"
                            class="w-4 h-4 rounded border-gray-300 text-[#f266b3] focus:ring-[#f266b3]"
                        />
                        <label for="activo" class="text-sm font-medium text-gray-600 cursor-pointer">
                            Activo
                        </label>
                    </div>
                    <div v-else class="flex items-center gap-3">
                        <span 
                            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border"
                            :class="formData.activo 
                                ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                                : 'bg-red-50 text-red-500 border-red-100'"
                        >
                            <span class="w-1.5 h-1.5 rounded-full" :class="formData.activo ? 'bg-emerald-400' : 'bg-red-400'"></span>
                            {{ formData.activo ? 'Activo' : 'Inactivo' }}
                        </span>
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
                    {{ isEditMode ? 'Guardar Cambios' : 'Crear Impuesto' }}
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
    impuesto: {
        type: Object,
        default: () => ({
            nombre: '',
            codigo: '',
            porcentaje: 0,
            descripcion: '',
            activo: true,
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.impuesto })

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() => {
    const titles = {
        create: 'Nuevo Impuesto',
        edit: 'Editar Impuesto',
        view: 'Detalles del Impuesto',
    }
    return titles[props.mode] || 'Impuesto'
})

watch(() => props.impuesto, (newVal) => {
    formData.value = { ...newVal }
})

const handleSubmit = () => {
    if (!formData.value.nombre || !formData.value.codigo) {
        alert('Por favor complete los campos requeridos')
        return
    }
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}
</script>
