import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') // For dashboard to get all collections
    
    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const where: any = {}
    
    // Only filter by active status for frontend (not for dashboard)
    // But if no active collections exist, return all collections
    if (all !== 'true') {
      where.status = {
        equals: 'active',
      }
    }

    const collections = await payload.find({
      collection: 'collections',
      where: Object.keys(where).length > 0 ? where : undefined,
      limit: 100,
      sort: 'displayOrder',
      depth: 0, // Don't need nested data
    })

    // If no active collections found and not requesting all, try without status filter
    if (all !== 'true' && (!collections.docs || collections.docs.length === 0)) {
      const allCollections = await payload.find({
        collection: 'collections',
        limit: 100,
        sort: 'displayOrder',
        depth: 0,
      })
      return NextResponse.json(allCollections)
    }

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const collection = await (payload.create as any)({
      collection: 'collections',
      data: {
        name: body.name,
        slug: body.slug,
        collectionType: 'signature',
        status: 'draft',
      },
      overrideAccess: true,
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error: any) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create collection' },
      { status: 500 }
    )
  }
}
