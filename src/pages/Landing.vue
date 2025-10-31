<template>

  <div class="relative min-h-screen overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
    <div 
      class="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-lg animate-bounce" 
      :style="{ animationDuration: '3s' }"
    />
    <div 
      class="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-blue-500/25 to-cyan-400/25 rounded-full blur-md animate-pulse"
      :style="{ animationDelay: '1s' }"
    />

    <!-- Hero section with enhanced wave -->
    <div class="relative wave-bg pb-40">
      <!-- subtle dark overlay for readable white text -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <div class="pt-36 pb-48 px-4 text-center relative z-10">
        <div class="mx-auto max-w-3xl animate-fadeInUp">
          <!-- contrast panel so white text is always visible -->
          <div class="inline-block bg-black/45 backdrop-blur-md rounded-2xl p-8">
            <h1 
              class="text-5xl md:text-6xl font-bold mb-6 text-red"
              :style="{ textShadow: '0 6px 18px rgba(0,0,0,0.7)' }"
            >
              Ticket Management System
            </h1>
            <p class="text-lg md:text-xl text-white-100 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
              Streamline support workflows — create, assign and resolve tickets with clarity.
            </p>

            <div class="flex justify-center gap-6 flex-wrap mt-4 mx-5">
              <router-link
                to="/login"
                class="btn btn-primary transform hover:scale-105 px-8 py-3 text-lg m-5"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="btn btn-outline transform hover:scale-105 px-8 py-3 text-lg"
              >
                Get Started
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced feature boxes -->
    <div class="mx-auto max-w-container px-6 -mt-20 mb-20 text-dark">
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="card text-dark p-6"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="gradient-text mb-2">{{ feature.title }}</h3>
          <p class="text-slate-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Call to action section -->
    <div class="px-4 pb-16">
      <div class="card text-center max-w-2xl mx-auto">
        <h2 
          class="text-3xl font-bold mb-4 gradient-text"
        >
          Ready to get started?
        </h2>
        <p class="text-muted mb-6">Join teams who manage support efficiently with our platform.</p>
        <router-link to="/register" class="btn btn-primary">
          Create Your Account
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: '🧭', title: 'Organize', description: 'Categorize and filter tickets easily.' },
  { icon: '⚡', title: 'Fast Actions', description: 'Quickly create, assign and resolve issues.' },
  { icon: '📊', title: 'Insights', description: 'Track SLA and team performance.' },
]
</script>

<style scoped>
.wave-bg {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}

.gradient-text {
  background: linear-gradient(90deg,#2563eb,#7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn {
  @apply rounded-md transition-transform duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-outline {
  @apply border-2 border-white text-white hover:bg-white/10;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 1s ease-out;
}
</style>