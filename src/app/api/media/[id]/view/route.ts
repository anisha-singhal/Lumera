import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

// MongoDB connection cache for serverless
let cachedClient: MongoClient | null = null

async function getMongoClient() {
  if (cachedClient) {
    return cachedClient
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI not configured')
  }

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Use MongoDB directly
    const client = await getMongoClient()
    const db = client.db()

    let media
    try {
      media = await db.collection('media').findOne({ _id: new ObjectId(id) })
    } catch {
      // If ObjectId is invalid, try string match
      media = await db.collection('media').findOne({ _id: id as any })
    }

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
