<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="card bg-white rounded-lg shadow-md p-8">
        <div class="mb-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p class="text-sm text-gray-600">Access the ticket management system</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="username" class="block  text-sm font-medium text-black">Username</label>
            <input
              id="username"
              v-model="form.username"
              required
              :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <!-- changed: label color to black -->
            <label for="password" class="block text-sm font-medium text-black">Password</label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="w-full btn btn-primary py-2 px-4 rounded text-white">
            <span v-if="loading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="mt-6 space-y-2 text-center">
          <router-link to="/register" class="text-sm text-blue-600 hover:text-blue-500">Create an account</router-link>
          <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</router-link>

          <div class="mt-6 p-4 bg-gray-50 rounded-md text-xs">
            <p class="font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div class="text-gray-600">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>User:</strong> user / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const toast = useToast()
const auth = typeof useAuth === 'function' ? useAuth() : null
const login = auth?.login ?? null

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (typeof login === 'function') {
      const res = await login(form.username, form.password)
      if (res && res.success) {
        toast.success('Signed in')
        router.push('/tickets')
      } else {
        error.value = res?.error || 'Invalid credentials'
        toast.error(error.value)
      }
    } else {
      // fallback: simple localStorage check for demo
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const found = users.find(u => u.username === form.username)
      if (found && (found.password ? found.password === form.password : true)) {
        localStorage.setItem('user', JSON.stringify(found))
        toast.success('Signed in (local)')
        router.push('/tickets')
      } else {
        error.value = 'Invalid credentials'
        toast.error(error.value)
      }
    }
  } catch (err) {
    error.value = err?.message || 'Sign in failed'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* local overrides if needed */
</style>