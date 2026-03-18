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
  checkAuth: () => void
}

function setAuthCookie(value: string) {
  if (typeof document !== 'undefined') {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `auth-session=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-session=; path=/; max-age=0; SameSite=Lax'
  }
}

function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)auth-session=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
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
          const user: User = { id: '1', name: 'John Doe', email, role: 'CUSTOMER' }
          set({ user, isAuthenticated: true })
          setAuthCookie(btoa(JSON.stringify({ id: user.id, email: user.email })))
        } finally {
          set({ loading: false })
        }
      },
      logout: () => {
        clearAuthCookie()
        set({ user: null, isAuthenticated: false })
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
        setAuthCookie(btoa(JSON.stringify({ id: user.id, email: user.email })))
      },
      checkAuth: () => {
        const cookie = getAuthCookie()
        if (!cookie) {
          set({ user: null, isAuthenticated: false })
        }
        // If cookie exists, trust the persisted state from zustand-persist
      },
    }),
    { name: 'auth-store' }
  )
)
