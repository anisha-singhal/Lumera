import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const coupons = await payload.find({
      collection: 'coupons',
      sort: '-createdAt',
      limit: 100,
    })
    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = await getPayload({ config })
    
    const coupon = await payload.create({
      collection: 'coupons',
      data: body,
      overrideAccess: true,
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create coupon' },
      { status: 500 }
    )
  }
}
