import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

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

import { login, register, logout, refreshToken } from '@/lib/api'

function mockResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  } as Response
}

describe('Authentication API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('login: sends POST to /auth/login with credentials', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ accessToken: 'token', user: { id: '1' } }))

    const result = await login('test@test.com', 'password123') as { accessToken: string }
    expect(result.accessToken).toBe('token')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      })
    )
  })

  it('login: throws error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ message: 'Invalid credentials' }, false, 401))

    await expect(login('bad@bad.com', 'wrong')).rejects.toThrow('Invalid credentials')
  })

  it('register: sends POST with name, email, phone, password', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ message: 'User created' }))

    await register('Alice', 'alice@test.com', '1234567890', 'Pass1word!')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', email: 'alice@test.com', phone: '1234567890', password: 'Pass1word!' }),
      })
    )
  })

  it('logout: sends POST to /auth/logout', async () => {
    localStorageMock.setItem('accessToken', 'token123')
    mockFetch.mockResolvedValueOnce(new Response())

    await logout()
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('refreshToken: sends token in request body', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ accessToken: 'newtoken' }))

    const result = await refreshToken('refresh123') as { accessToken: string }
    expect(result.accessToken).toBe('newtoken')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh-token'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'refresh123' }),
      })
    )
  })
})
