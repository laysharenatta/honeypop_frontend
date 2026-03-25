<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
  >
    <div class="flex items-center gap-3 mb-1">
      <span class="text-xl">{{ icon }}</span>
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest">{{ label }}</p>
    </div>
    <p class="text-3xl font-semibold text-gray-800 ml-0.5">{{ formattedValue }}</p>
    <p v-if="subtitle" class="text-[10px] uppercase tracking-wider text-gray-400 mt-2 ml-0.5">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  icon: { type: String, default: '📊' },
  prefix: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.prefix + props.value.toLocaleString('es-MX', { minimumFractionDigits: props.prefix === '$' ? 2 : 0, maximumFractionDigits: props.prefix === '$' ? 2 : 0 })
  }
  return props.value
})
</script>
