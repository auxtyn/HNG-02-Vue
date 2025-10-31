<template>
  <footer class="bg-gray-100 mt-8">
    <div class="mx-auto max-w-container px-4 py-8">
      <div class="text-center text-gray-600">
        <p>&copy; {{ currentYear }} Ticket App. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.max-w-container {
  max-width: 1280px;
}
</style>