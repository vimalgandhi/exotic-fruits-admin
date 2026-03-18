'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { Package } from 'lucide-react'
import { Order } from '@/types'

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    items: [
      {
        product: {
          id: '1',
          name: 'Dragon Fruit',
          slug: 'dragon-fruit',
          price: 299,
          image: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400',
          category: 'Tropical',
          stock: 'In Stock',
          description: '',
          origin: 'Vietnam',
        },
        quantity: 2,
      },
    ],
    total: 598,
    status: 'PAID',
    createdAt: '2024-03-15T10:00:00Z',
  },
]

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-success',
  FAILED: 'bg-red-100 text-error',
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-navy">My Orders</h1>

      {SAMPLE_ORDERS.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Start shopping to see your orders here."
          actionLabel="Browse Products"
          onAction={() => router.push('/products')}
          icon={<Package size={64} className="text-gray-300" />}
        />
      ) : (
        <div className="space-y-4">
          {SAMPLE_ORDERS.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-navy">{order.id}</p>
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
                    {formatCurrency(order.total)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-2 text-sm font-medium text-gray-500">Items:</p>
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-navy">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
