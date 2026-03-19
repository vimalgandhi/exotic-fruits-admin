import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  getOrders: vi.fn(),
  getOrder: vi.fn(),
  createOrder: vi.fn(),
  cancelOrder: vi.fn(),
}))

import * as apiModule from '@/lib/api'
import { useOrders } from '@/hooks/useOrders'

describe('useOrders hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initial state has empty orders array', () => {
    const { result } = renderHook(() => useOrders())
    expect(result.current.orders).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('getOrders: fetches orders and updates state', async () => {
    const mockOrders = [
      { id: 'o1', items: [], deliveryAddress: 'Addr', totalAmount: 500, status: 'pending', createdAt: '2024-01-01' },
    ]
    vi.mocked(apiModule.getOrders).mockResolvedValue({ orders: mockOrders })

    const { result } = renderHook(() => useOrders())
    await act(async () => {
      await result.current.getOrders()
    })

    expect(result.current.orders).toEqual(mockOrders)
    expect(apiModule.getOrders).toHaveBeenCalledWith(1, 10)
  })

  it('getOrder: returns single order by id', async () => {
    const mockOrder = { id: 'o1', status: 'delivered' }
    vi.mocked(apiModule.getOrder).mockResolvedValue(mockOrder)

    const { result } = renderHook(() => useOrders())
    let order: unknown
    await act(async () => {
      order = await result.current.getOrder('o1')
    })

    expect(order).toEqual(mockOrder)
    expect(apiModule.getOrder).toHaveBeenCalledWith('o1')
  })

  it('createOrder: creates an order with correct params', async () => {
    vi.mocked(apiModule.createOrder).mockResolvedValue({ id: 'o2', status: 'pending' })

    const { result } = renderHook(() => useOrders())
    const cartItems = [{ productId: 'p1', quantity: 2 }]
    let newOrder: unknown

    await act(async () => {
      newOrder = await result.current.createOrder(cartItems, '123 Main St', 400)
    })

    expect(newOrder).toEqual({ id: 'o2', status: 'pending' })
    expect(apiModule.createOrder).toHaveBeenCalledWith(cartItems, '123 Main St', 400)
  })

  it('cancelOrder: cancels order and updates local state', async () => {
    vi.mocked(apiModule.cancelOrder).mockResolvedValue({ id: 'o1', status: 'cancelled' })

    const { result } = renderHook(() => useOrders())
    await act(async () => {
      await result.current.cancelOrder('o1')
    })

    expect(apiModule.cancelOrder).toHaveBeenCalledWith('o1')
  })
})
