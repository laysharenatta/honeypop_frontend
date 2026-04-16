<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Recursos</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Inventario de recursos</h1>
      <p class="text-xs text-gray-400 mt-1">Listado estático de equipos y dispositivos asignados a departamentos.</p>
    </header>

    <div class="animate-slide-up">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Recurso</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3">Departamento</th>
              <th class="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="px-4 py-3">R-001</td>
              <td class="px-4 py-3">Laptop Dell Latitude 5410</td>
              <td class="px-4 py-3">Computadora</td>
              <td class="px-4 py-3">Ventas</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">En uso</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">R-002</td>
              <td class="px-4 py-3">Desktop HP ProDesk 600</td>
              <td class="px-4 py-3">Computadora</td>
              <td class="px-4 py-3">Administración</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Disponible</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">R-003</td>
              <td class="px-4 py-3">Impresora Brother HL-L2370DW</td>
              <td class="px-4 py-3">Impresora</td>
              <td class="px-4 py-3">Logística</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">En uso</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">R-004</td>
              <td class="px-4 py-3">Router Cisco RV340</td>
              <td class="px-4 py-3">Red</td>
              <td class="px-4 py-3">TI</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">En uso</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">R-005</td>
              <td class="px-4 py-3">Monitor LG 24''</td>
              <td class="px-4 py-3">Monitor</td>
              <td class="px-4 py-3">Soporte</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Mantenimiento</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vista estática de recursos.
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
