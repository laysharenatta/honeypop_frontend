<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">

      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
        <h2 class="text-lg font-bold text-gray-800">Cambiar Nivel ERP</h2>
        <button class="text-gray-400 hover:text-gray-600 transition-colors text-2xl" @click="emit('close')">&times;</button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-3">
        <p class="text-sm text-gray-500 mb-4">Selecciona el nuevo nivel de madurez digital de la empresa.</p>
        <div
          v-for="nivel in niveles"
          :key="nivel.value"
          class="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
          :class="selected === nivel.value
            ? 'border-[#f266b3] bg-pink-50'
            : 'border-gray-200 hover:border-gray-300'"
          @click="selected = nivel.value"
        >
          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="selected === nivel.value ? 'border-[#f266b3]' : 'border-gray-300'">
            <div v-if="selected === nivel.value" class="w-2 h-2 rounded-full bg-[#f266b3]"></div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ nivel.label }}</p>
            <p class="text-xs text-gray-500">{{ nivel.desc }}</p>
          </div>
        </div>
        <div v-if="errorMessage" class="mt-2 p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
        <button
          class="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          @click="emit('close')"
          :disabled="isSubmitting"
        >Cancelar</button>
        <button
          class="px-5 py-2.5 bg-[#f266b3] text-white rounded-lg text-sm font-semibold hover:bg-[#e055a0] shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          @click="handleSave"
          :disabled="isSubmitting || !selected"
        >
          <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin mr-2"></i>
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as ErpService from '@/services/ErpService'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  nivelActual: { type: String, default: '' }
})

const emit = defineEmits(['close', 'updated'])

const niveles = [
  { value: 'Básico',       label: 'Básico',       desc: 'Procesos manuales. Inicio de la digitalización.' },
  { value: 'Integrado',    label: 'Integrado',    desc: 'Sistemas conectados y datos compartidos.' },
  { value: 'Automatizado', label: 'Automatizado', desc: 'Flujos automáticos, menos intervención manual.' },
  { value: 'Optimizado',   label: 'Optimizado',   desc: 'ERP maduro basado en datos en tiempo real.' },
]

const selected = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

watch(() => props.isOpen, (val) => {
  if (val) {
    selected.value = props.nivelActual || ''
    errorMessage.value = ''
  }
})

const handleSave = async () => {
  if (!selected.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await ErpService.updateEstado({ nivel: selected.value })
    emit('updated', selected.value)
    emit('close')
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Error al actualizar el nivel ERP.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
