import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  createPaymentOrder: vi.fn(),
  verifyPayment: vi.fn(),
  getPaymentStatus: vi.fn(),
}))

import * as apiModule from '@/lib/api'
import { usePayment } from '@/hooks/usePayment'

describe('usePayment hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initial paymentStatus is idle', () => {
    const { result } = renderHook(() => usePayment())
    expect(result.current.paymentStatus).toBe('idle')
    expect(result.current.loading).toBe(false)
  })

  it('createPaymentOrder: creates payment and sets status to pending', async () => {
    vi.mocked(apiModule.createPaymentOrder).mockResolvedValue({ orderId: 'rz_ord_1', amount: 1000 })

    const { result } = renderHook(() => usePayment())
    let data: unknown
    await act(async () => {
      data = await result.current.createPaymentOrder('o1', 1000)
    })

    expect(data).toEqual({ orderId: 'rz_ord_1', amount: 1000 })
    expect(apiModule.createPaymentOrder).toHaveBeenCalledWith('o1', 1000)
  })

  it('verifyPayment: verifies and sets status to success', async () => {
    vi.mocked(apiModule.verifyPayment).mockResolvedValue({ verified: true })

    const { result } = renderHook(() => usePayment())
    await act(async () => {
      await result.current.verifyPayment({ razorpay_payment_id: 'pay_1' })
    })

    expect(result.current.paymentStatus).toBe('success')
    expect(apiModule.verifyPayment).toHaveBeenCalledWith({ razorpay_payment_id: 'pay_1' })
  })

  it('verifyPayment: sets status to failed on error', async () => {
    vi.mocked(apiModule.verifyPayment).mockRejectedValue(new Error('Verification failed'))

    const { result } = renderHook(() => usePayment())
    await act(async () => {
      try {
        await result.current.verifyPayment({})
      } catch {
        // expected
      }
    })

    expect(result.current.paymentStatus).toBe('failed')
    expect(result.current.error).toBe('Verification failed')
  })
})
