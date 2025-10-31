<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  @apply flex flex-col items-center justify-center p-8;
}

.spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full;
  animation: spin 1s linear infinite;
}

.message {
  @apply mt-4 text-gray-600 text-sm;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>