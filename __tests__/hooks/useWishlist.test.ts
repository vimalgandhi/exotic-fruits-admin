import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  getWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), info: vi.fn() },
}))

vi.mock('@/store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    toggleItem: vi.fn(),
    isInWishlist: vi.fn(() => false),
    clearWishlist: vi.fn(),
  })),
}))

import * as apiModule from '@/lib/api'
import { useWishlist } from '@/hooks/useWishlist'

const mockProduct = {
  id: 'p1',
  name: 'Lychee',
  slug: 'lychee',
  price: 200,
  image: '',
  category: 'tropical',
  stock: 'In Stock' as const,
  description: '',
  origin: '',
}

describe('useWishlist hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initial wishlistCount is 0', () => {
    const { result } = renderHook(() => useWishlist())
    expect(result.current.wishlistCount).toBe(0)
  })

  it('addToWishlist: calls local addItem and backend api', async () => {
    vi.mocked(apiModule.addToWishlist).mockResolvedValue({ success: true })
    const mockAddItem = vi.fn()

    const { useWishlistStore } = await import('@/store/wishlistStore')
    vi.mocked(useWishlistStore).mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: vi.fn(),
      toggleItem: vi.fn(),
      isInWishlist: () => false,
      clearWishlist: vi.fn(),
    })

    const { result } = renderHook(() => useWishlist())
    await act(async () => {
      await result.current.addToWishlist(mockProduct)
    })

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct)
    expect(apiModule.addToWishlist).toHaveBeenCalledWith('p1')
  })

  it('removeFromWishlist: calls local removeItem and backend api', async () => {
    vi.mocked(apiModule.removeFromWishlist).mockResolvedValue({ success: true })
    const mockRemoveItem = vi.fn()

    const { useWishlistStore } = await import('@/store/wishlistStore')
    vi.mocked(useWishlistStore).mockReturnValue({
      items: [],
      addItem: vi.fn(),
      removeItem: mockRemoveItem,
      toggleItem: vi.fn(),
      isInWishlist: () => true,
      clearWishlist: vi.fn(),
    })

    const { result } = renderHook(() => useWishlist())
    await act(async () => {
      await result.current.removeFromWishlist(mockProduct)
    })

    expect(mockRemoveItem).toHaveBeenCalledWith('p1')
    expect(apiModule.removeFromWishlist).toHaveBeenCalledWith('p1')
  })

  it('fetchWishlist: fetches from backend and returns data', async () => {
    vi.mocked(apiModule.getWishlist).mockResolvedValue({ items: [{ id: 'w1' }] })

    const { result } = renderHook(() => useWishlist())
    let data: unknown
    await act(async () => {
      data = await result.current.fetchWishlist()
    })

    expect(data).toEqual({ items: [{ id: 'w1' }] })
  })
})
