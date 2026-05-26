<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4"
    >
        <div
            class="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200"
        >

            <!-- Header -->
            <div class="flex justify-between items-center p-8 border-b border-gray-100">

                <div>
                    <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                        Historial de Interacciones
                    </h2>

                    <p class="text-xs text-gray-400 mt-1">
                        Seguimiento de actividades realizadas con el cliente.
                    </p>
                </div>

                <button
                    class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl"
                    @click="handleClose"
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
            <div class="overflow-y-auto flex-1">

                <!-- Loading -->
                <div
                    v-if="loading"
                    class="p-10 text-center text-sm text-gray-400"
                >
                    Cargando interacciones...
                </div>

                <!-- Empty -->
                <div
                    v-else-if="interacciones.length === 0"
                    class="p-10 text-center text-sm text-gray-400 italic"
                >
                    Este cliente no tiene interacciones registradas.
                </div>

                <!-- List -->
                <div
                    v-else
                    class="divide-y divide-gray-100"
                >

                    <div
                        v-for="interaccion in interacciones"
                        :key="interaccion.id"
                        class="p-6 hover:bg-gray-50/50 transition-colors"
                    >

                        <div class="flex items-start justify-between gap-4">

                            <div class="flex-1">

                                <!-- Tipo + Fecha -->
                                <div class="flex items-center gap-2 mb-3">

                                    <span
                                        class="px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase border"
                                        :class="getTipoClass(interaccion.tipo)"
                                    >
                                        {{ interaccion.tipo }}
                                    </span>

                                    <span class="text-xs text-gray-400">
                                        {{ formatDate(interaccion.fecha) }}
                                    </span>
                                </div>

                                <!-- Descripción -->
                                <p class="text-sm text-gray-700 leading-relaxed">
                                    {{ interaccion.descripcion }}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">

                <button
                    class="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
                    @click="handleClose"
                >
                    Cerrar
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import * as InteraccionesService from '@/services/InteraccionesService'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },

    clienteId: {
        type: Number,
        default: null,
    },
})

const emit = defineEmits([
    'close'
])

const interacciones = ref([])

const loading = ref(false)

watch(
    () => props.isOpen,
    async (isOpen) => {

        if (isOpen && props.clienteId) {

            await fetchHistorial()
        }
    }
)

const fetchHistorial = async () => {

    try {

        loading.value = true

        const response = await InteraccionesService.getHistorialByCliente(
            props.clienteId
        )

        interacciones.value = response.interacciones || []

    } catch (error) {

        console.error(
            'Error fetching historial:',
            error
        )

    } finally {

        loading.value = false
    }
}

const handleClose = () => {

    emit('close')
}

const formatDate = (date) => {

    return new Date(date).toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

const getTipoClass = (tipo) => {

    switch (tipo) {

        case 'llamada':
            return 'bg-blue-50 text-blue-500 border-blue-100'

        case 'correo':
            return 'bg-emerald-50 text-emerald-500 border-emerald-100'

        case 'reunion':
            return 'bg-purple-50 text-purple-500 border-purple-100'

        default:
            return 'bg-gray-50 text-gray-500 border-gray-100'
    }
}
</script>