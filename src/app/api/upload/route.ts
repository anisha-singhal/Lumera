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

    // Generate unique ID first
    const mediaId = new ObjectId()

    // Sanitize filename and make it unique with ID
    const baseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50)
    const extension = file.name.split('.').pop() || 'jpg'
    const sanitizedFilename = `${baseName}_${mediaId.toString()}.${extension}`

    const altText = baseName.replace(/_/g, ' ')

    console.log('Processing upload:', sanitizedFilename, 'type:', file.type, 'size:', file.size)

    // Get Payload instance just to access MongoDB connection
    console.log('Getting Payload instance...')
    const payload = await getPayload({ config })

    // Access MongoDB directly through Payload's db adapter
    console.log('Accessing MongoDB...')
    const mongoose = (payload.db as any).connection
    const db = mongoose.db

    // Insert directly into media collection
    console.log('Inserting into media collection...')
    try {
      await db.collection('media').insertOne({
        _id: mediaId,
        alt: altText,
        filename: sanitizedFilename,
        mimeType: file.type || 'image/jpeg',
        filesize: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (insertErr: any) {
      console.error('Error inserting into media:', insertErr.message)
      throw new Error(`Media insert failed: ${insertErr.message}`)
    }

    // Store base64 in separate collection
    console.log('Inserting into media_data collection...')
    try {
      await db.collection('media_data').insertOne({
        _id: new ObjectId(),
        mediaId: mediaId.toString(),
        base64: base64,
        mimeType: file.type || 'image/jpeg',
      })
    } catch (dataErr: any) {
      console.error('Error inserting into media_data:', dataErr.message)
      throw new Error(`Media data insert failed: ${dataErr.message}`)
    }

    console.log('Media created successfully:', mediaId.toString())

    return NextResponse.json({
      id: mediaId.toString(),
      url: `/api/media/${mediaId.toString()}/view`,
      filename: sanitizedFilename
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error.message)

    return NextResponse.json(
      {
        error: error.message || 'Failed to upload file',
      },
      { status: 500 }
    )
  }
}
