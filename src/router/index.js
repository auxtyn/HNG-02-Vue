import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/layout/Layout.vue'
import Landing from '../pages/Landing.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import TicketList from '../pages/tickets/TicketList.vue'
import TicketForm from '../pages/tickets/TicketForm.vue'

const routes = [
  { path: '/Home', redirect: '/' },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'landing', component: Landing },
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: Register },
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: 'tickets', name: 'tickets', component: TicketList, meta: { requiresAuth: true } },
      { path: 'tickets/new', name: 'ticket-new', component: TicketForm, meta: { requiresAuth: true } },
      { path: 'tickets/:id/edit', name: 'ticket-edit', component: TicketForm, meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
