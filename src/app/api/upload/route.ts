import { NextRequest, NextResponse } from 'next/server'

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

    // Check file size (limit to 5MB for database storage)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    console.log('Processing upload:', file.name, 'type:', file.type, 'size:', file.size)

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    // Create the media document with base64 data stored in database
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name.replace(/\.[^/.]+$/, ''),
        filename: file.name,
        mimeType: file.type || 'image/jpeg',
        filesize: file.size,
        base64: base64,
      } as any,
      overrideAccess: true,
    })

    console.log('Media created:', media.id)

    return NextResponse.json({
      id: media.id,
      url: `/api/media/${media.id}/view`,
      filename: file.name
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
