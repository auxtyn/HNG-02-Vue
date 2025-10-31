<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      
      <form class="mt-8 space-y-6 input" @submit.prevent="handleSubmit">
        <FormInput
          label="Username"
          name="username"
          v-model="formData.username"
          :error="errors.username"
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          v-model="formData.email"
          :error="errors.email"
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          v-model="formData.password"
          :error="errors.password"
          required
        />

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ isLoading ? 'Creating account...' : 'Register' }}
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-blue-600 hover:text-blue-500">
          Already have an account? Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import FormInput from '../../components/auth/FormInput.vue'

const router = useRouter()
const toast = useToast()

const formData = ref({
  username: '',
  email: '',
  password: ''
})

const errors = ref({})
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    // Basic validation
    if (!formData.value.username.trim()) {
      errors.value.username = 'Username is required'
    }
    if (!formData.value.email.trim()) {
      errors.value.email = 'Email is required'
    }
    if (!formData.value.password) {
      errors.value.password = 'Password is required'
    }

    if (Object.keys(errors.value).length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    // Add your registration API call here
    // const response = await api.register(formData.value)

    // For demo, just store in localStorage
    localStorage.setItem('user', JSON.stringify({
      username: formData.value.username,
      email: formData.value.email
    }))

    toast.success('Registration successful!')
    router.push('/login')
  } catch (error) {
    toast.error(error.message || 'Registration failed')
  } finally {
    isLoading.value = false
  }
}
</script>
