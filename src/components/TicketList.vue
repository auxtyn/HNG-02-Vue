<template>
  <div class="ticket-list">
    <div class="header">
      <h2>Your Tickets</h2>
      <router-link to="/tickets/new" class="create-btn">
        Create New Ticket
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">
      <LoadingSpinner message="Loading tickets..." />
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="tickets.length === 0" class="empty">
      No tickets found. Create your first ticket!
    </div>

    <div v-else class="tickets-grid">
      <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
        <div class="ticket-header">
          <h3>{{ ticket.title }}</h3>
          <span :class="['priority-badge', ticket.priority]">
            {{ ticket.priority }}
          </span>
        </div>
        
        <p class="description">{{ ticket.description }}</p>
        
        <div class="ticket-footer">
          <span class="date">{{ formatDate(ticket.createdAt) }}</span>
          <div class="actions">
            <button @click="editTicket(ticket.id)" class="edit-btn">
              Edit
            </button>
            <button @click="deleteTicket(ticket.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from './ui/LoadingSpinner.vue'

export default {
  name: 'TicketList',
  components: {
    LoadingSpinner
  },
  setup() {
    const router = useRouter()
    const tickets = ref([])
    const isLoading = ref(true)
    const error = ref(null)

    const fetchTickets = async () => {
      try {
        isLoading.value = true
        // Add your API call here to fetch tickets
        // tickets.value = await fetchTicketsFromAPI()
        
        // Temporary mock data
        tickets.value = [
          {
            id: 1,
            title: 'Sample Ticket',
            description: 'This is a sample ticket description',
            priority: 'high',
            createdAt: new Date()
          }
        ]
      } catch (err) {
        error.value = 'Failed to load tickets. Please try again.'
        console.error('Error fetching tickets:', err)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const editTicket = (id) => {
      router.push(`/tickets/${id}/edit`)
    }

    const deleteTicket = async (id) => {
      if (!confirm('Are you sure you want to delete this ticket?')) {
        return
      }

      try {
        // Add your API call here to delete ticket
        await Promise.resolve() // Replace with actual API call
        tickets.value = tickets.value.filter(ticket => ticket.id !== id)
      } catch (err) {
        console.error('Error deleting ticket:', err)
      }
    }

    onMounted(() => {
      fetchTickets()
    })

    return {
      tickets,
      isLoading,
      error,
      formatDate,
      editTicket,
      deleteTicket
    }
  }
}
</script>

<style scoped>
.ticket-list {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  background-color: #2ecc71;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ticket-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.priority-badge.high {
  background-color: #ff4444;
  color: white;
}

.priority-badge.medium {
  background-color: #ffbb33;
  color: white;
}

.priority-badge.low {
  background-color: #00C851;
  color: white;
}

.description {
  color: #666;
  margin-bottom: 1rem;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: #999;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style>