<template>
  <div class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <RouterLink
        to="/tickets/new"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Ticket
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Tickets" :value="stats.total" bgColor="bg-blue-100" />
      <StatCard title="Open Tickets" :value="stats.open" bgColor="bg-green-100" />
      <StatCard title="In Progress" :value="stats.inProgress" bgColor="bg-yellow-100" />
      <StatCard title="Closed Tickets" :value="stats.closed" bgColor="bg-red-100" />
    </div>

    <div class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">Recent Tickets</h2>
      <div v-if="loading" class="flex justify-center">
        <LoadingSpinner />
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        {{ error }}
      </div>
      <div v-else class="bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="ticket in recentTickets" :key="ticket.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">{{ ticket.title }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(ticket.status)">{{ ticket.status }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getPriorityClass(ticket.priority)">{{ ticket.priority }}</span>
              </td>
              <td class="px-6 py-4">{{ formatDate(ticket.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '../components/dashboard/StatCard.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'

const stats = ref({
  total: 0,
  open: 0,
  inProgress: 0,
  closed: 0
})

const recentTickets = ref([])
const loading = ref(true)
const error = ref(null)

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || ''}`
}

const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  }
  return `px-2 py-1 rounded-full text-xs font-medium ${classes[priority] || ''}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const fetchDashboardData = async () => {
  try {
    loading.value = true
    // Add your API calls here
    // const response = await Promise.all([
    //   api.getStats(),
    //   api.getRecentTickets()
    // ])
    
    // Mock data for demonstration
    stats.value = {
      total: 45,
      open: 12,
      inProgress: 8,
      closed: 25
    }

    recentTickets.value = [
      {
        id: 1,
        title: 'Server deployment issue',
        status: 'open',
        priority: 'high',
        createdAt: new Date()
      }
      // Add more mock tickets as needed
    ]
  } catch (err) {
    error.value = 'Failed to load dashboard data'
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
