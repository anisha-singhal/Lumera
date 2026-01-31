import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

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

    // Get Payload instance
    const payload = await getPayload({ config })

    // First create media document WITHOUT base64 (to avoid validation issues)
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
        filename: sanitizedFilename,
        mimeType: file.type || 'image/jpeg',
        filesize: file.size,
      },
      overrideAccess: true,
    })

    // Now store base64 separately using Payload's MongoDB connection
    // Access the mongoose connection from Payload's db adapter
    const mongoose = (payload.db as any).connection
    const db = mongoose.db

    // Store base64 in a separate collection
    await db.collection('media_data').updateOne(
      { mediaId: media.id },
      { $set: { mediaId: media.id, base64: base64, mimeType: file.type || 'image/jpeg' } },
      { upsert: true }
    )

    console.log('Media created:', media.id)

    return NextResponse.json({
      id: media.id,
      url: `/api/media/${media.id}/view`,
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
