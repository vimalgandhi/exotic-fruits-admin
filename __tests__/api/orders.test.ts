import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

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

import { getOrders, getOrder, createOrder, cancelOrder } from '@/lib/api'

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data } as Response
}

describe('Orders API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.setItem('accessToken', 'test-token')
  })

  it('getOrders: fetches orders list with pagination', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ orders: [], total: 0 }))

    await getOrders(2, 5)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/orders')
    expect(url).toContain('page=2')
    expect(url).toContain('limit=5')
  })

  it('getOrder: fetches single order by id', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'o1', status: 'pending' }))

    const result = await getOrder('o1') as { id: string; status: string }
    expect(result.id).toBe('o1')
    expect(mockFetch.mock.calls[0][0]).toContain('/orders/o1')
  })

  it('createOrder: sends POST with items, address and total', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'o2' }))

    const items = [{ productId: 'p1', quantity: 1 }]
    await createOrder(items, '123 Street', 250)

    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/orders')
    expect(options.method).toBe('POST')
    const body = JSON.parse(options.body)
    expect(body.items).toEqual(items)
    expect(body.deliveryAddress).toBe('123 Street')
    expect(body.totalAmount).toBe(250)
  })

  it('cancelOrder: sends PUT with cancelled status', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'o1', status: 'cancelled' }))

    await cancelOrder('o1')
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/orders/o1')
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body)).toEqual({ status: 'cancelled' })
  })

  it('getOrders: throws error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Server error' }),
    } as Response)

    await expect(getOrders()).rejects.toThrow('Server error')
  })
})
