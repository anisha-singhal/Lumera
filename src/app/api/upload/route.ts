import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check for unsupported formats like HEIC
    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
      return NextResponse.json(
        { error: 'HEIC/HEIF images are not supported. Please upload JPG, PNG, or WebP images instead.' },
        { status: 400 }
      )
    }

    // Check file size (limit to 4MB for serverless database storage)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 4MB' },
        { status: 400 }
      )
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100)

    const altText = sanitizedFilename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')

    console.log('Processing upload:', sanitizedFilename, 'type:', file.type, 'size:', file.size)

    // Get Payload instance and use its MongoDB connection
    const payload = await getPayload({ config })

    // Access MongoDB directly through Payload's db adapter
    const db = (payload.db as any).connection.db

    const mediaDoc = {
      _id: new ObjectId(),
      alt: altText,
      filename: sanitizedFilename,
      mimeType: file.type || 'image/jpeg',
      filesize: file.size,
      base64: base64,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('media').insertOne(mediaDoc)

    console.log('Media created:', mediaDoc._id.toString())

    return NextResponse.json({
      id: mediaDoc._id.toString(),
      url: `/api/media/${mediaDoc._id.toString()}/view`,
      filename: sanitizedFilename
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
