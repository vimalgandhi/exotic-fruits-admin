import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isAuthenticated, loading, login, register, logout, setUser, checkAuth } =
    useAuthStore()

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    setUser,
    checkAuth,
  }
}
