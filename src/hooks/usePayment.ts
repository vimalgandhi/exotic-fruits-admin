import { useState, useCallback } from 'react'
import * as api from '@/lib/api'

export type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed'

export function usePayment() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Payment error'
    setError(message)
    setPaymentStatus('failed')
    throw err
  }

  const createPaymentOrder = useCallback(
    async (orderId: string, amount: number) => {
      setLoading(true)
      setError(null)
      setPaymentStatus('pending')
      try {
        const data = await api.createPaymentOrder(orderId, amount)
        return data
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const verifyPayment = useCallback(async (paymentData: unknown) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.verifyPayment(paymentData)
      setPaymentStatus('success')
      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPaymentStatus = useCallback(async (paymentId: string) => {
    setLoading(true)
    setError(null)
    try {
      return await api.getPaymentStatus(paymentId)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPayment = useCallback(() => {
    setPaymentStatus('idle')
    setError(null)
  }, [])

  return {
    paymentStatus,
    loading,
    error,
    createPaymentOrder,
    verifyPayment,
    getPaymentStatus,
    resetPayment,
  }
}
