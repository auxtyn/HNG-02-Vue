<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/tickets" class="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Ticket Manager
          </router-link>
        </div>

        <nav class="flex items-center space-x-4">
          <template v-if="user && user.username">
            <div class="flex items-center space-x-4">
              <div class="hidden sm:flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-700">
                  {{ user.username }} ({{ user.role }})
                </span>
              </div>

              <router-link
                to="/tickets"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Tickets
              </router-link>

              <router-link
                v-if="user.role === 'admin'"
                to="/admin"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin
              </router-link>

              <button @click="handleLogout" class="btn btn-outline text-sm">
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center space-x-4">
              <router-link
                to="/login"
                class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign in
              </router-link>
              <router-link to="/register" class="btn btn-primary text-sm">Sign up</router-link>
            </div>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js' // <- see: src/composables/useAuth.js

const router = useRouter()
const { user, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
/* keep Tailwind utility classes; add any local overrides here if needed */
</style>