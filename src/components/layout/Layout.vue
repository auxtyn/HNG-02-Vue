<template>
  <div>
    <Navbar />
    <main class="mx-auto max-w-container px-4">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
</script>

<style scoped>
.max-w-container {
  max-width: 1200px;
}
</style>