import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const ALLOWED = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_BYTES = 4 * 1024 * 1024 // 4MB — safe within serverless request-body limits

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const type = file.type || ''
    const name = file.name.toLowerCase()
    const looksVideo = ALLOWED.includes(type) || /\.(mp4|webm|mov)$/.test(name)
    if (!looksVideo) {
      return NextResponse.json(
        { error: 'Please upload an MP4, WebM, or MOV video.' },
        { status: 400 },
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Video must be under 4MB. Please trim/compress it (a short 15–30s clip works best).' },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaId = new ObjectId()

    const baseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50)
    const extension = name.split('.').pop() || 'mp4'
    const filename = `${baseName}_${mediaId.toString()}.${extension}`
    const mimeType = type === 'video/quicktime' ? 'video/mp4' : type || 'video/mp4'

    const payload = await getPayload({ config })
    const db = (payload.db as any).connection.db

    await db.collection('media').insertOne({
      _id: mediaId,
      alt: baseName.replace(/_/g, ' '),
      filename,
      mimeType,
      filesize: file.size,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('media_data').insertOne({
      _id: new ObjectId(),
      mediaId: mediaId.toString(),
      base64,
      mimeType,
    })

    return NextResponse.json(
      { id: mediaId.toString(), url: `/api/media/${mediaId.toString()}/view`, filename },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Error uploading video:', error?.message)
    return NextResponse.json(
      { error: error?.message || 'Failed to upload video' },
      { status: 500 },
    )
  }
}
