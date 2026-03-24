'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateItem, total } = useCart()

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
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-4xl font-bold text-navy-900">Shopping Cart</h1>
        <p className="mb-8 text-navy-600">Review your items and proceed to checkout</p>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id || `${item.product.id}-${item.selectedUnit?.unitId || 'base'}`}
                  className="overflow-hidden rounded-lg border-2 border-navy-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold-300"
                >
                  <div className="grid gap-4 p-4 md:grid-cols-2">
                    {/* Left: Product Image */}
                    <div className="flex items-center justify-center">
                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-navy-200 to-navy-300 shadow-md">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="mb-2 text-lg font-bold text-navy-900">
                          {item.product.name}
                        </h3>

                        {/* Pricing Details */}
                        <div className="mb-4 space-y-2 rounded-lg bg-navy-50 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-navy-600">
                              Unit Price
                            </span>
                            <span className="text-sm font-bold text-navy-900">
                              {formatCurrency(
                                item.unitPrice ||
                                  item.selectedUnit?.afterDiscountPrice ||
                                  item.product.price ||
                                  0
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-xs font-medium text-navy-600">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-2 rounded-lg border-2 border-navy-200 bg-white p-1">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateItem(
                                    item.product.id,
                                    item.quantity - 1,
                                    item.selectedUnit
                                  )
                                } else {
                                  removeItem(item.product.id)
                                  toast.info(`${item.product.name} removed from cart`)
                                }
                              }}
                              className="rounded-md p-1 hover:bg-navy-100 transition"
                            >
                              <Minus size={16} className="text-navy-600" />
                            </button>
                            <span className="min-w-[2rem] text-center font-semibold text-navy-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItem(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedUnit
                                )
                              }
                              className="rounded-md p-1 hover:bg-navy-100 transition"
                            >
                              <Plus size={16} className="text-navy-600" />
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="rounded-lg bg-gradient-to-r from-success-50 to-success-100 p-3">
                          <p className="text-xs font-medium text-success-700">
                            Item Total
                          </p>
                          <p className="mt-1 text-xl font-bold text-success-600">
                            {formatCurrency(
                              item.totalPrice ||
                                (item.unitPrice ||
                                  item.selectedUnit?.afterDiscountPrice ||
                                  item.product.price ||
                                  0) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          removeItem(item.product.id)
                          toast.info(`${item.product.name} removed`)
                        }}
                        className="mt-4 flex items-center justify-center gap-2 btn-danger"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="sticky top-4 rounded-lg border-2 border-navy-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-navy-900">
                Order Summary
              </h2>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={
                      item.id ||
                      `${item.product.id}-${item.selectedUnit?.unitId || 'base'}`
                    }
                    className="flex justify-between text-sm text-navy-600"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-navy-900">
                      {formatCurrency(
                        item.totalPrice ||
                          (item.unitPrice ||
                            item.selectedUnit?.afterDiscountPrice ||
                            item.product.price ||
                            0) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-4 border-navy-200" />
              <div className="mb-2 flex justify-between font-bold text-navy-900">
                <span>Total</span>
                <span className="text-2xl text-success-600">
                  {formatCurrency(total)}
                </span>
              </div>
              <p className="mb-6 text-xs text-navy-500">
                {total >= 999
                  ? '✓ Free delivery included'
                  : `Add ${formatCurrency(999 - total)} more for free delivery`}
              </p>
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 btn-secondary"
              >
                Checkout
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center text-sm text-navy-600 hover:text-navy-900 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
