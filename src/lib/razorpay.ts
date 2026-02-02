import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
})

export interface CreateOrderRequest {
  amount: number // Amount in rupees
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

/**
 * Create a Razorpay order with MANUAL CAPTURE
 * Payment is only authorized, not captured. We capture after order is saved to DB.
 * This prevents money being deducted if our database save fails.
 * @param request - Order details including amount in rupees
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
  request: CreateOrderRequest
): Promise<RazorpayOrder> {
  const options = {
    amount: Math.round(request.amount * 100), // Convert to paise
    currency: request.currency || 'INR',
    receipt: request.receipt,
    notes: request.notes || {},
    payment_capture: 0, // MANUAL CAPTURE - payment is authorized but not captured
  }

  // MOCK: If using dummy keys, return a mock order
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
    console.log('⚠️ Using Mock Razorpay Order (Dummy Keys Detected)')
    return {
      id: 'order_' + Math.random().toString(36).substring(7),
      entity: 'order',
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      status: 'created',
      attempts: 0,
      notes: options.notes,
      created_at: Math.floor(Date.now() / 1000),
    } as RazorpayOrder
  }

  const order = await razorpayInstance.orders.create(options)
  return order as RazorpayOrder
}

/**
 * Capture an authorized payment
 * Call this ONLY after order is successfully saved to database
 * @param paymentId - Razorpay payment ID
 * @param amount - Amount in paise to capture
 * @param currency - Currency (default INR)
 * @returns Captured payment details
 */
export async function capturePayment(
  paymentId: string,
  amount: number,
  currency: string = 'INR'
) {
  // MOCK: If using dummy keys, return mock capture
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
    console.log('⚠️ Using Mock Payment Capture (Dummy Keys Detected)')
    return {
      id: paymentId,
      entity: 'payment',
      status: 'captured',
      amount: amount,
      currency: currency,
    } as any
  }

  const capture = await razorpayInstance.payments.capture(paymentId, amount, currency)
  return capture
}

/**
 * Verify Razorpay payment signature
 * @param params - Payment verification parameters
 * @returns boolean indicating if signature is valid
 */
export function verifyPaymentSignature(
  params: PaymentVerificationRequest
): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params

  // Create the signature string
  const body = razorpay_order_id + '|' + razorpay_payment_id

  // Generate expected signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  // Compare signatures
  return expectedSignature === razorpay_signature
}

/**
 * Fetch payment details from Razorpay
 * @param paymentId - Razorpay payment ID
 * @returns Payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
  // MOCK: If using dummy keys, return mock payment details
  if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
    console.log('⚠️ Using Mock Payment Details (Dummy Keys Detected)')
    return {
      id: paymentId,
      entity: 'payment',
      status: 'captured', // Always success for this test
      method: 'card',
      amount: 10000,
      currency: 'INR',
    } as any
  }
  
  const payment = await razorpayInstance.payments.fetch(paymentId)
  return payment
}

/**
 * Fetch order details from Razorpay
 * @param orderId - Razorpay order ID
 * @returns Order details
 */
export async function fetchOrderDetails(orderId: string) {
  const order = await razorpayInstance.orders.fetch(orderId)
  return order
}

/**
 * Initiate a refund
 * @param paymentId - Razorpay payment ID
 * @param amount - Refund amount in rupees (optional, full refund if not provided)
 * @param notes - Optional notes for the refund
 * @returns Refund details
 */
export async function initiateRefund(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const refundOptions: {
    amount?: number
    speed?: 'normal' | 'optimum'
    notes?: Record<string, string>
  } = {
    speed: 'normal',
    notes: notes || {},
  }

  if (amount) {
    refundOptions.amount = Math.round(amount * 100) // Convert to paise
  }

  const refund = await razorpayInstance.payments.refund(paymentId, refundOptions)
  return refund
}

/**
 * Generate a unique order receipt ID
 * @returns Unique receipt string
 */
export function generateReceiptId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `LUM${timestamp}${random}`.toUpperCase()
}

export { razorpayInstance }
