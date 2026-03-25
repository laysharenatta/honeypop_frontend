<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full flex flex-col justify-center">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-sm font-semibold text-gray-800 tracking-tight">Nivel de Madurez ERP</h3>
        <p class="text-xs text-gray-400 mt-0.5">Estado actual de la adopción del sistema</p>
      </div>
      <span class="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg" :class="nivelConfig.badge">
        {{ estado.nivel || 'Cargando...' }}
      </span>
    </div>

    <!-- Barra de progreso -->
    <div class="mb-6">
      <div class="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
        <span>Básico</span>
        <span>Optimizado</span>
      </div>
      <div class="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden border border-gray-100">
        <div
          class="h-full rounded-full transition-all duration-1000 ease-in-out"
          :class="nivelConfig.bar"
          :style="{ width: nivelConfig.pct + '%' }"
        ></div>
      </div>
      <p class="text-xs text-gray-500 mt-3 italic leading-relaxed text-center">{{ nivelConfig.desc }}</p>
    </div>

    <!-- Etapas visuales -->
    <div class="grid grid-cols-4 gap-2 mt-2">
      <div
        v-for="(etapa, i) in etapas"
        :key="etapa"
        class="flex flex-col items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300"
          :class="i <= nivelConfig.index
            ? 'bg-pink-50 text-[#f266b3] border border-pink-100 shadow-sm'
            : 'bg-white border border-gray-100 text-gray-300'"
        >
          {{ i + 1 }}
        </div>
        <span class="text-[10px] font-medium text-gray-400 text-center leading-tight">{{ etapa }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as ErpService from '@/services/ErpService'

const estado = ref({ nivel: null })

const etapas = ['Básico', 'Integrado', 'Automatizado', 'Optimizado']

const CONFIG = {
  'Básico':       { index: 0, pct: 25,  bar: 'bg-red-400',    badge: 'bg-red-100 text-red-700',    desc: 'Procesos manuales. Poca digitalización.' },
  'Integrado':    { index: 1, pct: 50,  bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', desc: 'Sistemas conectados. Datos compartidos.' },
  'Automatizado': { index: 2, pct: 75,  bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700',  desc: 'Flujos automáticos. Menos intervención manual.' },
  'Optimizado':   { index: 3, pct: 100, bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700', desc: 'ERP maduro. Decisiones basadas en datos.' },
}

const nivelConfig = computed(() => CONFIG[estado.value.nivel] || { index: -1, pct: 0, bar: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500', desc: '' })

onMounted(async () => {
  try {
    estado.value = await ErpService.getEstado()
  } catch (e) {
    console.error('Error al obtener estado ERP:', e)
  }
})

defineExpose({ estado })
</script>
