import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const isAuthenticated = ref(false)

export function useAuth() {
  const router = useRouter()

  const login = async (username, password) => {
    try {
      // Mock authentication - replace with actual API call
      if (username === 'admin' && password === 'password') {
        const userData = {
          id: 1,
          username,
          role: 'admin'
        }
        
        user.value = userData
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', 'mock-jwt-token')
        
        return { success: true }
      }
      
      return {
        success: false,
        error: 'Invalid credentials'
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  const logout = async () => {
    try {
      // Add your logout API call here if needed
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/login')
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: 'Failed to logout'
      }
    }
  }

  const checkAuth = async () => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (storedUser && token) {
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
      return true
    }
    
    return false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}