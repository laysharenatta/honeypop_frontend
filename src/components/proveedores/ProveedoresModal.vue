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
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500']"
                            :readonly="isViewMode"
                            placeholder="Nombre del proveedor"
                            required
                        />
                    </div>

                    <!-- Contacto -->
                    <div>
                        <label for="contacto" class="block text-sm font-medium text-gray-700 mb-1">Contacto:</label>
                        <input
                            id="contacto"
                            v-model="formData.contacto"
                            type="text"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500']"
                            :readonly="isViewMode"
                            placeholder="Nombre del contacto"
                        />
                    </div>

                    <!-- Teléfono -->
                    <div>
                        <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono:</label>
                        <input
                            id="telefono"
                            v-model="formData.telefono"
                            type="tel"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500']"
                            :readonly="isViewMode"
                            placeholder="Número de teléfono"
                        />
                    </div>

                    <!-- Correo -->
                    <div>
                        <label for="correo" class="block text-sm font-medium text-gray-700 mb-1">Correo:</label>
                        <input
                            id="correo"
                            v-model="formData.correo"
                            type="email"
                            :class="['w-full px-3 py-2 border rounded-md text-sm transition-colors', isViewMode ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500']"
                            :readonly="isViewMode"
                            placeholder="correo@ejemplo.com"
                        />
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
        enum: ['create', 'edit', 'view'],
        default: 'create',
    },
    proveedor: {
        type: Object,
        default: () => ({
            nombre: '',
            contacto: '',
            telefono: '',
            correo: '',
        }),
    },
})

const emit = defineEmits(['close', 'save'])

const formData = ref({ ...props.proveedor })

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')
const modalTitle = computed(() => {
    const titles = {
        create: 'Crear Proveedor',
        edit: 'Editar Proveedor',
        view: 'Ver Proveedor',
    }
    return titles[props.mode] || 'Proveedor'
})

watch(() => props.proveedor, (newVal) => {
    formData.value = { ...newVal }
})

const handleSubmit = () => {
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}
</script>