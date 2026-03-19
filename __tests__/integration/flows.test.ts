import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Integration tests simulating complete customer journeys.
 * These tests mock fetch and verify that multiple API functions
 * chain together correctly to complete full workflows.
 */

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

import {
  login,
  register,
  getAllProducts,
  getProduct,
  addToCart,
  getCart,
  clearCart,
  createOrder,
  getOrders,
  cancelOrder,
  createPaymentOrder,
  verifyPayment,
  getProfile,
  updateProfile,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '@/lib/api'

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data } as Response
}
function mockError(message: string, status = 400) {
  return { ok: false, status, json: async () => ({ message }) } as Response
}

describe('Integration flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  // ── Auth flow ────────────────────────────────────────────────────────────

  it('registration → login flow', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ message: 'Registered successfully' }))
      .mockResolvedValueOnce(mockOk({ accessToken: 'tok123', user: { id: '1' } }))

    await register('Bob', 'bob@test.com', '9876543210', 'BobPass1')
    const loginData = await login('bob@test.com', 'BobPass1') as { accessToken: string }
    expect(loginData.accessToken).toBe('tok123')
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('login → fetch profile flow', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ accessToken: 'tok456', user: { id: '2' } }))
      .mockResolvedValueOnce(mockOk({ id: '2', name: 'Carol', email: 'carol@test.com' }))

    await login('carol@test.com', 'CarolPass1')
    const profile = await getProfile() as { name: string }
    expect(profile.name).toBe('Carol')
  })

  // ── Product browsing flow ─────────────────────────────────────────────────

  it('browse products → view single product', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ products: [{ id: 'p1', name: 'Mango' }], total: 1 }))
      .mockResolvedValueOnce(mockOk({ id: 'p1', name: 'Mango', price: 150 }))

    const list = await getAllProducts() as { products: { id: string }[] }
    const productId = list.products[0].id
    const detail = await getProduct(productId) as { price: number }
    expect(detail.price).toBe(150)
  })

  // ── Cart flow ─────────────────────────────────────────────────────────────

  it('add to cart → view cart', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ success: true }))
      .mockResolvedValueOnce(mockOk({ items: [{ productId: 'p1', quantity: 2 }] }))

    await addToCart('p1', 2)
    const cart = await getCart() as { items: { productId: string }[] }
    expect(cart.items[0].productId).toBe('p1')
  })

  it('add multiple items → clear cart', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ success: true }))
      .mockResolvedValueOnce(mockOk({ success: true }))
      .mockResolvedValueOnce(mockOk({ success: true }))

    await addToCart('p1', 1)
    await addToCart('p2', 2)
    await clearCart()
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  // ── Order flow ────────────────────────────────────────────────────────────

  it('create order → view orders list', async () => {
    const order = { id: 'o1', status: 'pending', totalAmount: 300 }
    mockFetch
      .mockResolvedValueOnce(mockOk(order))
      .mockResolvedValueOnce(mockOk({ orders: [order] }))

    await createOrder([{ productId: 'p1', quantity: 1 }], '42 High St', 300)
    const orders = await getOrders() as { orders: { id: string }[] }
    expect(orders.orders[0].id).toBe('o1')
  })

  it('create order → cancel order', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ id: 'o2', status: 'pending' }))
      .mockResolvedValueOnce(mockOk({ id: 'o2', status: 'cancelled' }))

    await createOrder([], 'Some address', 0)
    const cancelled = await cancelOrder('o2') as { status: string }
    expect(cancelled.status).toBe('cancelled')
  })

  // ── Payment flow ──────────────────────────────────────────────────────────

  it('create payment order → verify payment', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ id: 'rz_ord_1', amount: 500 }))
      .mockResolvedValueOnce(mockOk({ verified: true }))

    await createPaymentOrder('o1', 500)
    const verify = await verifyPayment({ razorpay_payment_id: 'pay_1' }) as { verified: boolean }
    expect(verify.verified).toBe(true)
  })

  // ── Wishlist flow ─────────────────────────────────────────────────────────

  it('add to wishlist → fetch wishlist → remove from wishlist', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ success: true }))
      .mockResolvedValueOnce(mockOk({ items: [{ id: 'p1' }] }))
      .mockResolvedValueOnce(mockOk({ success: true }))

    await addToWishlist('p1')
    const wl = await getWishlist() as { items: { id: string }[] }
    expect(wl.items).toHaveLength(1)
    await removeFromWishlist('p1')
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  // ── Profile flow ──────────────────────────────────────────────────────────

  it('get profile → update profile', async () => {
    mockFetch
      .mockResolvedValueOnce(mockOk({ id: '1', name: 'Dan', email: 'dan@test.com' }))
      .mockResolvedValueOnce(mockOk({ id: '1', name: 'Daniel', email: 'dan@test.com' }))

    await getProfile()
    const updated = await updateProfile({ name: 'Daniel' }) as { name: string }
    expect(updated.name).toBe('Daniel')
  })

  // ── Error handling in flows ───────────────────────────────────────────────

  it('handles login failure gracefully', async () => {
    mockFetch.mockResolvedValueOnce(mockError('Invalid credentials', 401))
    await expect(login('bad@bad.com', 'wrong')).rejects.toThrow('Invalid credentials')
  })

  it('handles order creation failure', async () => {
    mockFetch.mockResolvedValueOnce(mockError('Insufficient stock', 422))
    await expect(createOrder([{ productId: 'p_out', quantity: 100 }], 'addr', 9999)).rejects.toThrow('Insufficient stock')
  })

  it('payment verification handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(verifyPayment({ razorpay_payment_id: 'pay_bad' })).rejects.toThrow()
  })
})
