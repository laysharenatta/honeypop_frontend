<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-200 p-6 md:p-10">
    <header class="mb-10 text-center animate-fade-in">
      <h1 class="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
        <span class="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
          Dashboard Administrativo
        </span>
      </h1>
      <p class="text-lg text-slate-500 font-medium">Visualización de métricas clave y reportes</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-slate-600 font-semibold animate-pulse">Obteniendo datos del sistema...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
      <!-- Productos Más Vendidos -->
      <section class="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800">🚀 Productos Más Vendidos</h2>
          <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">VENTAS TOP</span>
        </div>
        <div class="h-[300px]">
          <Bar v-if="masVendidosData.labels.length" :data="masVendidosData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 italic">No hay datos de ventas</div>
        </div>
      </section>

      <!-- Distribución de Estrategias -->
      <section class="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800">📊 Estrategias de Reposición</h2>
          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">PUSH vs PULL</span>
        </div>
        <div class="h-[300px] flex justify-center">
          <Doughnut v-if="estrategiasData.labels.length" :data="estrategiasData" :options="doughnutOptions" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 italic">No hay datos de estrategias</div>
        </div>
      </section>

      <!-- Inventario Crítico -->
      <section class="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800">⚠️ Inventario Crítico</h2>
          <span class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">STOCK BAJO</span>
        </div>
        <div class="h-[300px]">
          <Bar v-if="inventarioCriticoData.labels.length" :data="inventarioCriticoData" :options="chartOptionsHorizontal" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 italic">Todo el stock está niveles normales</div>
        </div>
      </section>

      <!-- Rotación Lenta -->
      <section class="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white leading-tight">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-800">📦 Rotación Lenta</h2>
          <span class="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">SIN MOVIMIENTO</span>
        </div>
        <div class="overflow-hidden">
          <ul v-if="rotacionLenta.length" class="space-y-4">
            <li v-for="item in rotacionLenta.slice(0, 5)" :key="item.id" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span class="font-semibold text-slate-700">{{ item.nombre }}</span>
              <span class="text-xs font-medium text-slate-400">Stock: {{ item.stock_actual }}</span>
            </li>
          </ul>
          <div v-else class="h-[300px] flex items-center justify-center text-slate-400 italic">No hay productos de rotación lenta</div>
          <p v-if="rotacionLenta.length > 5" class="mt-4 text-center text-sm text-slate-500">+ {{ rotacionLenta.length - 5 }} productos más con baja rotación</p>
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
