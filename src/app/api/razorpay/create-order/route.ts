import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export const runtime = 'nodejs'

type OrderRequest = {
  amount?: number
  orderId?: string
  email?: string
  phone?: string
  name?: string
}

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  console.log('🔵 Getting Razorpay instance...')
  console.log('RAZORPAY_KEY_ID from env:', keyId ? '✅ Set' : '❌ Missing')
  console.log('RAZORPAY_KEY_SECRET from env:', keySecret ? '✅ Set' : '❌ Missing')
  console.log('Environment variables available:', Object.keys(process.env).filter(k => k.includes('RAZORPAY')))

  if (!keyId || !keySecret) {
    const errorMsg = `Razorpay credentials missing: keyId=${!!keyId}, keySecret=${!!keySecret}. Available vars: ${Object.keys(process.env).filter(k => k.includes('RAZORPAY')).join(', ')}`
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  try {
    console.log('Creating Razorpay instance with keyId:', keyId.substring(0, 15) + '...')
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    console.log('✅ Razorpay instance created successfully')
    return instance
  } catch (error) {
    console.error('❌ Failed to create Razorpay instance:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, email, phone, name } = body as OrderRequest

    console.log('🔵 POST /api/razorpay/create-order')
    console.log('Request body:', { amount, orderId, email, phone, name })

    // Validate input
    if (!amount || !orderId || !email || !phone || !name) {
      console.error('❌ Validation failed - missing fields:', {
        amount: !!amount,
        orderId: !!orderId,
        email: !!email,
        phone: !!phone,
        name: !!name,
      })
      return NextResponse.json(
        {
          error: 'Missing required fields',
          received: { amount, orderId, email, phone, name },
        },
        { status: 400 },
      )
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('❌ Invalid amount:', amount, 'type:', typeof amount)
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number in paise' },
        { status: 400 },
      )
    }

    // Normalize phone number - remove all non-digits
    const normalizedPhone = phone.toString().replace(/\D/g, '')
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      console.error('❌ Invalid phone number length:', normalizedPhone.length, 'phone:', phone)
      return NextResponse.json(
        { error: 'Invalid phone number. Must be 10-15 digits' },
        { status: 400 },
      )
    }

    // Get Razorpay instance
    console.log('🔵 Getting Razorpay instance...')
    const razorpay = getRazorpayInstance()

    // Amount is already in paise from frontend
    console.log('💰 Using amount:', amount, 'paise (₹' + (amount / 100) + ')')

    // Create Razorpay order
    console.log('🔵 Calling razorpay.orders.create()')
    type OrderPayload = Parameters<typeof razorpay.orders.create>[0]
    const orderPayload: OrderPayload = {
      amount,
      currency: 'INR',
      receipt: orderId.toString(),
      notes: {
        order_id: orderId.toString(),
        customer_email: email,
        customer_phone: normalizedPhone,
        customer_name: name,
      },
    }

    console.log('📋 Order payload:', JSON.stringify(orderPayload, null, 2))
    const order = await razorpay.orders.create(orderPayload)

    console.log('✅ Order created successfully:', order.id)

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error)

    let errorMessage = 'Failed to create Razorpay order'
    let errorDetails: Record<string, unknown> = {}
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        message: error.message,
        name: error.name,
      }
      // Check if it's an API error from Razorpay
      if ('response' in error) {
        errorDetails.response = (error as Record<string, unknown>).response
        statusCode = 400
      }
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
      errorDetails = error as Record<string, unknown>
    }

    console.error('📋 Error details:', { errorMessage, errorDetails })

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: statusCode },
    )
  }
}
