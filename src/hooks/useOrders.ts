import { useState, useCallback } from 'react'
import { getOrders, getOrder, createOrder } from '@/lib/api'

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrders(page)
      setOrders(Array.isArray(data) ? data : data?.orders || [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch orders'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getOrderDetail = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrder(id)
      return data
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch order'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const create = useCallback(
    async (
      items: Record<string, unknown>[],
      deliveryAddress: string,
      totalAmount: number,
    ) => {
      try {
        setLoading(true)
        setError(null)
        const data = await createOrder(items, deliveryAddress, totalAmount)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create order'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { orders, loading, error, fetchOrders, getOrderDetail, create }
}
