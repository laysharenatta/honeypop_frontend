<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
    <header class="mb-10 animate-fade-in">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Procesos Internos</p>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">Auditorías y procesos internos</h1>
      <p class="text-xs text-gray-400 mt-1">Información estática de seguimiento, auditoría y flujos internos.</p>
    </header>

    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8 animate-slide-up">
      <article class="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-indigo-700 uppercase tracking-widest mb-2">Auditoría de seguridad</h2>
        <p class="text-sm text-gray-600">Revisión mensual de accesos, permisos y control de cambios.</p>
        <ul class="mt-3 text-xs text-gray-500 space-y-1">
          <li>Estado: Completado</li>
          <li>Fecha: 2026-03-25</li>
          <li>Responsable: Equipo de Seguridad</li>
        </ul>
      </article>

      <article class="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-indigo-700 uppercase tracking-widest mb-2">Auditoría de inventario</h2>
        <p class="text-sm text-gray-600">Conteo y conciliación de almacén para activos operativos.</p>
        <ul class="mt-3 text-xs text-gray-500 space-y-1">
          <li>Estado: En proceso</li>
          <li>Fecha: 2026-03-28</li>
          <li>Responsable: Logística</li>
        </ul>
      </article>

      <article class="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-indigo-700 uppercase tracking-widest mb-2">Control de calidad</h2>
        <p class="text-sm text-gray-600">Revisión de procedimientos internos y métricas de KPI.</p>
        <ul class="mt-3 text-xs text-gray-500 space-y-1">
          <li>Estado: Pendiente</li>
          <li>Fecha: 2026-04-05</li>
          <li>Responsable: Procesos</li>
        </ul>
      </article>
    </section>

    <div class="animate-slide-up">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Resumen de procesos internos</h3>
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th class="px-4 py-3">Proceso</th>
              <th class="px-4 py-3">Área</th>
              <th class="px-4 py-3">Frecuencia</th>
              <th class="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr>
              <td class="px-4 py-3">Validación de órdenes</td>
              <td class="px-4 py-3">Operaciones</td>
              <td class="px-4 py-3">Diaria</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Activo</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">Inspección de seguridad</td>
              <td class="px-4 py-3">Seguridad</td>
              <td class="px-4 py-3">Mensual</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">En revisión</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">Revisión de proveedores</td>
              <td class="px-4 py-3">Compras</td>
              <td class="px-4 py-3">Trimestral</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Planificado</span></td>
            </tr>
            <tr>
              <td class="px-4 py-3">Actualización de inventario</td>
              <td class="px-4 py-3">Logística</td>
              <td class="px-4 py-3">Semanal</td>
              <td class="px-4 py-3"><span class="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Retrasado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vista estática de procesos internos.
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
