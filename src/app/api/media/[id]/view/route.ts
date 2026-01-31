import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Access MongoDB directly through Payload's db adapter
    const mongoose = (payload.db as any).connection
    const db = mongoose.db

    // Fetch base64 from separate collection
    const mediaData = await db.collection('media_data').findOne({ mediaId: id })

    if (mediaData?.base64) {
      const buffer = Buffer.from(mediaData.base64, 'base64')
      const mimeType = mediaData.mimeType || 'image/jpeg'

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Fallback: try to get from media collection directly (for old data)
    let media
    try {
      media = await db.collection('media').findOne({ _id: new ObjectId(id) })
    } catch {
      media = await db.collection('media').findOne({ _id: id as any })
    }

    if (media?.base64) {
      const buffer = Buffer.from(media.base64, 'base64')
      const mimeType = media.mimeType || 'image/jpeg'

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json(
      { error: 'Failed to serve media' },
      { status: 500 }
    )
  }
}
