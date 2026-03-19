import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
}))

import * as apiModule from '@/lib/api'
import { useProfile } from '@/hooks/useProfile'

describe('useProfile hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initial profile is null', () => {
    const { result } = renderHook(() => useProfile())
    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('getProfile: fetches and stores profile', async () => {
    const mockProfile = { id: '1', name: 'Alice', email: 'alice@test.com' }
    vi.mocked(apiModule.getProfile).mockResolvedValue(mockProfile)

    const { result } = renderHook(() => useProfile())
    await act(async () => {
      await result.current.getProfile()
    })

    expect(result.current.profile).toEqual(mockProfile)
  })

  it('updateProfile: updates profile state', async () => {
    const updated = { id: '1', name: 'Alice Updated', email: 'alice@test.com' }
    vi.mocked(apiModule.updateProfile).mockResolvedValue(updated)

    const { result } = renderHook(() => useProfile())
    await act(async () => {
      await result.current.updateProfile({ name: 'Alice Updated' })
    })

    expect(result.current.profile).toEqual(updated)
    expect(apiModule.updateProfile).toHaveBeenCalledWith({ name: 'Alice Updated' })
  })

  it('changePassword: calls API with correct passwords', async () => {
    vi.mocked(apiModule.changePassword).mockResolvedValue({ message: 'Password changed' })

    const { result } = renderHook(() => useProfile())
    let res: unknown
    await act(async () => {
      res = await result.current.changePassword('oldPass1', 'NewPass1')
    })

    expect(res).toEqual({ message: 'Password changed' })
    expect(apiModule.changePassword).toHaveBeenCalledWith('oldPass1', 'NewPass1')
  })
})
