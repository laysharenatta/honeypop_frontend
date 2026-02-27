<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-sm flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800">
                    Confirmar eliminación
                </h2>
                <button class="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center" @click="handleCancel">&times;</button>
            </div>

            <!-- Body -->
            <div class="p-6">
                <p class="text-gray-700">
                    {{ message }}
                </p>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-2 p-6 border-t border-gray-200">
                <button class="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors" @click="handleCancel">
                    Cancelar
                </button>
                <button class="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors" @click="handleConfirm">
                    Eliminar
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
