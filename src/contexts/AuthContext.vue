import { ref, computed, watchEffect } from 'vue'

// Simple password hashing (for demo only)
const hashPassword = (password) => btoa(password)

// Reactive state
const user = ref(null)
const loading = ref(true)

// Load user on app start
const loadUserFromStorage = () => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) user.value = JSON.parse(savedUser)
  loading.value = false
}
loadUserFromStorage()

// Save and clear helpers
const saveUserToStorage = (userData) => {
  localStorage.setItem('currentUser', JSON.stringify(userData))
  user.value = userData
}

const clearUserFromStorage = () => {
  localStorage.removeItem('currentUser')
  user.value = null
}

// 🔐 Login
const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const foundUser = users.find(
    (u) => u.username === username && u.password === hashPassword(password)
  )

  if (foundUser) {
    saveUserToStorage(foundUser)
    return { success: true }
  }
  return { success: false, error: 'Invalid username or password' }
}

// 🧾 Register
const register = (username, password, role = 'user') => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.find((u) => u.username === username)) {
    return { success: false, error: 'Username already exists' }
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashPassword(password),
    role,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  saveUserToStorage(newUser)

  return { success: true }
}

// 🚪 Logout
const logout = () => clearUserFromStorage()

// 🔁 Reset password (simulated)
const resetPassword = (username) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex((u) => u.username === username)

  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  const resetToken = Math.random().toString(36).substring(2, 15)
  users[userIndex].resetToken = resetToken
  users[userIndex].resetTokenExpiry = Date.now() + 3600000 // 1 hour

  localStorage.setItem('users', JSON.stringify(users))
  console.log(`Password reset link: ${resetToken}`)

  return { success: true, message: 'Password reset link sent (check console)' }
}

// 🔑 Update password
const updatePasswordWithToken = (token, newPassword) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(
    (u) => u.resetToken === token && u.resetTokenExpiry > Date.now()
  )

  if (userIndex === -1) {
    return { success: false, error: 'Invalid or expired reset token' }
  }

  users[userIndex].password = hashPassword(newPassword)
  delete users[userIndex].resetToken
  delete users[userIndex].resetTokenExpiry

  localStorage.setItem('users', JSON.stringify(users))
  return { success: true }
}

// ⚙️ Permissions
const hasPermission = (permission) => {
  if (!user.value) return false

  switch (permission) {
    case 'admin':
      return user.value.role === 'admin'
    case 'manageOwnTickets':
      return user.value.role === 'user' || user.value.role === 'admin'
    case 'manageAllTickets':
      return user.value.role === 'admin'
    default:
      return false
  }
}

// ✅ The composable
export function useAuth() {
  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    login,
    register,
    logout,
    resetPassword,
    updatePasswordWithToken,
    hasPermission,
  }
}
