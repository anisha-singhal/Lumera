import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    
    // Find the coupon
    const coupons = await payload.find({
      collection: 'coupons',
      where: {
        code: { equals: code.toUpperCase() },
        active: { equals: true },
      },
    })

    if (coupons.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 404 })
    }

    const coupon = coupons.docs[0] as any

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    // Check min order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `This coupon requires a minimum order of ₹${coupon.minOrderAmount}` 
      }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100)
    } else {
      discountAmount = coupon.value
    }

    return NextResponse.json({
      valid: true,
      discountAmount,
      type: coupon.type,
      value: coupon.value,
      code: coupon.code,
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
