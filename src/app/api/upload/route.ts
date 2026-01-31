import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

export async function POST(request: NextRequest) {
  let tempFilePath = ''

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

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to temp directory first (Payload will move it to public/media)
    const tempDir = os.tmpdir()
    tempFilePath = path.join(tempDir, `upload-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`)
    await fs.writeFile(tempFilePath, buffer)

    console.log('Temp file saved to:', tempFilePath, 'Size:', buffer.length)

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    // Create the media document using filePath - Payload will handle file processing
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name.replace(/\.[^/.]+$/, ''),
      },
      filePath: tempFilePath,
      overrideAccess: true,
    })

    console.log('Media created:', media.id, 'filename:', media.filename)

    // Clean up temp file
    await fs.unlink(tempFilePath).catch(() => {})

    return NextResponse.json({
      id: media.id,
      url: media.url || `/media/${media.filename}`,
      filename: media.filename
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    // Clean up temp file on error
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {})
    }
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
