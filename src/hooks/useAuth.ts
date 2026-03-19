import { useState, useCallback } from 'react'
import * as api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export function useAuth() {
  const { user, isAuthenticated, loading: storeLoading, logout: storeLogout, checkAuth } =
    useAuthStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.login(email, password) as {
        accessToken?: string
        refreshToken?: string
        user?: AuthUser
      }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }
      if (data.user) {
        useAuthStore.getState().setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: (data.user.role as 'CUSTOMER' | 'ADMIN') ?? 'CUSTOMER',
        })
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.register(name, email, phone, password)
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      storeLogout()
    }
  }, [storeLogout])

  const doRefreshToken = useCallback(async () => {
    const token = localStorage.getItem('refreshToken')
    if (!token) return null
    try {
      const data = await api.refreshToken(token) as { accessToken?: string }
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token refresh failed')
      throw err
    }
  }, [])

  return {
    user,
    isAuthenticated,
    loading: loading || storeLoading,
    error,
    login,
    register,
    logout,
    refreshToken: doRefreshToken,
    checkAuth,
  }
}
