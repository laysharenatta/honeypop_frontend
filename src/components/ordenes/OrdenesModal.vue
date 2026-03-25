<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-200">
      <!-- Header -->
      <div class="flex justify-between items-center p-8">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 tracking-tight">Nueva Orden Empresarial</h2>
          <p class="text-xs text-gray-400 mt-1">Registra una nueva venta corporativa.</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-xl" @click="handleCancel">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-8 pb-4 overflow-y-auto flex-1">
        <div v-if="errorMessage" class="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-medium border border-rose-100 animate-in slide-in-from-top-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errorMessage }}
            </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Cliente</label>
              <select
                v-model="form.cliente_id"
                class="w-full py-2 border-0 border-b border-gray-200 text-sm transition-all outline-none bg-transparent appearance-none cursor-pointer focus:border-[#f266b3] text-gray-800"
                required
              >
                <option value="" disabled>Seleccionar cliente...</option>
                <option v-for="cliente in getClientArray(clientes)" :key="cliente.id" :value="cliente.id">
                  {{ cliente.nombre || cliente.name || cliente.razon_social || `Cliente #${cliente.id}` }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-0.5">Agente Responsable</label>
              <input
                type="text"
                :value="user?.name"
                disabled
                class="w-full py-2 border-0 border-b border-gray-100 text-sm text-gray-400 bg-transparent cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Productos -->
          <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Productos de la Orden</h3>
              <button
                type="button"
                @click="addProduct"
                class="text-[10px] font-bold text-[#f266b3] hover:text-[#e04fa0] border border-pink-100 px-3 py-1 rounded-full transition-colors uppercase tracking-tight"
              >
                <i class="fa-solid fa-plus mr-1"></i> Añadir Item
              </button>
            </div>

            <div class="space-y-3">
              <div v-for="(item, index) in form.productos" :key="index" class="p-4 bg-gray-50/50 rounded-2xl flex flex-wrap sm:flex-nowrap gap-4 items-end border border-gray-50 group hover:border-pink-100 transition-colors">
                <div class="flex-grow min-w-[200px] flex flex-col gap-1.5">
                  <label class="text-[9px] font-bold text-gray-300 uppercase tracking-widest ml-0.5">Producto</label>
                  <select
                    v-model="item.id"
                    class="w-full py-1.5 bg-transparent border-0 border-b border-gray-200 text-sm outline-none focus:border-[#f266b3] text-gray-700 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Seleccionar...</option>
                    <option v-for="prod in getProductArray(productos)" :key="prod.id" :value="prod.id">
                      {{ prod.nombre }} (${{ prod.costo_unitario }})
                    </option>
                  </select>
                </div>
                <div class="w-24 flex flex-col gap-1.5">
                  <label class="text-[9px] font-bold text-gray-300 uppercase tracking-widest ml-0.5">Cantidad</label>
                  <input
                    type="number"
                    v-model.number="item.cantidad"
                    min="1"
                    class="w-full py-1.5 bg-transparent border-0 border-b border-gray-200 text-sm text-center outline-none focus:border-[#f266b3] text-gray-700 transition-all"
                    required
                  />
                </div>
                <div class="w-24 flex flex-col gap-1.5 items-end">
                  <label class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Subtotal</label>
                  <div class="py-1.5 text-sm font-bold text-gray-900 tracking-tight">
                    ${{ getSubtotal(item) }}
                  </div>
                </div>
                <div class="pb-1.5">
                  <button
                    type="button"
                    @click="removeProduct(index)"
                    class="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Eliminar registro"
                    :disabled="form.productos.length === 1"
                  >
                     <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end pt-6">
               <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total de la Orden</span>
               <span class="text-3xl font-bold text-[#f266b3] tracking-tighter">${{ calculateTotal().toFixed(2) }}</span>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 p-8 bg-gray-50/50 rounded-b-3xl border-t border-gray-100">
        <button
          class="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider disabled:opacity-50"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          class="inline-flex items-center justify-center px-8 py-2.5 bg-[#f266b3] text-white rounded-xl text-sm font-semibold hover:bg-[#e04fa0] shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin mr-2"></i> 
          Crear Orden
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as ClientesService from '@/services/ClientesService'
import * as ProductosService from '@/services/ProductosService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['close', 'save'])
const { user } = useAuth()

const clientes = ref([])
const productos = ref([])
const errorMessage = ref('')
const isSubmitting = ref(false)

const form = ref({
  cliente_id: '',
  productos: [{ id: '', cantidad: 1 }]
})

const getClientArray = (data) => Array.isArray(data) ? data : (data?.data || [])
const getProductArray = (data) => {
    let arr = Array.isArray(data) ? data : (data?.data || [])
    return arr.filter(p => p.stock_actual > 0)
}

const fetchData = async () => {
  try {
    const [clientesData, productosData] = await Promise.all([
      ClientesService.getAll(),
      ProductosService.getAll()
    ])
    clientes.value = clientesData
    productos.value = productosData
  } catch (error) {
    console.error('Error fetching data:', error)
    errorMessage.value = "Error al cargar productos o clientes."
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = {
      cliente_id: '',
      productos: [{ id: '', cantidad: 1 }]
    }
    errorMessage.value = ''
    fetchData()
  }
})

const getSubtotal = (item) => {
  if (!item.id || !item.cantidad) return '0.00'
  const allProds = Array.isArray(productos.value) ? productos.value : (productos.value?.data || [])
  const product = allProds.find(p => p.id === item.id)
  if (!product) return '0.00'
  return (product.costo_unitario * item.cantidad).toFixed(2)
}

const calculateTotal = () => {
  return form.value.productos.reduce((total, item) => {
    if (!item.id || !item.cantidad) return total
    const allProds = Array.isArray(productos.value) ? productos.value : (productos.value?.data || [])
    const product = allProds.find(p => p.id === item.id)
    if (!product) return total
    return total + (product.costo_unitario * item.cantidad)
  }, 0)
}

const addProduct = () => form.value.productos.push({ id: '', cantidad: 1 })
const removeProduct = (index) => {
  if (form.value.productos.length > 1) {
    form.value.productos.splice(index, 1)
  }
}

const handleSubmit = () => {
  errorMessage.value = ''
  if (!form.value.cliente_id) {
    errorMessage.value = "Debe verificar el cliente."
    return
  }
  if (form.value.productos.some(p => !p.id || p.cantidad <= 0)) {
    errorMessage.value = "Seleccione un producto y cantidad válida para cada registro."
    return
  }
  
  const payload = {
    cliente_id: form.value.cliente_id,
    user_id: user.value.id,
    productos: form.value.productos.map(p => ({
      id: p.id,
      cantidad: p.cantidad
    }))
  }

  isSubmitting.value = true
  emit('save', payload)
}

const handleCancel = () => {
  emit('close')
}

defineExpose({ isSubmitting, errorMessage })
</script>
