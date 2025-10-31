<template>
  <header class="navbar">
    <div class="mx-auto max-w-container px-4">
      <div class="nav-inner">
        <RouterLink to="/" class="nav-brand">Ticket App</RouterLink>

        <nav class="nav-links" role="navigation" aria-label="Primary">
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
          <RouterLink to="/tickets" class="nav-link">Tickets</RouterLink>
          <!-- <RouterLink to="/about" class="nav-link">About</RouterLink> -->
        </nav>

        <div class="auth-actions">
          <template v-if="authStore.user">
            <button @click="handleLogout" class="btn logout-btn">Logout</button>
          </template>
          <template v-else>
            <!-- <RouterLink to="/login" class="nav-link">Login</RouterLink> -->
            <RouterLink to="/register" class="btn btn-primary">Get Started</RouterLink>
          </template>

          <button
            class="mobile-menu-btn"
            aria-label="Toggle menu"
            @click="open = !open"
          >
            ☰
          </button>
        </div>
      </div>

      <div v-if="open" class="mobile-panel">
        <RouterLink to="/dashboard" @click="open = false" class="mobile-link">Dashboard</RouterLink>
        <RouterLink to="/tickets" @click="open = false" class="mobile-link">Tickets</RouterLink>
        <!-- <RouterLink to="/about" @click="open = false" class="mobile-link">About</RouterLink> -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const open = ref(false)

const handleLogout = () => {
  authStore.logout()
  toast.success('Logged out successfully')
  router.push('/login')
}
</script>

<style scoped>
/* Add your CSS styles here */
</style>