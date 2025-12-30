import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/phonepe'

// Handle POST callback from PhonePe after payment
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    // Get the response from PhonePe
    const response = formData.get('response') as string

    if (!response) {
      return NextResponse.redirect(
        new URL(`/checkout/failed?reason=no_response`, process.env.NEXT_PUBLIC_SERVER_URL!)
      )
    }

    // Decode the base64 response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'))

    const { code, merchantTransactionId } = decodedResponse

    if (code === 'PAYMENT_SUCCESS') {
      // Verify the payment status with PhonePe
      const statusResponse = await checkPaymentStatus(merchantTransactionId)

      if (statusResponse.success && statusResponse.data?.state === 'COMPLETED') {
        // Payment successful - redirect to success page
        return NextResponse.redirect(
          new URL(
            `/checkout/success?orderId=${orderId}&transactionId=${merchantTransactionId}`,
            process.env.NEXT_PUBLIC_SERVER_URL!
          )
        )
      }
    }

    // Payment failed or pending
    const failureReason = decodedResponse.message || 'Payment was not successful'
    return NextResponse.redirect(
      new URL(
        `/checkout/failed?orderId=${orderId}&reason=${encodeURIComponent(failureReason)}`,
        process.env.NEXT_PUBLIC_SERVER_URL!
      )
    )
  } catch (error: any) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(
      new URL(
        `/checkout/failed?reason=${encodeURIComponent('An error occurred processing your payment')}`,
        process.env.NEXT_PUBLIC_SERVER_URL!
      )
    )
  }
}

// Handle GET for status checks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const transactionId = searchParams.get('transactionId')

  if (!transactionId) {
    return NextResponse.json(
      { success: false, error: 'Transaction ID is required' },
      { status: 400 }
    )
  }

  try {
    const statusResponse = await checkPaymentStatus(transactionId)
    return NextResponse.json(statusResponse)
  } catch (error: any) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
