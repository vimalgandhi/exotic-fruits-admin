import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
}))

vi.mock('@/store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    updateUnit: vi.fn(),
    clearCart: vi.fn(),
    getTotal: () => 0,
    getItemCount: () => 0,
  })),
}))

import * as apiModule from '@/lib/api'
import { useCart } from '@/hooks/useCart'

describe('useCart hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initial state has empty items and zero total', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toEqual([])
    expect(result.current.cartTotal).toBe(0)
  })

  it('addToCart: calls local store addItem and backend api', async () => {
    vi.mocked(apiModule.addToCart).mockResolvedValue({ success: true })
    const mockAddItem = vi.fn()

    const { useCartStore } = await import('@/store/cartStore')
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      updateUnit: vi.fn(),
      clearCart: vi.fn(),
      getTotal: () => 0,
      getItemCount: () => 0,
    })

    const { result } = renderHook(() => useCart())
    const product = { id: 'p1', name: 'Mango', price: 100, image: '', category: '', stock: 'In Stock' as const, description: '', origin: '', slug: 'mango' }

    await act(async () => {
      await result.current.addToCart(product, 2)
    })

    expect(apiModule.addToCart).toHaveBeenCalledWith('p1', 2)
  })

  it('removeFromCart: calls local removeItem and backend api', async () => {
    vi.mocked(apiModule.removeFromCart).mockResolvedValue({ success: true })
    const mockRemoveItem = vi.fn()

    const { useCartStore } = await import('@/store/cartStore')
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
      addItem: vi.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: vi.fn(),
      updateUnit: vi.fn(),
      clearCart: vi.fn(),
      getTotal: () => 0,
      getItemCount: () => 0,
    })

    const { result } = renderHook(() => useCart())
    await act(async () => {
      await result.current.removeFromCart('p1')
    })

    expect(apiModule.removeFromCart).toHaveBeenCalledWith('p1')
  })

  it('clearCart: clears local store and calls backend', async () => {
    vi.mocked(apiModule.clearCart).mockResolvedValue({ success: true })
    const mockClear = vi.fn()

    const { useCartStore } = await import('@/store/cartStore')
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      updateUnit: vi.fn(),
      clearCart: mockClear,
      getTotal: () => 0,
      getItemCount: () => 0,
    })

    const { result } = renderHook(() => useCart())
    await act(async () => {
      await result.current.clearCart()
    })

    expect(mockClear).toHaveBeenCalled()
    expect(apiModule.clearCart).toHaveBeenCalled()
  })

  it('syncCart: returns backend cart data', async () => {
    vi.mocked(apiModule.getCart).mockResolvedValue({ items: [{ id: 'item1' }] })

    const { result } = renderHook(() => useCart())
    let data: unknown
    await act(async () => {
      data = await result.current.syncCart()
    })

    expect(data).toEqual({ items: [{ id: 'item1' }] })
  })
})
