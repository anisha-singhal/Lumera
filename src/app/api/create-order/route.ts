import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder, generateReceiptId } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, customerEmail, customerPhone, customerName, notes } = body

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Generate a unique receipt ID
    const receipt = generateReceiptId()

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount, // Amount in rupees (will be converted to paise in the library)
      receipt,
      notes: {
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        customerName: customerName || '',
        ...notes,
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
