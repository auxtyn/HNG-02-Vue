<template>
  <div class="ticket-form">
    <h2>{{ isEditing ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
    <form @submit.prevent="handleSubmit">
      <FormInput
        label="Title"
        id="title"
        v-model="ticket.title"
        placeholder="Enter ticket title"
      />
      
      <div class="form-control">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="ticket.description"
          placeholder="Enter ticket description"
          rows="4"
        ></textarea>
      </div>

      <div class="form-control">
        <label for="priority">Priority</label>
        <select id="priority" v-model="ticket.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import FormInput from '../components/auth/FormInput.vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'TicketForm',
  components: {
    FormInput
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isSubmitting = ref(false)
    const isEditing = ref(false)
    
    const ticket = ref({
      title: '',
      description: '',
      priority: 'low'
    })

    onMounted(() => {
      if (route.params.id) {
        isEditing.value = true
        // Fetch ticket data if editing
        // Add your API call here
      }
    })

    const handleSubmit = async () => {
      try {
        isSubmitting.value = true
        // Add your API call here
        
        router.push('/tickets')
      } catch (error) {
        console.error('Error submitting ticket:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      ticket,
      isSubmitting,
      isEditing,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.ticket-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.form-control {
  margin-bottom: 1rem;
}

.form-control label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-control textarea,
.form-control select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>