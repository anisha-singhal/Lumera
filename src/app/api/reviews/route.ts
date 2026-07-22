import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') // admin: include hidden
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit') || '100'

    const payload = await getPayload({ config })

    const where: Where = {}
    if (all !== 'true') {
      where.status = { equals: 'published' }
    }
    if (featured === 'true') {
      where.featured = { equals: true }
    }

    const reviews = await payload.find({
      collection: 'reviews',
      where,
      limit: parseInt(limit),
      sort: ['displayOrder', '-createdAt'],
      depth: 0,
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.author || !body.content) {
      return NextResponse.json(
        { error: 'Customer name and review text are required.' },
        { status: 400 },
      )
    }

    const rating = Number(body.rating)
    body.rating = Math.min(5, Math.max(1, isNaN(rating) ? 5 : rating))

    const payload = await getPayload({ config })
    const review = await payload.create({
      collection: 'reviews',
      data: body,
      overrideAccess: true,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 },
    )
  }
}
