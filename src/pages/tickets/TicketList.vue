<template>
  <div class="py-8">
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="text-red-600 text-center py-8">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 class="text-3xl font-bold">Tickets</h1>
        
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="border rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <input
            type="text"
            placeholder="Search tickets..."
            v-model="filters.search"
            class="border rounded px-3 py-2 flex-1"
          />

          <router-link
            to="/tickets/new"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Ticket
          </router-link>
        </div>
      </div>

      <div class="grid gap-4">
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id" 
          class="bg-white rounded-lg shadow p-6 card"
        >
          <div class="flex justify-between items-center">
            <div>
              <router-link 
                :to="`/tickets/${ticket.id}`" 
                class="no-underline text-slate-900 font-semibold"
              >
                {{ ticket.title }}
              </router-link>
              <div class="text-muted">{{ ticket.description }}</div>
            </div>
            <div>
              <span :class="['badge', statusBadgeClass(ticket.status)]">
                {{ ticket.status.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredTickets.length === 0" class="text-muted center card">
          No tickets found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue'

const toast = useToast()

const tickets = ref([])
const loading = ref(true)
const error = ref(null)
const filters = ref({
  status: 'all',
  search: '',
  sortBy: 'newest'
})

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800'
}

const statusBadgeClass = (status) => {
  return status === 'open' ? 'badge-open' 
    : status === 'in_progress' ? 'badge-in-progress' 
    : 'badge-closed'
}

const filteredTickets = computed(() => {
  let result = [...tickets.value]

  // Apply status filter
  if (filters.value.status !== 'all') {
    result = result.filter(t => t.status === filters.value.status)
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(t => 
      t.title.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm)
    )
  }

  // Apply sorting
  result.sort((a, b) => {
    if (filters.value.sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  return result
})

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this ticket?')) {
    try {
      const updatedTickets = tickets.value.filter(ticket => ticket.id !== id)
      localStorage.setItem('tickets', JSON.stringify(updatedTickets))
      tickets.value = updatedTickets
      toast.success('Ticket deleted successfully')
    } catch (error) {
      toast.error('Failed to delete ticket')
    }
  }
}

const fetchTickets = async () => {
  try {
    loading.value = true
    const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    tickets.value = savedTickets
  } catch (err) {
    error.value = 'Failed to load tickets'
    toast.error('Failed to load tickets')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.badge-open {
  @apply bg-green-100 text-green-800;
}

.badge-in-progress {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-closed {
  @apply bg-gray-100 text-gray-800;
}

.text-muted {
  @apply text-gray-600;
}

.center {
  @apply text-center;
}
</style>