'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { Package } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-success',
  FAILED: 'bg-red-100 text-error',
  DELIVERED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { orders, loading, error, fetchOrders } = useOrders()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, router, fetchOrders])

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-navy">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-error">{error}</p>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Start shopping to see your orders here."
          actionLabel="Browse Products"
          onAction={() => router.push('/products')}
          icon={<Package size={64} className="text-gray-300" />}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id || order._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-navy">{order.id || order._id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-navy">
                    {formatCurrency(order.total || order.totalAmount || 0)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-sm font-medium text-gray-500">Items:</p>
                  <ul className="space-y-1">
                    {order.items.map((item: any, idx: number) => {
                      const name =
                        item.product?.name ||
                        item.name ||
                        item.productName ||
                        'Product'
                      const price =
                        item.product?.price || item.price || 0
                      const qty = item.quantity || 1
                      return (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {name} × {qty}
                          </span>
                          <span className="font-medium text-navy">
                            {formatCurrency(price * qty)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
