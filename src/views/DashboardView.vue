<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Visión General</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard Empresarial</h1>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-8 h-8 border-2 border-[#f266b3] border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-sm text-gray-400">Obteniendo métricas...</p>
    </div>

    <div v-else class="space-y-8 animate-slide-up">

      <!-- Indicador ERP + Estado de Inventario -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <ErpLevelIndicator ref="erpIndicatorRef" />
        </div>
        <div class="space-y-6">
          <!-- Gestión del Sistema -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 tracking-tight mb-2">Gestión del Sistema</h3>
              <p class="text-xs text-gray-400 leading-relaxed">Actualiza el nivel de madurez digital de tu empresa según el avance en la adopción del sistema.</p>
            </div>
            <div class="mt-6">
              <button
                v-if="rol === 'administrador'"
                class="w-full px-4 py-2.5 bg-[#f266b3] text-white rounded-xl text-sm font-medium hover:bg-[#e04fa0] transition-colors shadow-sm"
                @click="isErpSelectorOpen = true"
              >
                Cambiar Nivel ERP
              </button>
              <p v-else class="text-[10px] italic text-gray-300">Solo administradores pueden cambiar el nivel ERP.</p>
            </div>
          </div>

          <!-- Indicador Operativo de Inventario -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 class="text-sm font-semibold text-gray-800 tracking-tight mb-4 text-center uppercase tracking-widest">Nivel de Inventario</h3>
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-full py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors border"
                :class="isInventoryCritical ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'"
              >
                <span class="text-2xl">{{ isInventoryCritical ? '⚠️' : '✅' }}</span>
                <span class="text-sm font-bold uppercase tracking-wider">{{ isInventoryCritical ? 'Crítico' : 'Adecuado' }}</span>
              </div>
              <p class="text-[10px] text-gray-400 text-center mt-2">
                {{ isInventoryCritical
                   ? 'Se han detectado productos con stock bajo que requieren reposición inmediata.'
                   : 'Todos los niveles de stock se encuentran dentro de los parámetros normales.'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          label="Ventas Totales"
          :value="metricas.ventas_totales"
          icon="💰"
          prefix="$"
          subtitle="Monto acumulado"
        />
        <KPICard
          label="Órdenes Procesadas"
          :value="metricas.ordenes_procesadas"
          icon="📦"
          subtitle="Órdenes completadas"
        />
        <KPICard
          label="Productos Vendidos"
          :value="metricas.productos_vendidos"
          icon="🛒"
          subtitle="Unidades totales"
        />
        <KPICard
          label="Clientes Activos"
          :value="metricas.clientes_activos"
          icon="🏢"
          subtitle="Empresas activas"
        />
        <KPICard
          label="Inventario"
          :value="metricas.inventario_disponible"
          icon="🏭"
          subtitle="Unidades disponibles"
        />
      </div>

      <!-- Gráficas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Productos Más Vendidos -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-sm font-semibold text-gray-800 mb-6">Tendencia de Productos</h3>
          <div class="h-[300px]">
            <Bar v-if="masVendidosData.labels.length" :data="masVendidosData" :options="chartOptions" />
            <div v-else class="h-full flex items-center justify-center text-sm text-gray-300 italic">Cargando datos de ventas...</div>
          </div>
        </div>

        <!-- Inventario Crítico -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-sm font-semibold text-gray-800 mb-6">Estado de Inventario</h3>
          <div class="h-[300px]">
            <Bar v-if="inventarioCriticoData.labels.length" :data="inventarioCriticoData" :options="chartOptionsHorizontal" />
            <div v-else class="h-full flex items-center justify-center text-sm text-gray-300 italic">Todo el stock está en niveles adecuados.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Selector ERP -->
    <ErpLevelSelector
      :isOpen="isErpSelectorOpen"
      :nivelActual="nivelActual"
      @close="isErpSelectorOpen = false"
      @updated="handleErpUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as ErpService from '@/services/ErpService'
import * as ReportesService from '@/services/ReportesService'
import ErpLevelIndicator from '@/components/erp/ErpLevelIndicator.vue'
import ErpLevelSelector from '@/components/erp/ErpLevelSelector.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { rol } = useAuth()

const loading = ref(true)
const isErpSelectorOpen = ref(false)
const nivelActual = ref('')
const erpIndicatorRef = ref(null)
const isInventoryCritical = ref(false)

const metricas = ref({
  ventas_totales: 0,
  ordenes_procesadas: 0,
  productos_vendidos: 0,
  clientes_activos: 0,
  inventario_disponible: 0,
})

// Gráficas
const masVendidosData = reactive({
  labels: [],
  datasets: [{
    label: 'Unidades Vendidas',
    backgroundColor: '#f266b3',
    borderRadius: 8,
    data: []
  }]
})

const inventarioCriticoData = reactive({
  labels: [],
  datasets: [{
    label: 'Stock Actual',
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    data: []
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { display: false } },
    x: { grid: { display: false } }
  }
}

const chartOptionsHorizontal = { ...chartOptions, indexAxis: 'y' }

const handleErpUpdated = (nuevoNivel) => {
  nivelActual.value = nuevoNivel
  if (erpIndicatorRef.value) {
    erpIndicatorRef.value.estado.nivel = nuevoNivel
  }
}

onMounted(async () => {
  try {
    const [metricasData, estadoData, masVendidos, critico] = await Promise.all([
      ErpService.getMetricas(),
      ErpService.getEstado(),
      ReportesService.getProductosMasVendidos(),
      ReportesService.getInventarioCritico()
    ])

    metricas.value = metricasData
    nivelActual.value = estadoData.nivel

    // Procesar mas vendidos
    const masVendidosArray = Array.isArray(masVendidos) ? masVendidos : (masVendidos?.data || [])
    if (masVendidosArray.length) {
      masVendidosData.labels = masVendidosArray.map(p => p.nombre.substring(0, 15))
      masVendidosData.datasets[0].data = masVendidosArray.map(p => p.total_vendido || 0)
    }

    // Procesar inventario crítico
    const criticoArray = Array.isArray(critico) ? critico : (critico?.data || [])
    if (criticoArray.length) {
      inventarioCriticoData.labels = criticoArray.map(p => p.nombre.substring(0, 15))
      inventarioCriticoData.datasets[0].data = criticoArray.map(p => p.stock_actual || p.stock)
      isInventoryCritical.value = true
    } else {
      isInventoryCritical.value = false
    }

  } catch (e) {
    console.error('Error cargando datos del Dashboard:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.7s ease-out both;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
