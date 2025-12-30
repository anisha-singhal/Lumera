import crypto from 'crypto'
import axios from 'axios'

// PhonePe API Configuration
const PHONEPE_CONFIG = {
  UAT: {
    baseUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
    redirectUrl: '/api/payment/callback',
  },
  PRODUCTION: {
    baseUrl: 'https://api.phonepe.com/apis/hermes',
    redirectUrl: '/api/payment/callback',
  },
}

interface PhonePeConfig {
  merchantId: string
  saltKey: string
  saltIndex: string
  env: 'UAT' | 'PRODUCTION'
}

interface PaymentRequest {
  orderId: string
  amount: number // Amount in rupees
  customerPhone: string
  customerEmail: string
  customerName?: string
  redirectUrl?: string
  callbackUrl?: string
}

interface UPIIntentRequest extends PaymentRequest {
  targetApp?: 'GPAY' | 'PHONEPE' | 'PAYTM'
}

interface PaymentResponse {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse?: {
      type: string
      redirectInfo?: {
        url: string
        method: string
      }
      intentUrl?: string
    }
  }
}

function getConfig(): PhonePeConfig {
  return {
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
    env: (process.env.PHONEPE_ENV as 'UAT' | 'PRODUCTION') || 'UAT',
  }
}

function generateTransactionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `LUM${timestamp}${random}`.toUpperCase()
}

function generateChecksum(payload: string, saltKey: string, saltIndex: string): string {
  const dataToHash = payload + '/pg/v1/pay' + saltKey
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex')
  return `${sha256Hash}###${saltIndex}`
}

function generateStatusChecksum(
  merchantId: string,
  merchantTransactionId: string,
  saltKey: string,
  saltIndex: string
): string {
  const dataToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex')
  return `${sha256Hash}###${saltIndex}`
}

/**
 * Initialize a PhonePe payment
 * Supports both redirect and UPI Intent flows
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  const config = getConfig()
  const envConfig = PHONEPE_CONFIG[config.env]
  const merchantTransactionId = generateTransactionId()

  // Build the payment payload
  const payloadData = {
    merchantId: config.merchantId,
    merchantTransactionId,
    merchantUserId: `MUID_${request.orderId}`,
    amount: Math.round(request.amount * 100), // Convert to paise
    redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}${envConfig.redirectUrl}?orderId=${request.orderId}`,
    redirectMode: 'POST',
    callbackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/webhook`,
    mobileNumber: request.customerPhone,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  }

  // Base64 encode the payload
  const base64Payload = Buffer.from(JSON.stringify(payloadData)).toString('base64')

  // Generate checksum
  const checksum = generateChecksum(base64Payload, config.saltKey, config.saltIndex)

  try {
    const response = await axios.post(
      `${envConfig.baseUrl}/pg/v1/pay`,
      {
        request: base64Payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
      }
    )

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
      data: {
        merchantId: config.merchantId,
        merchantTransactionId,
        instrumentResponse: response.data.data?.instrumentResponse,
      },
    }
  } catch (error: any) {
    console.error('PhonePe payment initiation error:', error.response?.data || error.message)
    return {
      success: false,
      code: 'PAYMENT_ERROR',
      message: error.response?.data?.message || 'Failed to initiate payment',
    }
  }
}

/**
 * Initialize a UPI Intent payment (Google Pay, PhonePe, Paytm)
 * This opens the UPI app directly on the user's device
 */
export async function initiateUPIIntent(request: UPIIntentRequest): Promise<PaymentResponse> {
  const config = getConfig()
  const envConfig = PHONEPE_CONFIG[config.env]
  const merchantTransactionId = generateTransactionId()

  // Determine the target app for UPI Intent
  const targetApp = request.targetApp || 'PHONEPE'

  const payloadData = {
    merchantId: config.merchantId,
    merchantTransactionId,
    merchantUserId: `MUID_${request.orderId}`,
    amount: Math.round(request.amount * 100), // Convert to paise
    redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}${envConfig.redirectUrl}?orderId=${request.orderId}`,
    redirectMode: 'POST',
    callbackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/webhook`,
    mobileNumber: request.customerPhone,
    deviceContext: {
      deviceOS: 'ANDROID', // Will be dynamically set on frontend
    },
    paymentInstrument: {
      type: 'UPI_INTENT',
      targetApp,
    },
  }

  const base64Payload = Buffer.from(JSON.stringify(payloadData)).toString('base64')
  const checksum = generateChecksum(base64Payload, config.saltKey, config.saltIndex)

  try {
    const response = await axios.post(
      `${envConfig.baseUrl}/pg/v1/pay`,
      {
        request: base64Payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
      }
    )

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
      data: {
        merchantId: config.merchantId,
        merchantTransactionId,
        instrumentResponse: response.data.data?.instrumentResponse,
      },
    }
  } catch (error: any) {
    console.error('PhonePe UPI Intent error:', error.response?.data || error.message)
    return {
      success: false,
      code: 'PAYMENT_ERROR',
      message: error.response?.data?.message || 'Failed to initiate UPI payment',
    }
  }
}

/**
 * Check the status of a payment
 */
export async function checkPaymentStatus(merchantTransactionId: string): Promise<{
  success: boolean
  code: string
  message: string
  data?: {
    state: string
    responseCode: string
    transactionId: string
    amount: number
    paymentInstrument?: {
      type: string
      utr?: string
    }
  }
}> {
  const config = getConfig()
  const envConfig = PHONEPE_CONFIG[config.env]

  const checksum = generateStatusChecksum(
    config.merchantId,
    merchantTransactionId,
    config.saltKey,
    config.saltIndex
  )

  try {
    const response = await axios.get(
      `${envConfig.baseUrl}/pg/v1/status/${config.merchantId}/${merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': config.merchantId,
        },
      }
    )

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error('PhonePe status check error:', error.response?.data || error.message)
    return {
      success: false,
      code: 'STATUS_CHECK_ERROR',
      message: error.response?.data?.message || 'Failed to check payment status',
    }
  }
}

/**
 * Verify webhook callback signature
 */
export function verifyWebhookSignature(
  responseBody: string,
  receivedChecksum: string
): boolean {
  const config = getConfig()
  const expectedChecksum = generateChecksum(responseBody, config.saltKey, config.saltIndex)
  return receivedChecksum === expectedChecksum
}

/**
 * Initiate a refund
 */
export async function initiateRefund(
  originalTransactionId: string,
  refundAmount: number,
  reason?: string
): Promise<{
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    originalTransactionId: string
    amount: number
    state: string
  }
}> {
  const config = getConfig()
  const envConfig = PHONEPE_CONFIG[config.env]
  const merchantTransactionId = `REFUND_${generateTransactionId()}`

  const payloadData = {
    merchantId: config.merchantId,
    merchantUserId: 'REFUND_USER',
    originalTransactionId,
    merchantTransactionId,
    amount: Math.round(refundAmount * 100), // Convert to paise
    callbackUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/refund-webhook`,
  }

  const base64Payload = Buffer.from(JSON.stringify(payloadData)).toString('base64')
  const refundChecksum = crypto
    .createHash('sha256')
    .update(base64Payload + '/pg/v1/refund' + config.saltKey)
    .digest('hex') + `###${config.saltIndex}`

  try {
    const response = await axios.post(
      `${envConfig.baseUrl}/pg/v1/refund`,
      {
        request: base64Payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': refundChecksum,
        },
      }
    )

    return {
      success: response.data.success,
      code: response.data.code,
      message: response.data.message,
      data: response.data.data,
    }
  } catch (error: any) {
    console.error('PhonePe refund error:', error.response?.data || error.message)
    return {
      success: false,
      code: 'REFUND_ERROR',
      message: error.response?.data?.message || 'Failed to initiate refund',
    }
  }
}
