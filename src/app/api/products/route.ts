import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const all = searchParams.get('all') // For admin to get all products
    const limit = searchParams.get('limit') || '10'
    const page = searchParams.get('page') || '1'
    const slug = searchParams.get('slug')

    const payload = await getPayload({ config })

    // Build the query
    const where: Where = {}

    // When searching by specific slug, don't filter by status (allow viewing any product)
    if (slug) {
      where.slug = { equals: slug }
    } else {
      // Only filter by active status if not fetching all (for admin) and not searching by slug
      if (all !== 'true' && !status) {
        where.status = { equals: 'active' }
      }

      // Filter by specific status if provided
      if (status) {
        where.status = { equals: status }
      }

      if (featured === 'true') {
        where.featured = { equals: true }
      }
    }

    const products = await payload.find({
      collection: 'products',
      where,
      limit: parseInt(limit),
      page: parseInt(page),
      depth: 2, // Include related collections and media
      sort: '-createdAt',
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received product data:', JSON.stringify(body, null, 2))

    const payload = await getPayload({ config })

    // Create the product - data is already formatted from the client
    const product = await payload.create({
      collection: 'products',
      data: body,
      overrideAccess: true, // Bypass access control for dashboard
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    // Include validation errors if available
    const errorMessage = error.data?.errors
      ? error.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      : error.message || 'Failed to create product'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
