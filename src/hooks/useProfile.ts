import { useState, useCallback } from 'react'
import { getUserProfile, updateUserProfile, changePassword } from '@/lib/api'

export function useProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserProfile()
      setProfile(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch profile'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (profileData: Record<string, unknown>) => {
      try {
        setLoading(true)
        setError(null)
        const data = await updateUserProfile(profileData)
        setProfile(data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const updatePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      try {
        setLoading(true)
        setError(null)
        const data = await changePassword(oldPassword, newPassword)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to change password'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { profile, loading, error, fetchProfile, updateProfile, updatePassword }
}
