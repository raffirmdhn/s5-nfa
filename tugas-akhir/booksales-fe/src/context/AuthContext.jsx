import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      authService
        .getMe()
        .then((res) => {
          if (res?.data) {
            setUser(res.data)
            localStorage.setItem('user', JSON.stringify(res.data))
          }
        })
        .catch(() => {
          logout()
        })
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await authService.login(email, password)
      const data = res.data
      const receivedToken = data.token
      const receivedUser = data.user

      setToken(receivedToken)
      setUser(receivedUser)
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('user', JSON.stringify(receivedUser))
      return { success: true, user: receivedUser }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login gagal. Periksa email dan password.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const res = await authService.register(userData)
      const data = res.data
      const receivedToken = data.token
      const receivedUser = data.user

      setToken(receivedToken)
      setUser(receivedUser)
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('user', JSON.stringify(receivedUser))
      return { success: true, user: receivedUser }
    } catch (err) {
      let message = 'Registrasi gagal. Silakan coba lagi.'
      if (err.response?.data?.errors) {
        message = Object.values(err.response.data.errors).flat().join(', ')
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = user?.role === 'admin'
  const isCustomer = user?.role === 'customer' || user?.role === 'user'
  const isGuest = !token

  const hasRole = (roles) => {
    if (!user || !user.role) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin,
        isCustomer,
        isGuest,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
