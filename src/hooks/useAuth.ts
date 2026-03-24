import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isAuthenticated, loading, hydrated, login, register, logout, setUser, checkAuth } =
    useAuthStore()

  return {
    user,
    isAuthenticated,
    loading,
    hydrated,
    login,
    register,
    logout,
    setUser,
    checkAuth,
  }
}
