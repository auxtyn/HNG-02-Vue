<template>
  <div class="py-8 justify-center mx-auto max-w-container px-4">
    <h1 class="text-3xl font-bold mb-8">
      {{ id ? 'Edit Ticket' : 'Create New Ticket' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="max-w-2xl form-input">
      <FormInput
        label="Title"
        name="title"
        v-model="formData.title"
        :error="errors.title"
        required
      />

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          v-model="formData.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Status
        </label>
        <select
          v-model="formData.status"
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <button
        type="submit"
        class="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {{ id ? 'Update Ticket' : 'Create Ticket' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import FormInput from '@/components/auth/FormInput.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = route.params.id

const errors = ref({})
const formData = ref({
  title: '',
  description: '',
  status: 'open'
})

onMounted(async () => {
  if (id) {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const ticket = tickets.find(t => t.id === id)
    if (ticket) {
      formData.value = ticket
    }
  }
})

const handleSubmit = async () => {
  errors.value = {}

  // Validation
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
    toast.error('Please fill in all required fields')
    return
  }

  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    
    if (id) {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === id ? { ...formData.value, id } : ticket
      )
      localStorage.setItem('tickets', JSON.stringify(updatedTickets))
      toast.success('Ticket updated successfully')
    } else {
      const newTicket = {
        ...formData.value,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('tickets', JSON.stringify([...tickets, newTicket]))
      toast.success('Ticket created successfully')
    }

    router.push('/tickets')
  } catch (error) {
    toast.error('Something went wrong. Please try again.')
  }
}
</script>

<style scoped>
.btn:disabled {
  @apply bg-gray-400 cursor-not-allowed;
}
</style>