'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required').max(6),
  paymentMethod: z.enum(['cod', 'upi', 'card'], {
    required_error: 'Select a payment method',
  }),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { setOrderData, setOrderId, setPaymentStatus } = useCheckoutStore()
  const total = getTotal()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout')
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
    },
  })

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setOrderData(data)
      const orderId = `ORD-${Date.now()}`
      setOrderId(orderId)
      setPaymentStatus('PAID')
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/order-success?orderId=${orderId}`)
    } catch {
      toast.error('Failed to place order. Please try again.')
    }
  }

  if (!isAuthenticated || items.length === 0) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Lock size={20} className="text-gold" />
        <h1 className="text-3xl font-bold text-navy">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Form */}
          <div className="flex-1 space-y-6">
            {/* Billing Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-navy">
                Billing Address
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    {...register('firstName')}
                    className="input-field"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-error">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    {...register('lastName')}
                    className="input-field"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-error">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="input-field"
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-error">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-error">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    {...register('city')}
                    className="input-field"
                    placeholder="Mumbai"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-error">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    {...register('state')}
                    className="input-field"
                    placeholder="Maharashtra"
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-error">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    {...register('pincode')}
                    className="input-field"
                    placeholder="400001"
                    maxLength={6}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-error">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-navy">
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery' },
                  { value: 'upi', label: '📱 UPI Payment' },
                  { value: 'card', label: '💳 Credit / Debit Card' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register('paymentMethod')}
                      className="accent-navy"
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
                {errors.paymentMethod && (
                  <p className="text-xs text-error">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:w-80">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-navy">
                Order Summary
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-navy">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-lg bg-gold py-3 font-bold text-white transition-colors hover:bg-yellow-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
