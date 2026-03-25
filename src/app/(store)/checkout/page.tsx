'use client'

import { useEffect, useState } from 'react'
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

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void
    }
  }
}

// Promise-based script loader - ensures script is fully loaded before use
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)

  // Load Razorpay script on component mount
  useEffect(() => {
    const initRazorpay = async () => {
      const loaded = await loadRazorpayScript()
      setIsRazorpayReady(loaded)
      if (!loaded) {
        console.warn('⚠️ Razorpay script failed to load - card payment will not work')
      }
    }
    
    initRazorpay()
  }, [])

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
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
    },
  })

  // Handle Razorpay Payment
  const handleRazorpayPayment = async (data: CheckoutForm) => {
    try {
      // Ensure Razorpay script is loaded
      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript()
        if (!loaded) {
          throw new Error('Failed to load Razorpay. Please check your internet connection and try again.')
        }
      }

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        console.error('❌ Razorpay key not configured in environment')
        throw new Error('Payment gateway key is not configured. Please contact support.')
      }
      const deliveryAddress = `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state} - ${data.pincode}`
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.selectedUnit
          ? item.selectedUnit.afterDiscountPrice
          : item.product.price,
        selectedUnit: item.selectedUnit,
      }))


      // Razorpay expects amount in PAISE (not rupees)
      const amountInPaise = Math.round(total * 100)

      // Generate a temporary reference ID for this payment attempt
      const paymentReference = `PAY-${Date.now()}`
      
      // Normalize phone for Razorpay (only digits)
      const normalizedPhone = data.phone.replace(/\D/g, '')
      
      // Create Razorpay order (payment gateway order, not business order)
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          orderId: paymentReference,
          email: data.email,
          phone: normalizedPhone,
          name: `${data.firstName} ${data.lastName}`,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        console.error('❌ Razorpay API Error:', responseData)
        const errorMsg = responseData.error || responseData.message || JSON.stringify(responseData)
        throw new Error(`Failed to initiate payment: ${errorMsg}`)
      }

      
      const razorpayOrderId = responseData.orderId || responseData.order_id || responseData.id
      if (!razorpayOrderId) {
        console.error('❌ No order ID in response:', responseData)
        throw new Error('Payment gateway returned invalid response. No order ID found.')
      }
      

      // Use key from response or fallback to env
      const razorpayKey = responseData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) {
        throw new Error('Razorpay key not available')
      }

      // Open Razorpay checkout
      // Use amount and currency from Razorpay API response (not recalculated)
      const options = {
        key: razorpayKey,
        amount: responseData.amount, // From Razorpay API response
        currency: responseData.currency || 'INR', // From Razorpay API response
        order_id: razorpayOrderId,
        name: 'Exotic Fruits',
        description: `Payment for order at Exotic Fruits`,
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: normalizedPhone,
        },
        theme: {
          color: '#1A2B4B',
        },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          setIsProcessing(true)
          try {
            const orderItems = items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.selectedUnit
                ? item.selectedUnit.afterDiscountPrice
                : item.product.price,
              selectedUnit: item.selectedUnit,
            }))

            // Verify payment AND create order in backend
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                customerDetails: {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  phone: data.phone,
                  deliveryAddress,
                },
                orderItems,
                total,
              }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              console.error('❌ Verification API error:', verifyData)
              throw new Error(verifyData.message || verifyData.error || 'Payment verification failed')
            }

            if (!verifyData.verified) {
              console.error('❌ Payment signature invalid:', verifyData)
              throw new Error('Payment signature verification failed')
            }
            const orderId = verifyData.orderId

            setOrderData(data)
            setOrderId(orderId)
            setPaymentStatus('PAID')
            
            clearCart()
            
            toast.success('Payment successful! Order placed!')
            
            router.push(`/order-success?orderId=${orderId}`)
          } catch (error) {
            console.error('❌ Verification error:', error)
            console.error('❌ Full error object:', error)
            if (error instanceof Error) {
              console.error('❌ Error message:', error.message)
              console.error('❌ Error stack:', error.stack)
            }
            toast.error(
              error instanceof Error
                ? error.message
                : 'Payment verification failed. Please contact support.',
            )
            setIsProcessing(false)
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      
    } catch (error) {
      console.error('❌ Razorpay Error:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Payment initialization failed'
      
      console.error('Full error object:', error)
      console.error('Error type:', typeof error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'N/A')
      
      toast.error(errorMessage)
      setIsProcessing(false)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setIsProcessing(true)

      // If card payment, use Razorpay
      if (data.paymentMethod === 'card') {
        await handleRazorpayPayment(data)
      } else {
        // For COD and UPI, create order directly
        const deliveryAddress = `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state} - ${data.pincode}`
        const orderItems = items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.selectedUnit
            ? item.selectedUnit.afterDiscountPrice
            : item.product.price,
          selectedUnit: item.selectedUnit,
        }))

        // Call order creation API with COD/UPI details
        try {
          const res = await fetch('/api/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?.id,
              customerDetails: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                deliveryAddress,
              },
              orderItems,
              total,
              paymentMethod: data.paymentMethod,
              paymentStatus: 'PENDING',
            }),
          })

          const orderData = await res.json()

          if (!res.ok) {
            console.error('❌ Backend error:', orderData)
            throw new Error(orderData.message || 'Failed to create order')
          }

          const orderId = orderData.orderId || orderData._id
          
          setOrderData(data)
          setOrderId(orderId)
          setPaymentStatus('PENDING')
          
          clearCart()
          
          toast.success('Order placed successfully!')
          router.push(`/order-success?orderId=${orderId}`)
        } catch (error) {
          console.error('❌ Order creation failed:', error);
          if (error instanceof Error) {
            console.error('❌ Error message:', error.message)
          }
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to create order. Please try again.'
          )
          throw error
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
        ? error 
        : 'Failed to place order'
      
      toast.error(`${errorMessage}. Please try again.`)
      console.error('Order submission error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated || items.length === 0) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Lock size={20} className="text-gold-500" />
        <h1 className="text-3xl font-bold text-navy-600">Secure Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Form */}
          <div className="flex-1 space-y-6">
            {/* Billing Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-navy-600">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
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
                    <p className="mt-1 text-xs text-error-500">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-600">
                  Payment Method
                </h2>
                {!isRazorpayReady && (
                  <span className="text-xs text-amber-600">Loading payment gateway...</span>
                )}
              </div>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery' },
                  { value: 'upi', label: '📱 UPI Payment' },
                  { value: 'card', label: '💳 Credit / Debit Card', disabled: !isRazorpayReady },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 ${
                      method.disabled ? 'opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      disabled={method.disabled}
                      {...register('paymentMethod')}
                      className="accent-navy-600"
                    />
                    <span className={`text-sm font-medium ${method.disabled ? 'text-gray-500' : ''}`}>
                      {method.label}
                      {method.disabled && ' (Loading)'}
                    </span>
                  </label>
                ))}
                {errors.paymentMethod && (
                  <p className="text-xs text-error-500">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:w-80">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-navy-600">
                Order Summary
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id || `${item.product.id}-${item.selectedUnit?.unitId || 'base'}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        item.totalPrice ||
                        (item.unitPrice || item.selectedUnit?.afterDiscountPrice || item.product.price || 0) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-navy-600">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isProcessing}
                className="mt-6 w-full btn-secondary"
              >
                {isSubmitting || isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
