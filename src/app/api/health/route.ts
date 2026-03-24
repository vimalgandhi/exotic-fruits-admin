import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  console.log('🏥 Health check requested')
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  try {
    console.log('✅ Frontend is running')
    
    // Test backend connectivity
    console.log('🔵 Testing backend connectivity to:', backendUrl)
    
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      
      const backendHealthRes = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      })
      
      clearTimeout(timeout)
      
      console.log('🔵 Backend responded with status:', backendHealthRes.status)
      const backendHealth = await backendHealthRes.json()
      
      return NextResponse.json(
        {
          status: 'ok',
          frontend: 'running',
          backendUrl,
          backend: {
            reachable: backendHealthRes.ok,
            status: backendHealthRes.status,
            data: backendHealth,
          },
          environment: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'configured' : 'missing',
          },
        },
        { status: 200 }
      )
    } catch (backendError) {
      console.error('❌ Backend health check failed:', backendError)
      
      return NextResponse.json(
        {
          status: 'partial',
          frontend: 'running',
          backendUrl,
          backend: {
            reachable: false,
            error: backendError instanceof Error ? backendError.message : 'Unknown error',
          },
          environment: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'configured' : 'missing',
          },
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('❌ Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
