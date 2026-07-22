import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const payload = await getPayload({ config })
    const where: Where = {}
    if (all !== 'true') where.status = { equals: 'published' }

    const items = await payload.find({
      collection: 'review-gallery',
      where,
      limit: 60,
      sort: ['displayOrder', '-createdAt'],
      depth: 0,
    })

    // Normalise image to a viewable URL + id for the client
    const docs = items.docs.map((d: any) => {
      const imageId = typeof d.image === 'string' ? d.image : d.image?.id
      return {
        id: d.id,
        imageId,
        url: imageId ? `/api/media/${imageId}/view` : null,
        caption: d.caption || '',
        displayOrder: d.displayOrder ?? 0,
        status: d.status,
      }
    })

    return NextResponse.json({ docs })
  } catch (error) {
    console.error('Error fetching review gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.image) {
      return NextResponse.json({ error: 'An image is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const item = await payload.create({
      collection: 'review-gallery',
      data: {
        image: body.image,
        caption: body.caption || '',
        displayOrder: Number(body.displayOrder) || 0,
        status: body.status || 'published',
      },
      overrideAccess: true,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error('Error creating gallery image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add gallery image' },
      { status: 500 },
    )
  }
}
