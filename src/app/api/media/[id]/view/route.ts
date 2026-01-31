import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs/promises'
import path from 'path'

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

    // Serve from filesystem using the filename
    if (media.filename) {
      // Try public/media first
      let filePath = path.join(process.cwd(), 'public', 'media', media.filename)
      try {
        const fileBuffer = await fs.readFile(filePath)
        const mimeType = media.mimeType || getMimeType(media.filename)

        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      } catch (fsError) {
        console.error('File not found at:', filePath)
      }
    }

    // If no file on disk, return 404
    return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json(
      { error: 'Failed to serve media' },
      { status: 500 }
    )
  }
}

function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop()
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  }
  return mimeTypes[ext || ''] || 'image/jpeg'
}
