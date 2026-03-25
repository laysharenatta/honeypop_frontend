<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-[100] p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="flex justify-between items-center p-8 pb-4">
                <h2 class="text-xl font-semibold text-gray-900 tracking-tight">
                    Confirmar Acción
                </h2>
                <button class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl" @click="handleCancel">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="px-8 py-4">
                <p class="text-sm text-gray-500 leading-relaxed">
                    {{ message }}
                </p>
            </div>

            <!-- Footer -->
            <div class="flex flex-col gap-2 p-8 pt-6">
                <button 
                    class="w-full py-3.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 shadow-sm transition-all active:scale-95" 
                    @click="handleConfirm"
                >
                    Sí, eliminar registro
                </button>
                <button 
                    class="w-full py-3.5 bg-gray-50 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px]" 
                    @click="handleCancel"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: '¿Estás seguro que deseas eliminar este registro? Esta acción no se puede deshacer.',
    },
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
    emit('confirm')
}

const handleCancel = () => {
    emit('cancel')
}
</script>
