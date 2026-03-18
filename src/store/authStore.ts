import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: async (email: string, _password: string) => {
        set({ loading: true })
        try {
          set({
            user: { id: '1', name: 'John Doe', email, role: 'CUSTOMER' },
            isAuthenticated: true,
          })
        } finally {
          set({ loading: false })
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      setUser: (user: User) => set({ user, isAuthenticated: true }),
    }),
    { name: 'auth-store' }
  )
)
