<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="card bg-white rounded-lg shadow-md p-8">
        <div class="mb-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
          <p class="text-sm text-gray-600">Join the ticket management system</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-black">Username</label>
            <input id="username" v-model="form.username" required :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              placeholder="Choose a username" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-black">Password</label>
            <input id="password" type="password" v-model="form.password" required :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              placeholder="Create a password (min 6 characters)" />
          </div>

          <div>
            <label for="confirm" class="block text-sm font-medium text-black">Confirm Password</label>
            <input id="confirm" type="password" v-model="form.confirmPassword" required :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              placeholder="Confirm your password" />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-black">Role</label>
            <select id="role" v-model="form.role" :disabled="loading"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
        </form>

        <div class="mt-4 text-center">
          <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-500">Already have an account? Sign in</router-link>
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
const { register } = useAuth ? useAuth() : { register: null }

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  loading.value = true

  try {
    if (typeof register === 'function') {
      const result = await register(form.username, form.password, form.role)
      if (result && result.success) {
        toast.success('Account created')
        router.push('/tickets')
      } else {
        error.value = result?.error || 'Registration failed'
        toast.error(error.value)
      }
    } else {
      // fallback: save user to localStorage (simple demo)
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.find(u => u.username === form.username)) {
        error.value = 'Username already exists'
        toast.error(error.value)
      } else {
        const newUser = { id: Date.now(), username: form.username, role: form.role }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('user', JSON.stringify(newUser))
        toast.success('Account created')
        router.push('/tickets')
      }
    }
  } catch (err) {
    error.value = err?.message || 'Registration failed'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* local overrides if needed */
</style>