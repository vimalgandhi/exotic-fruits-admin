import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { loginUser, registerUser, logoutUser as logoutAPI } from '@/lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  hydrated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>
  logout: () => Promise<void>
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
      hydrated: false,
      login: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const data = await loginUser(email, password)
          const user: User = data.user
          set({ user, isAuthenticated: true })
          setAuthCookie(btoa(JSON.stringify({ id: user.id, email: user.email })))
        } finally {
          set({ loading: false })
        }
      },
      register: async (
        name: string,
        email: string,
        phone: string,
        password: string,
      ) => {
        set({ loading: true })
        try {
          const data = await registerUser(name, email, phone, password)
          const user: User = data.user
          set({ user, isAuthenticated: true })
          setAuthCookie(btoa(JSON.stringify({ id: user.id, email: user.email })))
        } finally {
          set({ loading: false })
        }
      },
      logout: async () => {
        try {
          await logoutAPI()
        } catch (error) {
          console.error('Logout error:', error)
        }
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
        // Mark as hydrated after checking auth
        set({ hydrated: true })
      },
    }),
    { 
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        // After hydration from localStorage, verify with cookie
        if (state) {
          const cookie = getAuthCookie()
          if (!cookie && state.isAuthenticated) {
            // Cookie missing but store says authenticated - logout
            state.user = null
            state.isAuthenticated = false
          }
          state.hydrated = true
        }
      }
    }
  )
)
