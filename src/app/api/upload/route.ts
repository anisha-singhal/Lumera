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

    // Get Payload instance just to access MongoDB connection
    const payload = await getPayload({ config })

    // Access MongoDB directly through Payload's db adapter
    const mongoose = (payload.db as any).connection
    const db = mongoose.db

    // Generate new ObjectId for the media document
    const mediaId = new ObjectId()

    // Insert directly into media collection, bypassing Payload validation entirely
    await db.collection('media').insertOne({
      _id: mediaId,
      alt: altText,
      filename: sanitizedFilename,
      mimeType: file.type || 'image/jpeg',
      filesize: file.size,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Store base64 in separate collection
    await db.collection('media_data').insertOne({
      mediaId: mediaId.toString(),
      base64: base64,
      mimeType: file.type || 'image/jpeg',
    })

    console.log('Media created:', mediaId.toString())

    return NextResponse.json({
      id: mediaId.toString(),
      url: `/api/media/${mediaId.toString()}/view`,
      filename: sanitizedFilename
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    console.error('Error details:', JSON.stringify({
      message: error.message,
      name: error.name,
      data: error.data,
    }, null, 2))

    return NextResponse.json(
      {
        error: error.message || 'Failed to upload file',
        details: error.data?.errors || null
      },
      { status: 500 }
    )
  }
}
