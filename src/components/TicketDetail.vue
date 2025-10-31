<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-gray-600">Loading ticket...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="alert alert-destructive mb-4">
        <span>{{ error }}</span>
      </div>
      <button @click="() => router.push('/tickets')" class="btn btn-primary">Back to Tickets</button>
    </div>

    <!-- Ticket -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div class="flex items-center space-x-4">
          <button @click="() => router.push('/tickets')" class="btn btn-outline p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ ticket.title }}</h1>
            <p class="text-gray-600 mt-1">Ticket #{{ ticket.id }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex gap-2">
            <span :class="['badge', getStatusBadgeVariant(ticket.status)]">
              {{ capitalize(ticket.status) }}
            </span>
            <span :class="['badge', getPriorityBadgeVariant(ticket.priority)]">
              {{ capitalize(ticket.priority) }}
            </span>
          </div>

          <div class="flex gap-2">
            <router-link
              v-if="canEditTicket"
              :to="`/tickets/${routeId}/edit`"
              class="btn btn-primary inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </router-link>

            <button
              v-if="canDeleteTicket"
              @click="showDeleteConfirm = true"
              class="btn btn-danger inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-500">ID</span>
                <span class="text-sm text-gray-900 font-mono">#{{ ticket.id }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-500">Status</span>
                <span :class="['badge', getStatusBadgeVariant(ticket.status), 'text-xs']">
                  {{ capitalize(ticket.status) }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-500">Priority</span>
                <span :class="['badge', getPriorityBadgeVariant(ticket.priority), 'text-xs']">
                  {{ capitalize(ticket.priority) }}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-500">Created</span>
                <span class="text-sm text-gray-900">{{ formatDate(ticket.createdAt) }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-sm font-medium text-gray-500">Updated</span>
                <span class="text-sm text-gray-900">{{ formatDate(ticket.updatedAt) }}</span>
              </div>
              <div v-if="ticket.createdBy" class="flex justify-between items-center py-2">
                <span class="text-sm font-medium text-gray-500">Created By</span>
                <span class="text-sm text-gray-900">User #{{ ticket.createdBy }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Ticket created</p>
                  <p class="text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</p>
                </div>
              </div>

              <div v-if="ticket.createdAt !== ticket.updatedAt" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Ticket updated</p>
                  <p class="text-xs text-gray-500">{{ formatDate(ticket.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Delete Ticket</h3>
              <p class="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>

          <p class="text-gray-700 mb-6">
            Are you sure you want to permanently delete this ticket? All associated data will be removed.
          </p>

          <div class="flex justify-end gap-3">
            <button @click="showDeleteConfirm = false" class="btn btn-outline">Cancel</button>
            <button @click="confirmDelete" class="btn btn-danger">Delete Ticket</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { getTicketById, deleteTicket } from '../utils/localStorage.js'

const route = useRoute()
const router = useRouter()
const routeId = route.params.id

const { user, hasPermission } = useAuth()

const ticket = ref(null)
const loading = ref(true)
const error = ref('')
const showDeleteConfirm = ref(false)

const safeHasPermission = (perm) => {
  if (typeof hasPermission === 'function') return hasPermission(perm)
  // fallback: admin role has all permissions
  return user?.value?.role === 'admin'
}

const loadTicket = () => {
  loading.value = true
  error.value = ''
  const found = getTicketById(routeId)
  if (found) {
    if (!safeHasPermission('manageAllTickets') &&
        (!safeHasPermission('manageOwnTickets') || found.createdBy !== user?.value?.id)) {
      error.value = 'You do not have permission to view this ticket'
    } else {
      ticket.value = found
    }
  } else {
    error.value = 'Ticket not found'
  }
  loading.value = false
}

onMounted(loadTicket)

const confirmDelete = () => {
  try {
    const ok = deleteTicket(routeId)
    if (ok) {
      router.push('/tickets')
    } else {
      error.value = 'Failed to delete ticket'
    }
  } catch (err) {
    error.value = err?.message || 'Failed to delete ticket'
  }
}

const canEditTicket = computed(() => {
  if (!ticket.value) return false
  return safeHasPermission('manageAllTickets') ||
         (safeHasPermission('manageOwnTickets') && ticket.value.createdBy === user?.value?.id)
})

const canDeleteTicket = computed(() => {
  if (!ticket.value) return false
  return safeHasPermission('manageAllTickets') ||
         (safeHasPermission('manageOwnTickets') && ticket.value.createdBy === user?.value?.id)
})

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-800 border-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityBadgeVariant = (priority) => {
  switch (priority) {
    case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const capitalize = (s = '') => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

const formatDate = (d) => {
  try { return new Date(d).toLocaleString() } catch { return d || '' }
}
</script>

<style scoped>
/* keep Tailwind utility classes; add local styles here if needed */
</style>