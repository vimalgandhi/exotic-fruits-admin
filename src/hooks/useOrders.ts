import { useState, useCallback } from 'react'
import * as api from '@/lib/api'

export interface Order {
  id: string
  items: unknown[]
  deliveryAddress: string
  totalAmount: number
  status: string
  createdAt: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'An error occurred'
    setError(message)
    throw err
  }

  const getOrders = useCallback(async (page = 1, limit = 10) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getOrders(page, limit) as { orders?: Order[]; data?: Order[] }
      const items = data.orders ?? data.data ?? []
      setOrders(items)
      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getOrder = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await api.getOrder(id)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(
    async (
      cartItems: unknown[],
      deliveryAddress: string,
      totalAmount: number
    ) => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.createOrder(cartItems, deliveryAddress, totalAmount)
        return data
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const cancelOrder = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.cancelOrder(id)
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o))
      )
      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    orders,
    loading,
    error,
    getOrders,
    getOrder,
    createOrder,
    cancelOrder,
  }
}
