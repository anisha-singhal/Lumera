import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, checkPaymentStatus } from '@/lib/phonepe'

// Server-to-server webhook from PhonePe
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const checksum = request.headers.get('X-VERIFY')

    // Verify the webhook signature
    if (!checksum || !verifyWebhookSignature(body, checksum)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)
    const decodedResponse = JSON.parse(
      Buffer.from(payload.response, 'base64').toString('utf-8')
    )

    const { code, merchantTransactionId, transactionId, amount } = decodedResponse

    console.log('PhonePe Webhook received:', {
      code,
      merchantTransactionId,
      transactionId,
      amount,
    })

    // Handle different payment states
    switch (code) {
      case 'PAYMENT_SUCCESS':
        // Update order status to 'confirmed' and payment to 'completed'
        await handlePaymentSuccess({
          merchantTransactionId,
          transactionId,
          amount: amount / 100, // Convert paise to rupees
        })
        break

      case 'PAYMENT_ERROR':
      case 'PAYMENT_DECLINED':
        // Update order status and payment to 'failed'
        await handlePaymentFailure({
          merchantTransactionId,
          reason: decodedResponse.message,
        })
        break

      case 'PAYMENT_PENDING':
        // Payment is still processing
        console.log('Payment pending:', merchantTransactionId)
        break

      default:
        console.log('Unknown payment code:', code)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    // Still return 200 to prevent retries for parsing errors
    return NextResponse.json({ success: false, error: error.message })
  }
}

async function handlePaymentSuccess(data: {
  merchantTransactionId: string
  transactionId: string
  amount: number
}) {
  // TODO: Connect to Payload CMS to update order
  // This would typically:
  // 1. Find the order by merchantTransactionId
  // 2. Update payment.status to 'completed'
  // 3. Update payment.transactionId and payment.phonePeTransactionId
  // 4. Update payment.paidAt to current date
  // 5. Update order.status to 'confirmed'
  // 6. Send confirmation email to customer
  // 7. Reduce inventory

  console.log('Payment successful, updating order:', data)

  // Example Payload CMS integration (uncomment when connected):
  /*
  const payload = await getPayload({ config: payloadConfig })

  // Find order by merchant transaction ID
  const orders = await payload.find({
    collection: 'orders',
    where: {
      'payment.merchantTransactionId': {
        equals: data.merchantTransactionId,
      },
    },
  })

  if (orders.docs.length > 0) {
    const order = orders.docs[0]

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'confirmed',
        payment: {
          ...order.payment,
          status: 'completed',
          transactionId: data.transactionId,
          paidAt: new Date().toISOString(),
        },
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'confirmed',
            changedAt: new Date().toISOString(),
            note: 'Payment confirmed via PhonePe',
          },
        ],
      },
    })

    // Reduce inventory for each item
    for (const item of order.items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.product,
      })

      if (product.inventory?.trackInventory) {
        await payload.update({
          collection: 'products',
          id: item.product,
          data: {
            inventory: {
              ...product.inventory,
              quantity: Math.max(0, product.inventory.quantity - item.quantity),
            },
          },
        })
      }
    }
  }
  */
}

async function handlePaymentFailure(data: {
  merchantTransactionId: string
  reason: string
}) {
  console.log('Payment failed:', data)

  // TODO: Update order payment status to 'failed'
  /*
  const payload = await getPayload({ config: payloadConfig })

  const orders = await payload.find({
    collection: 'orders',
    where: {
      'payment.merchantTransactionId': {
        equals: data.merchantTransactionId,
      },
    },
  })

  if (orders.docs.length > 0) {
    const order = orders.docs[0]

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        payment: {
          ...order.payment,
          status: 'failed',
        },
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: 'payment_failed',
            changedAt: new Date().toISOString(),
            note: `Payment failed: ${data.reason}`,
          },
        ],
      },
    })
  }
  */
}
