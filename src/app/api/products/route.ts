import { NextRequest, NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const all = searchParams.get('all') // For admin to get all products
    const limit = searchParams.get('limit') || '10'
    const page = searchParams.get('page') || '1'
    const slug = searchParams.get('slug')

    // Dynamically import Payload to avoid initialization issues
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

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

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    // Verify all image IDs exist in media collection
    if (body.images && Array.isArray(body.images)) {
      for (const img of body.images) {
        const imageId = img.image
        console.log('Verifying media ID:', imageId)
        try {
          const media = await payload.findByID({
            collection: 'media',
            id: imageId,
          })
          console.log('Media found:', media?.id, media?.filename)
        } catch (err) {
          console.error('Media not found for ID:', imageId)
        }
      }
    }

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
