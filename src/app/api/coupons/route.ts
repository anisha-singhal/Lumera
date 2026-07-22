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

    // Normalise the code so duplicates are caught reliably (e.g. "save10" vs "SAVE10")
    if (typeof body.code === 'string') {
      body.code = body.code.trim().toUpperCase()
    }
    if (!body.code) {
      return NextResponse.json({ error: 'Please enter a coupon code.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Pre-check for an existing code to return a friendly, specific message
    const existing = await payload.find({
      collection: 'coupons',
      where: { code: { equals: body.code } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: `Coupon code "${body.code}" already exists. Please use a different code.` },
        { status: 409 }
      )
    }

    const coupon = await payload.create({
      collection: 'coupons',
      data: body,
      overrideAccess: true,
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error('Error creating coupon:', error)
    const raw = `${error?.message || ''} ${JSON.stringify(error?.data || '')}`
    const isDuplicate = /duplicate|e11000|following field is invalid: code|unique/i.test(raw)
    return NextResponse.json(
      {
        error: isDuplicate
          ? 'This coupon code already exists. Please use a different code.'
          : error.message || 'Failed to create coupon',
      },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}
