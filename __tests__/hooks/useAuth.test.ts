import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true })

// Mock the API module
vi.mock('@/lib/api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
}))

// Mock Zustand auth store
vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    logout: vi.fn(),
    checkAuth: vi.fn(),
    setUser: vi.fn(),
  })),
}))

import * as apiModule from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should expose isAuthenticated from store', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('login: stores tokens and updates store on success', async () => {
    const mockSetUser = vi.fn()
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      logout: vi.fn(),
      checkAuth: vi.fn(),
      setUser: mockSetUser,
    } as ReturnType<typeof useAuthStore>)
    // Also mock getState
    ;(useAuthStore as unknown as { getState: () => { setUser: typeof mockSetUser } }).getState =
      () => ({ setUser: mockSetUser })

    vi.mocked(apiModule.login).mockResolvedValue({
      accessToken: 'access123',
      refreshToken: 'refresh123',
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'CUSTOMER' },
    })

    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.login('test@test.com', 'password')
    })

    expect(apiModule.login).toHaveBeenCalledWith('test@test.com', 'password')
    expect(localStorageMock.getItem('accessToken')).toBe('access123')
    expect(localStorageMock.getItem('refreshToken')).toBe('refresh123')
  })

  it('login: sets error on failure', async () => {
    vi.mocked(apiModule.login).mockRejectedValue(new Error('Invalid credentials'))
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      try {
        await result.current.login('bad@bad.com', 'wrong')
      } catch {
        // expected
      }
    })

    expect(result.current.error).toBe('Invalid credentials')
  })

  it('register: calls api.register with correct args', async () => {
    vi.mocked(apiModule.register).mockResolvedValue({ message: 'Registered' })
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.register('Alice', 'alice@test.com', '1234567890', 'Password1')
    })

    expect(apiModule.register).toHaveBeenCalledWith(
      'Alice', 'alice@test.com', '1234567890', 'Password1'
    )
  })

  it('logout: clears tokens and calls store logout', async () => {
    const mockStoreLogout = vi.fn()
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      logout: mockStoreLogout,
      checkAuth: vi.fn(),
      setUser: vi.fn(),
    } as ReturnType<typeof useAuthStore>)

    vi.mocked(apiModule.logout).mockResolvedValue(new Response())
    localStorageMock.setItem('accessToken', 'token123')
    localStorageMock.setItem('refreshToken', 'refresh123')

    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.logout()
    })

    expect(localStorageMock.getItem('accessToken')).toBeNull()
    expect(localStorageMock.getItem('refreshToken')).toBeNull()
    expect(mockStoreLogout).toHaveBeenCalled()
  })
})
