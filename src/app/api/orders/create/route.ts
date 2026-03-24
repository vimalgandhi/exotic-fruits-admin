import { NextRequest, NextResponse } from 'next/server'

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

type CreateOrderRequest = {
  userId?: number
  customerDetails?: CustomerDetails
  orderItems?: OrderItem[]
  total?: number
  paymentMethod?: 'cod' | 'upi' | 'card'
  paymentStatus?: 'PENDING' | 'PAID'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderRequest
    const {
      userId,
      customerDetails,
      orderItems,
      total,
      paymentMethod = 'cod',
      paymentStatus = 'PENDING',
    } = body

    console.log('📍 Creating order via API')
    console.log('🔍 Request body keys:', Object.keys(body))
    console.log('📦 Order Details:')
    console.log('  - Payment Method:', paymentMethod)
    console.log('  - Payment Status:', paymentStatus)
    console.log('  - Total:', total)
    console.log('  - Items count:', orderItems?.length)
    console.log('  - Customer:', customerDetails ? `${customerDetails.firstName} ${customerDetails.lastName}` : 'N/A')

    // Validate input
    if (!customerDetails || !orderItems || !total) {
      console.error('❌ Missing order details:', {
        hasCustomerDetails: !!customerDetails,
        hasOrderItems: !!orderItems,
        total,
      })
      return NextResponse.json(
        { 
          message: 'Missing required order details',
          missing: {
            customerDetails: !customerDetails,
            orderItems: !orderItems,
            total: !total,
          }
        },
        { status: 400 },
      )
    }

    // Additional validation
    if (orderItems.length === 0) {
      console.error('❌ Order items array is empty')
      return NextResponse.json(
        { message: 'Order must contain at least one item' },
        { status: 400 },
      )
    }

    // Validate customer details
    const { firstName, lastName, email, phone, deliveryAddress } = customerDetails
    if (!firstName || !lastName || !email || !phone || !deliveryAddress) {
      console.error('❌ Invalid customer details:', {
        firstName: !!firstName,
        lastName: !!lastName,
        email: !!email,
        phone: !!phone,
        deliveryAddress: !!deliveryAddress,
      })
      return NextResponse.json(
        { 
          message: 'Invalid customer details. All fields required.',
          received: customerDetails,
        },
        { status: 400 },
      )
    }

    // Normalize phone (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '')
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      console.error('❌ Invalid phone length:', normalizedPhone.length)
      return NextResponse.json(
        { message: 'Phone number must be 10-15 digits' },
        { status: 400 },
      )
    }

    // Validate order items
    const invalidItems = orderItems.filter(
      (item) => !item.productId || item.quantity <= 0 || item.price < 0
    )
    if (invalidItems.length > 0) {
      console.error('❌ Invalid order items:', invalidItems)
      return NextResponse.json(
        { 
          message: 'Invalid order items. Check productId, quantity, and price.',
          invalidItems,
        },
        { status: 400 },
      )
    }

    // Call backend API to create order
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    console.log('🔵 Calling backend API:', `${backendUrl}/orders/payment/create`)
    console.log('📋 Request format:')
    console.log('  Content-Type: application/json')
    console.log('  Method: POST')
    console.log('  Endpoint: /orders/payment/create')

    const createOrderRes = await fetch(`${backendUrl}/orders/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        customerDetails: {
          firstName,
          lastName,
          email,
          phone: normalizedPhone,
          deliveryAddress,
        },
        orderItems,
        total,
        paymentMethod,
        paymentStatus,
      }),
    })

    const orderData = await createOrderRes.json()
    console.log('📍 Backend response status:', createOrderRes.status)
    console.log('📍 Backend response data keys:', Object.keys(orderData))
    console.log('📍 Backend response:', JSON.stringify(orderData, null, 2))

    if (!createOrderRes.ok) {
      console.error('❌ Backend order creation failed')
      console.error('❌ Status code:', createOrderRes.status)
      console.error('❌ Error message:', orderData.message || orderData.error)
      console.error('❌ Full error response:', orderData)
      return NextResponse.json(
        {
          message: orderData.message || orderData.error || 'Failed to create order',
          details: orderData,
          backendStatus: createOrderRes.status,
        },
        { status: createOrderRes.status },
      )
    }

    console.log('✅ Order created successfully:', orderData.orderId || orderData._id)

    return NextResponse.json(
      {
        orderId: orderData.orderId || orderData._id || orderData.id,
        message: 'Order created successfully',
        ...orderData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('❌ Order creation error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to create order'

    return NextResponse.json(
      {
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
