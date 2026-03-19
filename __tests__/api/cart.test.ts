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

import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/api'

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data } as Response
}

describe('Cart API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.setItem('accessToken', 'test-token')
  })

  it('getCart: sends GET to /cart', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ items: [] }))

    const result = await getCart() as { items: unknown[] }
    expect(result.items).toEqual([])
    expect(mockFetch.mock.calls[0][0]).toContain('/cart')
  })

  it('addToCart: sends POST with productId and quantity', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ success: true }))

    await addToCart('p1', 3)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/cart/add')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ productId: 'p1', quantity: 3 })
  })

  it('updateCartItem: sends PUT with quantity', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ success: true }))

    await updateCartItem('item1', 5)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/cart/item1')
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body)).toEqual({ quantity: 5 })
  })

  it('removeFromCart: sends DELETE request', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ success: true }))

    await removeFromCart('item1')
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/cart/item1')
    expect(options.method).toBe('DELETE')
  })

  it('clearCart: sends DELETE to /cart/clear', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ success: true }))

    await clearCart()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/cart/clear')
    expect(options.method).toBe('DELETE')
  })
})
