<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4"
    >
        <div
            class="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200"
        >

            <!-- Header -->
            <div class="flex justify-between items-center p-8">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        Nueva Interacción
                    </h2>

                    <p class="text-xs text-gray-400 mt-1">
                        Registro de interacción con cliente.
                    </p>
                </div>

                <button
                    class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl"
                    @click="handleCancel"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="px-8 pb-8 overflow-y-auto flex-1">

                <form @submit.prevent="handleSubmit" class="space-y-6">

                    <!-- Cliente -->
                    <div class="flex flex-col gap-1.5">

                        <label
                            for="cliente"
                            class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5"
                        >
                            Cliente
                        </label>

                        <select
                            id="cliente"
                            v-model="formData.cliente_id"
                            class="w-full py-2 border-0 border-b border-gray-200 text-sm text-gray-800 focus:border-[#f266b3] transition-all outline-none bg-transparent"
                            required
                        >
                            <option :value="null" disabled>
                                Selecciona un cliente
                            </option>

                            <option
                                v-for="cliente in clientes"
                                :key="cliente.id"
                                :value="cliente.id"
                            >
                                {{ cliente.nombre }}
                            </option>

                        </select>
                    </div>

                    <!-- Tipo -->
                    <div class="flex flex-col gap-1.5">

                        <label
                            for="tipo"
                            class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5"
                        >
                            Tipo de interacción
                        </label>

                        <select
                            id="tipo"
                            v-model="formData.tipo"
                            class="w-full py-2 border-0 border-b border-gray-200 text-sm text-gray-800 focus:border-[#f266b3] transition-all outline-none bg-transparent"
                            required
                        >
                            <option value="llamada">
                                Llamada
                            </option>

                            <option value="correo">
                                Correo
                            </option>

                            <option value="reunion">
                                Reunión
                            </option>

                        </select>
                    </div>

                    <!-- Fecha -->
                    <div class="flex flex-col gap-1.5">

                        <label
                            for="fecha"
                            class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5"
                        >
                            Fecha y hora
                        </label>

                        <input
                            id="fecha"
                            v-model="formData.fecha"
                            type="datetime-local"
                            class="w-full py-2 border-0 border-b border-gray-200 text-sm text-gray-800 focus:border-[#f266b3] transition-all outline-none bg-transparent"
                            required
                        />
                    </div>

                    <!-- Descripción -->
                    <div class="flex flex-col gap-1.5">

                        <label
                            for="descripcion"
                            class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="descripcion"
                            v-model="formData.descripcion"
                            rows="4"
                            placeholder="Describe la interacción realizada..."
                            class="w-full py-2 border-0 border-b border-gray-200 text-sm text-gray-800 focus:border-[#f266b3] transition-all outline-none bg-transparent resize-none"
                            required
                        ></textarea>
                    </div>

                </form>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-8 bg-gray-50/50 rounded-b-2xl border-t border-gray-100">

                <button
                    class="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
                    @click="handleCancel"
                >
                    Cancelar
                </button>

                <button
                    class="px-6 py-2.5 bg-[#f266b3] text-white rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm"
                    @click="handleSubmit"
                >
                    Registrar Interacción
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import * as ClientesService from '@/services/ClientesService'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'close',
    'save'
])

const clientes = ref([])

const initialState = () => ({
    cliente_id: null,
    tipo: 'llamada',
    descripcion: '',
    fecha: '',
})

const formData = ref(initialState())

const fetchClientes = async () => {

    try {

        const data = await ClientesService.getAll()

        clientes.value = Array.isArray(data)
            ? data
            : (data.data || [])

    } catch (error) {

        console.error('Error fetching clientes:', error)
    }
}

watch(
    () => props.isOpen,
    async (isOpen) => {

        if (isOpen) {

            formData.value = initialState()

            await fetchClientes()
        }
    }
)

const handleCancel = () => {

    emit('close')
}

const handleSubmit = () => {

    emit('save', formData.value)
}
</script>