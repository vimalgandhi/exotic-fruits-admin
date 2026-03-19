import { useState, useCallback } from 'react'
import * as api from '@/lib/api'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role?: string
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Profile error'
    setError(message)
    throw err
  }

  const getProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProfile() as UserProfile
      setProfile(data)
      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await api.updateProfile(data) as UserProfile
      setProfile(updated)
      return updated
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setLoading(true)
      setError(null)
      try {
        return await api.changePassword(oldPassword, newPassword)
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    changePassword,
  }
}
