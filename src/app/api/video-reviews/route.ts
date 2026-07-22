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
      collection: 'video-reviews',
      where,
      limit: 40,
      sort: ['displayOrder', '-createdAt'],
      depth: 0,
    })

    const docs = items.docs.map((d: any) => ({
      id: d.id,
      videoUrl: d.videoId ? `/api/media/${d.videoId}/view` : null,
      posterUrl: d.posterId ? `/api/media/${d.posterId}/view` : null,
      author: d.author || '',
      location: d.location || '',
    }))

    return NextResponse.json({ docs })
  } catch (error) {
    console.error('Error fetching video reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch video reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.videoId) {
      return NextResponse.json({ error: 'A video is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const item = await payload.create({
      collection: 'video-reviews',
      data: {
        videoId: body.videoId,
        posterId: body.posterId || undefined,
        author: body.author || '',
        location: body.location || '',
        displayOrder: Number(body.displayOrder) || 0,
        status: body.status || 'published',
      },
      overrideAccess: true,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error('Error creating video review:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add video review' },
      { status: 500 },
    )
  }
}
