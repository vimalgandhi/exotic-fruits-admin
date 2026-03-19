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

import { createPaymentOrder, verifyPayment, getPaymentStatus } from '@/lib/api'

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data } as Response
}

describe('Payments API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.setItem('accessToken', 'test-token')
  })

  it('createPaymentOrder: sends POST with orderId and amount', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'rz_ord_1' }))

    await createPaymentOrder('o1', 500)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/payments/create-order')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ orderId: 'o1', amount: 500 })
  })

  it('verifyPayment: sends payment data to verify endpoint', async () => {
    const paymentData = { razorpay_payment_id: 'pay_1', razorpay_order_id: 'ord_1', razorpay_signature: 'sig' }
    mockFetch.mockResolvedValueOnce(mockOk({ verified: true }))

    const result = await verifyPayment(paymentData) as { verified: boolean }
    expect(result.verified).toBe(true)
    expect(mockFetch.mock.calls[0][0]).toContain('/payments/verify-payment')
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual(paymentData)
  })

  it('getPaymentStatus: fetches payment by id', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'pay_1', status: 'captured' }))

    const result = await getPaymentStatus('pay_1') as { status: string }
    expect(result.status).toBe('captured')
    expect(mockFetch.mock.calls[0][0]).toContain('/payments/pay_1')
  })

  it('createPaymentOrder: throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid order' }),
    } as Response)

    await expect(createPaymentOrder('invalid', 0)).rejects.toThrow('Invalid order')
  })

  it('verifyPayment: throws on verification failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Signature mismatch' }),
    } as Response)

    await expect(verifyPayment({ razorpay_payment_id: 'bad' })).rejects.toThrow('Signature mismatch')
  })
})
