import { NextRequest, NextResponse } from 'next/server'
import { initiatePayment, initiateUPIIntent } from '@/lib/phonepe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      orderId,
      amount,
      customerPhone,
      customerEmail,
      customerName,
      paymentMethod = 'PAY_PAGE', // 'PAY_PAGE' or 'UPI_INTENT'
      upiApp, // 'GPAY', 'PHONEPE', 'PAYTM' for UPI Intent
    } = body

    // Validate required fields
    if (!orderId || !amount || !customerPhone || !customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: orderId, amount, customerPhone, customerEmail',
        },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount must be greater than 0',
        },
        { status: 400 }
      )
    }

    // Validate phone number (Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(customerPhone.replace(/\D/g, '').slice(-10))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Indian mobile number',
        },
        { status: 400 }
      )
    }

    let response

    if (paymentMethod === 'UPI_INTENT' && upiApp) {
      // Use UPI Intent flow for direct app opening
      response = await initiateUPIIntent({
        orderId,
        amount,
        customerPhone: customerPhone.replace(/\D/g, '').slice(-10),
        customerEmail,
        customerName,
        targetApp: upiApp,
      })
    } else {
      // Use standard Pay Page flow
      response = await initiatePayment({
        orderId,
        amount,
        customerPhone: customerPhone.replace(/\D/g, '').slice(-10),
        customerEmail,
        customerName,
      })
    }

    if (response.success) {
      return NextResponse.json({
        success: true,
        data: {
          merchantTransactionId: response.data?.merchantTransactionId,
          redirectUrl: response.data?.instrumentResponse?.redirectInfo?.url,
          intentUrl: response.data?.instrumentResponse?.intentUrl,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: response.message,
          code: response.code,
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
