<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white border-t-4 border-[#f266b3] rounded-xl shadow-sm w-full max-w-sm px-8 py-10">

      <p class="text-2xl font-semibold text-[#f266b3] tracking-wide mb-1">Honeypop</p>
      <p class="text-sm text-gray-500 mb-8">Inicia sesión para continuar</p>

        <!-- Email -->
        <div class="flex flex-col gap-1">
          <label for="email" class="text-xs font-medium text-gray-700">Correo electrónico</label>
          <input
            id="email"
            v-model="user.email"
            type="email"
            placeholder="tu@correo.com"
            autocomplete="email"
            required
            class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#f266b3] focus:ring-2 focus:ring-[#f266b3]/20"
          />
        </div>

        <!-- Contraseña -->
        <div class="flex flex-col gap-1">
          <label for="password" class="text-xs font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            v-model="user.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#f266b3] focus:ring-2 focus:ring-[#f266b3]/20"
          />
        </div>

        <!-- Error -->
        <p v-if="errorMsg" class="text-xs text-red-500">{{ errorMsg }}</p>

        <!-- Botón -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="mt-1 flex items-center justify-center bg-[#f266b3] hover:bg-[#e04fa0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition duration-200"
        >
          <svg
            v-if="loading"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span v-else>Entrar</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth';

const { login } = useAuth();
const router = useRouter()
const user = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async() => {
  loading.value = true
  errorMsg.value = ''
  try {
    await login(user.value);
    router.push('/');
  } catch (error) {
    errorMsg.value =
      error.response?.data?.message || 'Credenciales incorrectas.'
  } finally {
    loading.value = false
  }
}
</script>
