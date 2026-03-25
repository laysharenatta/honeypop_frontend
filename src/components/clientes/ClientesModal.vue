<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        {{ modalTitle }}
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Gestión de datos del cliente corporativo.</p>
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
                        <label for="nombre" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Nombre de la Empresa</label>
                        <input
                            id="nombre"
                            v-model="formData.nombre"
                            type="text"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej. Honeypop Retail S.A."
                            required
                        />
                    </div>

                    <!-- Contacto -->
                    <div class="flex flex-col gap-1.5">
                        <label for="contacto" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Representante</label>
                        <input
                            id="contacto"
                            v-model="formData.contacto"
                            type="text"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="Ej. Ana García"
                        />
                    </div>

                    <!-- Teléfono -->
                    <div class="flex flex-col gap-1.5">
                        <label for="telefono" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Teléfono de Contacto</label>
                        <input
                            id="telefono"
                            v-model="formData.telefono"
                            type="tel"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="+52 --- --- ----"
                        />
                    </div>

                    <!-- Correo -->
                    <div class="flex flex-col gap-1.5">
                        <label for="correo" class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Email Corporativo</label>
                        <input
                            id="correo"
                            v-model="formData.correo"
                            type="email"
                            :class="[
                                'w-full py-2 border-0 border-b text-sm transition-all outline-none bg-transparent',
                                isViewMode ? 'border-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-800 focus:border-[#f266b3]'
                            ]"
                            :readonly="isViewMode"
                            placeholder="contacto@empresa.com"
                        />
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
                    {{ isEditMode ? 'Guardar Cambios' : 'Registrar Cliente' }}
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
    cliente: {
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

const formData = ref({ ...props.cliente })

const isViewMode = computed(() => props.mode === 'view')
const isEditMode = computed(() => props.mode === 'edit')
const modalTitle = computed(() => {
    const titles = {
        create: 'Añadir Cliente',
        edit: 'Editar Cliente',
        view: 'Detalles del Cliente',
    }
    return titles[props.mode] || 'Cliente'
})

watch(() => props.cliente, (newVal) => {
    formData.value = { ...newVal }
})

const handleSubmit = () => {
    emit('save', formData.value)
}

const handleCancel = () => {
    emit('close')
}
</script>
