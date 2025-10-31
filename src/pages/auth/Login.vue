<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Login</h2>
      
      <div v-if="errors.auth" class="error-message">
        {{ errors.auth }}
      </div>

      <form @submit.prevent="handleSubmit">
        <FormInput
          label="Username"
          type="text"
          name="username"
          v-model="formData.username"
          :error="errors.username"
          required
        />
        
        <FormInput
          label="Password"
          type="password"
          name="password"
          v-model="formData.password"
          :error="errors.password"
          required
        />

        <button type="submit" class="login-button btn">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import FormInput from '../../components/auth/FormInput.vue'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const toast = useToast()
const { login } = useAuth()

const formData = ref({
  username: '',
  password: ''
})

const errors = ref({})

const handleSubmit = async () => {
  errors.value = {}
  
  try {
    const result = await login(formData.value.username, formData.value.password)
    if (result.success) {
      toast.success('Welcome back!')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
      errors.value.auth = result.error
    }
  } catch (error) {
    toast.error('Login failed')
    errors.value.auth = 'An unexpected error occurred'
  }
}
</script>

<style scoped>
.login-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 px-4;
}

.login-card {
  @apply bg-white rounded-lg shadow-md p-8 w-full max-w-md;
}

.login-title {
  @apply text-2xl font-bold text-center mb-6;
}

.error-message {
  @apply bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4;
}

.login-button {
  @apply w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-6;
}
</style>