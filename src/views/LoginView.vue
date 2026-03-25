<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
    <div class="bg-white rounded-2xl shadow-md w-full max-w-sm px-10 py-12">

      <!-- Logo / Marca -->
      <div class="flex items-center gap-2.5 mb-10">
        <div class="w-8 h-8 rounded-lg bg-[#f266b3] flex items-center justify-center shadow-sm">
          <span class="text-white font-bold text-lg leading-none mt-[-1px]">H</span>
        </div>
        <span class="text-lg font-semibold text-gray-800 tracking-tight">Honeypop</span>
      </div>

      <!-- Encabezado -->
      <h1 class="text-xl font-semibold text-gray-900 mb-1">Bienvenido</h1>
      <p class="text-sm text-gray-400 mb-8">Inicia sesión para continuar</p>

      <!-- Campos -->
      <div class="flex flex-col gap-5">

        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-xs font-medium text-gray-500 uppercase tracking-wider">Correo electrónico</label>
          <input
            id="email"
            v-model="user.email"
            type="email"
            placeholder="tu@correo.com"
            autocomplete="email"
            required
            class="w-full border-0 border-b border-gray-200 pb-2 text-sm text-gray-800 bg-transparent outline-none transition-colors placeholder-gray-300 focus:border-[#f266b3]"
          />
        </div>

        <!-- Contraseña -->
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-xs font-medium text-gray-500 uppercase tracking-wider">Contraseña</label>
          <input
            id="password"
            v-model="user.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            class="w-full border-0 border-b border-gray-200 pb-2 text-sm text-gray-800 bg-transparent outline-none transition-colors placeholder-gray-300 focus:border-[#f266b3]"
          />
        </div>

      </div>

      <!-- Error -->
      <p v-if="errorMsg" class="mt-4 text-xs text-red-400">{{ errorMsg }}</p>

      <!-- Botón -->
      <button
        @click="handleLogin"
        :disabled="loading"
        class="mt-8 w-full flex items-center justify-center bg-[#f266b3] hover:bg-[#e04fa0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-2.5 text-sm transition-colors duration-200"
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
