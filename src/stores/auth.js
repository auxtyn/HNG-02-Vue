import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const hashPassword = (password) => btoa(password)

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  // Load user from localStorage on app start
  const loadUser = () => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    loading.value = false
  }

  // Save user to localStorage
  const saveUserToStorage = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData))
    user.value = userData
  }

  // Clear user from localStorage
  const clearUserFromStorage = () => {
    localStorage.removeItem('currentUser')
    user.value = null
  }

  // Login function
  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(u => u.username === username && u.password === hashPassword(password))

    if (foundUser) {
      saveUserToStorage(foundUser)
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  // Register function
  const register = (username, password, role = 'user') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' }
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashPassword(password),
      role,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    saveUserToStorage(newUser)

    return { success: true }
  }

  // Logout function
  const logout = () => {
    clearUserFromStorage()
  }

  // Password reset simulation
  const resetPassword = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.username === username)

    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }

    // Generate reset token (simulation)
    const resetToken = Math.random().toString(36).substring(2, 15)
    users[userIndex].resetToken = resetToken
    users[userIndex].resetTokenExpiry = Date.now() + 3600000 // 1 hour

    localStorage.setItem('users', JSON.stringify(users))

    // Simulate sending email
    console.log(`Password reset link: ${resetToken}`)

    return { success: true, message: 'Password reset link sent (check console)' }
  }

  // Update password with reset token
  const updatePasswordWithToken = (token, newPassword) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.resetToken === token && u.resetTokenExpiry > Date.now())

    if (userIndex === -1) {
      return { success: false, error: 'Invalid or expired reset token' }
    }

    users[userIndex].password = hashPassword(newPassword)
    delete users[userIndex].resetToken
    delete users[userIndex].resetTokenExpiry

    localStorage.setItem('users', JSON.stringify(users))

    return { success: true }
  }

  // Check if user has permission
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

  return {
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    loadUser,
    login,
    register,
    logout,
    resetPassword,
    updatePasswordWithToken,
    hasPermission
  }
})