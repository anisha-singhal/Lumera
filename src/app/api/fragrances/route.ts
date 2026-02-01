import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const fragrances = await payload.find({
      collection: 'fragrances',
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json(fragrances)
  } catch (error) {
    console.error('Error fetching fragrances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fragrances' },
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

    const fragrance = await (payload.create as any)({
      collection: 'fragrances',
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
      },
      overrideAccess: true,
    })

    return NextResponse.json(fragrance, { status: 201 })
  } catch (error: any) {
    console.error('Error creating fragrance:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create fragrance' },
      { status: 500 }
    )
  }
}
