<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">

    <!-- Header -->
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Panel de control</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-8 h-8 border-2 border-[#f266b3] border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-sm text-gray-400">Obteniendo datos del sistema...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">

      <!-- Productos Más Vendidos -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Productos Más Vendidos</h2>
            <p class="text-xs text-gray-400 mt-0.5">Unidades vendidas por producto</p>
          </div>
          <span class="px-2.5 py-1 bg-pink-50 text-[#f266b3] text-xs font-medium rounded-lg">Top ventas</span>
        </div>
        <div class="h-[280px]">
          <Bar v-if="masVendidosData.labels.length" :data="masVendidosData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center text-sm text-gray-300 italic">Sin datos de ventas</div>
        </div>
      </section>

      <!-- Distribución de Estrategias -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Estrategias de Reposición</h2>
            <p class="text-xs text-gray-400 mt-0.5">Distribución PUSH vs PULL</p>
          </div>
          <span class="px-2.5 py-1 bg-purple-50 text-purple-500 text-xs font-medium rounded-lg">Logística</span>
        </div>
        <div class="h-[280px] flex justify-center">
          <Doughnut v-if="estrategiasData.labels.length" :data="estrategiasData" :options="doughnutOptions" />
          <div v-else class="h-full flex items-center justify-center text-sm text-gray-300 italic">Sin datos de estrategias</div>
        </div>
      </section>

      <!-- Inventario Crítico -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Inventario Crítico</h2>
            <p class="text-xs text-gray-400 mt-0.5">Productos con stock bajo</p>
          </div>
          <span class="px-2.5 py-1 bg-amber-50 text-amber-500 text-xs font-medium rounded-lg">Stock bajo</span>
        </div>
        <div class="h-[280px]">
          <Bar v-if="inventarioCriticoData.labels.length" :data="inventarioCriticoData" :options="chartOptionsHorizontal" />
          <div v-else class="h-full flex items-center justify-center text-sm text-gray-300 italic">Todo el stock en niveles normales</div>
        </div>
      </section>

      <!-- Rotación Lenta -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Rotación Lenta</h2>
            <p class="text-xs text-gray-400 mt-0.5">Productos sin movimiento reciente</p>
          </div>
          <span class="px-2.5 py-1 bg-rose-50 text-rose-400 text-xs font-medium rounded-lg">Sin movimiento</span>
        </div>
        <div class="overflow-hidden">
          <ul v-if="rotacionLenta.length" class="space-y-2">
            <li
              v-for="item in rotacionLenta.slice(0, 5)"
              :key="item.id"
              class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
            >
              <span class="text-sm font-medium text-gray-700">{{ item.nombre }}</span>
              <span class="text-xs text-gray-400">Stock: {{ item.stock_actual }}</span>
            </li>
          </ul>
          <div v-else class="h-[280px] flex items-center justify-center text-sm text-gray-300 italic">Sin productos de rotación lenta</div>
          <p v-if="rotacionLenta.length > 5" class="mt-4 text-center text-xs text-gray-400">+ {{ rotacionLenta.length - 5 }} productos más</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';
import * as ReportesService from '@/services/ReportesService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const loading = ref(true);

const masVendidosData = reactive({
  labels: [],
  datasets: [{
    label: 'Unidades Vendidas',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    data: []
  }]
});

const inventarioCriticoData = reactive({
  labels: [],
  datasets: [{
    label: 'Stock Actual',
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    data: []
  }]
});

const estrategiasData = reactive({
  labels: ['PUSH', 'PULL'],
  datasets: [{
    backgroundColor: ['#6366f1', '#ec4899'],
    data: [0, 0]
  }]
});

const rotacionLenta = ref([]);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false }
    },
    x: {
      grid: { display: false }
    }
  }
};

const chartOptionsHorizontal = {
  ...chartOptions,
  indexAxis: 'y'
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  },
  cutout: '70%'
};

onMounted(async () => {
  console.log('HomeView mounted, fetching reports...');
  try {
    const [masVendidos, critico, lenta, estrategias] = await Promise.all([
      ReportesService.getProductosMasVendidos(),
      ReportesService.getInventarioCritico(),
      ReportesService.getRotacionLenta(),
      ReportesService.getConteoEstrategias()
    ]);

    console.log('Reports received:', { masVendidos, critico, lenta, estrategias });

    // Procesar mas vendidos (Esperado: Array de productos)
    const masVendidosArray = Array.isArray(masVendidos) ? masVendidos : (masVendidos?.data || []);
    if (masVendidosArray.length) {
      masVendidosData.labels = masVendidosArray.map(p => p.nombre);
      masVendidosData.datasets[0].data = masVendidosArray.map(p => p.total_vendido || 0);
    }

    // Procesar inventario crítico (Propiedad: stock_actual)
    const criticoArray = Array.isArray(critico) ? critico : (critico?.data || []);
    if (criticoArray.length) {
      inventarioCriticoData.labels = criticoArray.map(p => p.nombre);
      inventarioCriticoData.datasets[0].data = criticoArray.map(p => p.stock_actual || p.stock);
    }

    // Procesar rotación lenta (Propiedad: stock_actual)
    rotacionLenta.value = Array.isArray(lenta) ? lenta : (lenta?.data || []);

    // Procesar estrategias (Esperado: Array de { estrategia_logistica, total })
    const estrategiasArray = Array.isArray(estrategias) ? estrategias : (estrategias?.data || []);
    if (estrategiasArray.length) {
      const pushData = estrategiasArray.find(e => e.estrategia_logistica === 'PUSH')?.total || 0;
      const pullData = estrategiasArray.find(e => e.estrategia_logistica === 'PULL')?.total || 0;
      estrategiasData.datasets[0].data = [pushData, pullData];
    }
  } catch (error) {
    console.error('Error cargando reportes en HomeView:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
