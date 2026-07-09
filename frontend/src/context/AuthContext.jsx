import { createContext, useContext, useState, useEffect } from 'react'
import { authService, customerService } from '../services'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCustomerProfile, setHasCustomerProfile] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsAuthenticated(true)
      // Decode token to get user info (basic approach)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.id, email: payload.email, role: payload.role })
      } catch (error) {
        console.log('Could not decode token')
      }
    }
    setLoading(false)
  }, [])

  const checkCustomerProfile = async () => {
    try {
      const response = await customerService.getAll()
      const customers = Array.isArray(response.data) ? response.data : [response.data]
      setHasCustomerProfile(customers.length > 0)
      return customers.length > 0
    } catch (error) {
      console.log('Error checking customer profile:', error)
      setHasCustomerProfile(false)
      return false
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      const { accessToken, refreshToken } = response.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      setUser({ id: payload.id, email: payload.email, role: payload.role })
      setIsAuthenticated(true)

      toast.success('Login successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.register(email, password)
      toast.success('Registration successful! Please login.')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const deleteAccount = async () => {
    try {
      await authService.deleteMe()
      toast.success('Account deactivated successfully')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/login'
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to deactivate account'
      toast.error(message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    hasCustomerProfile,
    checkCustomerProfile,
    login,
    register,
    logout,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
