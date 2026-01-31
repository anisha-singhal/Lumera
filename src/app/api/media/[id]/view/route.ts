import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const media = (await payload.findByID({
      collection: 'media',
      id,
    })) as any

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Serve from base64 data stored in database
    if (media.base64) {
      const buffer = Buffer.from(media.base64, 'base64')
      const mimeType = media.mimeType || 'image/jpeg'

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // If no base64 data, return 404
    return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json(
      { error: 'Failed to serve media' },
      { status: 500 }
    )
  }
}
