import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

export const runtime = 'nodejs'

type CustomerDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
  deliveryAddress: string
}

type OrderItem = {
  productId: number
  quantity: number
  price: number
  selectedUnit: {
    unitId?: string
    unitName?: string
    afterDiscountPrice?: number
  }
}

type VerifyRequest = {
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  userId?: number
  customerDetails?: CustomerDetails
  orderItems?: OrderItem[]
  total?: number
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      customerDetails,
      orderItems,
      total,
    } = (await request.json()) as VerifyRequest

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ Missing payment details', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      return NextResponse.json(
        { verified: false, message: 'Missing payment details' },
        { status: 400 },
      )
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      console.error('❌ Razorpay key secret not found')
      return NextResponse.json(
        { verified: false, message: 'Server configuration error' },
        { status: 500 },
      )
    }

    const message = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = createHmac('sha256', secret)
      .update(message)
      .digest('hex')

    // Use timingSafeEqual to prevent timing attacks
    let isValidSignature = false
    try {
      isValidSignature = timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      )
    } catch (e) {
      // timingSafeEqual throws if lengths don't match
      console.error('❌ Signature length mismatch')
      isValidSignature = false
    }


    if (!isValidSignature) {
      console.error('❌ Invalid payment signature')
      return NextResponse.json(
        {
          verified: false,
          message: 'Invalid payment signature',
        },
        { status: 400 },
      )
    }

    // Payment is verified successfully

    // Create order if customer details and order items are provided
    if (customerDetails && orderItems && total) {
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const createOrderRes = await fetch(`${backendUrl}/orders/payment/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            customerDetails,
            orderItems,
            total,
            paymentMethod: 'card',
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
          }),
        })

        let orderData
        try {
          const responseText = await createOrderRes.text()
          orderData = responseText ? JSON.parse(responseText) : {}
        } catch (parseError) {
          console.error('❌ Failed to parse backend response:', parseError)
          orderData = { error: 'Invalid response format' }
        }


        if (!createOrderRes.ok) {
          console.error('❌ Backend order creation failed')
          console.error('Status:', createOrderRes.status)
          console.error('Response:', orderData)
          console.error('Request payload was:', JSON.stringify({
            customerDetails: customerDetails ? { ...customerDetails, phone: '***' } : null,
            orderItemsCount: orderItems?.length,
            total,
            paymentMethod: 'card',
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpay_payment_id?.substring(0, 10) + '...',
            razorpayOrderId: razorpay_order_id,
          }, null, 2))
          
          // Return the payment verification as successful anyway since payment was verified
          // The order creation can be retried
          return NextResponse.json(
            {
              verified: true,
              message: 'Payment verified successfully (order creation will be retried)',
              razorpay_payment_id,
              razorpay_order_id,
              orderId: `PAY-${razorpay_payment_id}`, // Temporary ID
              orderCreationStatus: 'pending',
              backendError: `Backend returned ${createOrderRes.status}`,
            },
            { status: 200 },
          )
        }

        const orderId = orderData.orderId || orderData._id || orderData.id

        return NextResponse.json(
          {
            verified: true,
            message: 'Payment verified and order created',
            razorpay_payment_id,
            razorpay_order_id,
            orderId,
          },
          { status: 200 },
        )
      } catch (error) {
        console.error('❌ Error during order creation:', error)
        console.error('Error details:', error instanceof Error ? error.message : String(error))
        
        // Return success for payment verification even if order creation fails
        // This prevents the payment from being lost
        return NextResponse.json(
          {
            verified: true,
            message: 'Payment verified (order pending)',
            razorpay_payment_id,
            razorpay_order_id,
            orderId: `PAY-${razorpay_payment_id}`,
            orderCreationStatus: 'pending',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 200 },
        )
      }
    }

    // Return verification success without order creation
    return NextResponse.json(
      {
        verified: true,
        message: 'Payment verified successfully',
        razorpay_payment_id,
        razorpay_order_id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('❌ Payment verification error:', error)
    return NextResponse.json(
      {
        verified: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to verify payment',
      },
      { status: 500 },
    )
  }
}
