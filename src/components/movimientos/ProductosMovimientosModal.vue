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

                    <!-- Tipo -->
                    <div>
                        <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                        <select
                            id="tipo"
                            v-model="formData.tipo"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </select>
                    </div>

                    <!-- Cantidad -->
                    <div>
                        <label for="cantidad" class="block text-sm font-medium text-gray-700 mb-1">Cantidad:</label>
                        <input
                            id="cantidad"
                            v-model.number="formData.cantidad"
                            type="number"
                            min="1"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :readonly="isViewMode"
                            placeholder="0"
                            required
                        />
                    </div>

                    <!-- Motivo -->
                    <div>
                        <label for="motivo" class="block text-sm font-medium text-gray-700 mb-1">Motivo:</label>
                        <select
                            id="motivo"
                            v-model="formData.motivo"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f266b3]']"
                            :disabled="isViewMode"
                            required
                        >
                            <option value="">Selecciona un motivo</option>
                            <option value="venta">Venta</option>
                            <option value="reposición">Reposición</option>
                            <option value="ajuste">Ajuste</option>
                        </select>
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
    movimiento: {
        type: Object,
        default: () => ({
            tipo: '',
            cantidad: 0,
            motivo: '',
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.movimiento })

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')
const modalTitle = computed(() => {
    const titles = {
        create: 'Registrar Movimiento',
        edit: 'Editar Movimiento',
        view: 'Ver Movimiento',
    }
    return titles[props.mode] || 'Movimiento'
})

watch(() => props.movimiento, (newVal) => {
    formData.value = { ...newVal }
})

const handleSubmit = () => {
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}
</script>
