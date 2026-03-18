'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Add some exotic fruits to your cart to get started."
          actionLabel="Browse Products"
          onAction={() => window.location.assign('/products')}
          icon={<ShoppingBag size={64} className="text-gray-300" />}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-navy">Shopping Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-navy">
                    Product
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-navy">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-navy">
                    Total
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.product.id}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-navy">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.product.price)} each
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.product.id, item.quantity - 1)
                            } else {
                              removeItem(item.product.id)
                              toast.info(`${item.product.name} removed from cart`)
                            }
                          }}
                          className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-navy">
                      {formatCurrency(item.product.price * item.quantity)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          removeItem(item.product.id)
                          toast.info(`${item.product.name} removed`)
                        }}
                        className="text-gray-400 hover:text-error"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-80">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-navy">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between font-bold text-navy">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {total >= 999
                ? '✓ Free delivery included'
                : `Add ${formatCurrency(999 - total)} more for free delivery`}
            </p>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-semibold text-white transition-colors hover:bg-yellow-600"
            >
              Checkout
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="mt-3 flex w-full items-center justify-center text-sm text-gray-600 hover:text-navy"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
