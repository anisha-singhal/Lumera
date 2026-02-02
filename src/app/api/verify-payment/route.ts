import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature, fetchPaymentDetails, capturePayment } from '@/lib/razorpay'
import { sendMail } from '@/lib/sendMail'

// State code mapping for Payload CMS
const stateCodeMap: Record<string, string> = {
  'Andaman and Nicobar Islands': 'AN',
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chandigarh': 'CH',
  'Chhattisgarh': 'CT',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD',
  'Delhi': 'DL',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jammu and Kashmir': 'JK',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Ladakh': 'LA',
  'Lakshadweep': 'LD',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OR',
  'Puducherry': 'PY',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UK',
  'West Bengal': 'WB',
}

export async function POST(request: NextRequest) {
  let razorpay_payment_id_for_error = ''
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body
    razorpay_payment_id_for_error = razorpay_payment_id || ''

    console.log('Verify payment request received:', {
      razorpay_order_id,
      razorpay_payment_id,
      hasSignature: !!razorpay_signature,
    })

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment parameters')
      return NextResponse.json(
        { success: false, error: 'Missing payment verification parameters' },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    console.log('Signature verification result:', isValid)

    if (!isValid) {
      console.error('Invalid payment signature')
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Fetch payment details from Razorpay to confirm payment status and get amount
    let paymentStatus = 'authorized'
    let paymentAmount = 0
    try {
      const paymentDetails = await fetchPaymentDetails(razorpay_payment_id)
      paymentStatus = paymentDetails.status
      paymentAmount = paymentDetails.amount // Amount in paise
      console.log('Payment details fetched:', { status: paymentStatus, amount: paymentAmount })
    } catch (fetchError) {
      console.warn('Could not fetch payment details, proceeding with verified signature')
      // Use orderData total as fallback (convert to paise)
      paymentAmount = Math.round((orderData?.total || 0) * 100)
    }

    // Generate order number
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const orderNumber = `LUM${year}${month}${random}`

    // Save order to database - this MUST succeed for order to be valid
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    // Convert state name to code if needed
    const stateValue = orderData?.shippingAddress?.state || 'DL'
    const stateCode = stateCodeMap[stateValue] || stateValue

    try {
      // Map items - handle both custom candles and regular products
      // MongoDB ObjectId is a 24-character hex string
      const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id)

      const mappedItems = (orderData?.items || []).map((item: {
        id: string
        name: string
        quantity: number
        price: number
      }) => {
        // Check if it's a custom candle (ID starts with 'custom-') or invalid ObjectId
        const isCustomCandle = item.id && (item.id.startsWith('custom-') || !isValidObjectId(item.id))

        console.log(`Item mapping: ${item.name}, ID: ${item.id}, isCustom: ${isCustomCandle}`)

        return {
          // For custom candles or invalid IDs, don't set product relationship
          ...(isCustomCandle ? {} : { product: item.id }),
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.quantity * item.price,
          isCustomCandle: isCustomCandle,
        }
      })

      await payload.create({
        collection: 'orders',
        overrideAccess: true,
        data: {
          orderNumber,
          customer: {
            email: orderData?.email || '',
            phone: orderData?.phone || '',
            firstName: orderData?.firstName || '',
            lastName: orderData?.lastName || '',
          },
          shippingAddress: {
            addressLine1: orderData?.shippingAddress?.addressLine1 || '',
            addressLine2: orderData?.shippingAddress?.addressLine2 || '',
            city: orderData?.shippingAddress?.city || '',
            state: stateCode,
            pincode: orderData?.shippingAddress?.pincode || '',
            country: 'India',
          },
          sameAsShipping: true,
          items: mappedItems,
          pricing: {
            subtotal: orderData?.subtotal || 0,
            discount: {
              code: orderData?.couponCode || '',
              amount: orderData?.couponDiscount || 0,
            },
            shipping: {
              method: orderData?.shippingCost === 0 ? 'free' : 'standard',
              cost: orderData?.shippingCost || 0,
            },
            total: orderData?.total || 0,
          },
          payment: {
            method: 'card',
            status: 'completed',
            transactionId: razorpay_payment_id,
            merchantTransactionId: razorpay_order_id,
            paidAt: new Date().toISOString(),
          },
          status: 'confirmed',
          customerNotes: orderData?.orderNote || '',
        },
      })
      console.log('Order saved to database:', orderNumber)

      // IMPORTANT: Capture the payment ONLY after order is saved successfully
      // This ensures money is only deducted when we have the order in our system
      if (paymentStatus === 'authorized') {
        try {
          console.log('Capturing payment:', razorpay_payment_id, 'amount:', paymentAmount)
          await capturePayment(razorpay_payment_id, paymentAmount, 'INR')
          paymentStatus = 'captured'
          console.log('Payment captured successfully')
        } catch (captureError: any) {
          // Payment capture failed but order is saved - this needs manual resolution
          // The order exists, so admin can manually capture or refund
          console.error('Payment capture failed (order saved, needs manual capture):', captureError.message)
          // Don't fail the request - the order is saved, payment can be captured manually
        }
      }

    } catch (dbError: any) {
      // Database save failed - DO NOT capture the payment
      // The authorization will expire and money returns to customer automatically
      console.error('CRITICAL: Database save error - PAYMENT NOT CAPTURED:', dbError.message, dbError)

      // Extract more specific error message
      let errorMessage = 'Order could not be saved.'
      if (dbError.data?.errors) {
        const fieldErrors = dbError.data.errors.map((e: any) => e.message).join(', ')
        errorMessage = `Order save failed: ${fieldErrors}`
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage + ' Your payment was NOT charged. Please try again.',
          paymentId: razorpay_payment_id,
          paymentNotCaptured: true, // Flag to indicate payment was not captured
        },
        { status: 500 }
      )
    }

    // Increment coupon usage count atomically using MongoDB's $inc operator
    // This prevents race conditions when multiple orders use the same coupon
    if (orderData?.couponCode) {
      try {
        const mongoose = await import('mongoose')
        const db = mongoose.connection.db
        if (db) {
          await db.collection('coupons').updateOne(
            { code: orderData.couponCode.toUpperCase() },
            { $inc: { usageCount: 1 } }
          )
          console.log('Coupon usage count incremented atomically:', orderData.couponCode)
        }
      } catch (couponError) {
        console.error('Failed to increment coupon usage (non-fatal):', couponError)
      }
    }

    // Send order confirmation email (non-critical)
    try {
      const itemsList = (orderData?.items || []).map((item: any) =>
        `- ${item.name} (x${item.quantity}): ₹${item.price * item.quantity}`
      ).join('\n')

      const emailMessage = `Dear ${orderData?.firstName || 'Customer'},\n\n` +
        `Thank you for your order with Lumera Candles! Your order has been successfully placed.\n\n` +
        `Order Number: ${orderNumber}\n` +
        `Order Total: ₹${orderData?.total || 0}\n\n` +
        `Items Ordered:\n${itemsList}\n\n` +
        `Shipping Address:\n` +
        `${orderData?.shippingAddress?.addressLine1}\n` +
        `${orderData?.shippingAddress?.addressLine2 ? orderData.shippingAddress.addressLine2 + '\n' : ''}` +
        `${orderData?.shippingAddress?.city}, ${stateValue} - ${orderData?.shippingAddress?.pincode}\n\n` +
        `We will notify you once your order is shipped.\n\n` +
        `Best regards,\nThe Lumera Team`

      await sendMail({
        to: orderData?.email || '',
        subject: `Order Confirmed - ${orderNumber}`,
        message: emailMessage,
      })
      console.log('Order confirmation email sent to:', orderData?.email)
    } catch (mailError) {
      console.error('Failed to send order confirmation email (non-fatal):', mailError)
    }

    // Return success - payment was verified and order was saved
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: orderNumber,
      paymentId: razorpay_payment_id,
      paymentStatus,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment verification failed',
        paymentId: razorpay_payment_id_for_error,
      },
      { status: 500 }
    )
  }
}
