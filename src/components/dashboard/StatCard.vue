<template>
  <div 
    class="stat-card rounded-lg shadow p-6"
    :class="bgColor"
  >
    <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ title }}</h3>
    <div class="text-3xl font-bold text-gray-900">{{ value }}</div>
    <div v-if="trend" class="mt-2 flex items-center text-sm">
      <span 
        :class="trend > 0 ? 'text-green-600' : 'text-red-600'"
      >
        {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
      </span>
      <span class="text-gray-500 ml-2">vs last month</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  bgColor: {
    type: String,
    default: 'bg-white'
  },
  trend: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.stat-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style>