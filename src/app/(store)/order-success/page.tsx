'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Clock } from 'lucide-react'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'ORD-XXXXXXXX'

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle size={80} className="text-success" />
      </div>

      <h1 className="text-3xl font-bold text-navy-600">Order Placed!</h1>
      <p className="mt-3 text-gray-600">
        Thank you for your order. We&#39;re preparing your exotic fruits for
        delivery!
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4">
          <Package size={20} className="text-gold-500" />
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold text-navy-600">{orderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4">
          <Clock size={20} className="text-gold-500" />
          <div>
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-bold text-navy-600">2 – 4 Business Days</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        A confirmation email has been sent to your registered email address.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/orders"
          className="btn-primary"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-navy-600 px-6 py-3 font-semibold text-navy-600 transition-colors hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
