import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isAuthenticated, loading, login, logout, checkAuth } = useAuthStore()

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  }
}
