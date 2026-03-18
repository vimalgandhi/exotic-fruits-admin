import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isAuthenticated, loading, login, logout } = useAuthStore()

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  }
}
