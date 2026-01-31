import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'

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

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    // Convert File to Buffer and save temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a temporary file
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}-${file.name}`)
    await fs.writeFile(tempFilePath, buffer)

    try {
      // Create the media document using file path
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: file.name.replace(/\.[^/.]+$/, ''),
        },
        filePath: tempFilePath,
        overrideAccess: true,
      })

      // Clean up temp file
      await fs.unlink(tempFilePath).catch(() => {})

      return NextResponse.json({ id: media.id, url: media.url }, { status: 201 })
    } catch (payloadError) {
      // Clean up temp file on error
      await fs.unlink(tempFilePath).catch(() => {})
      throw payloadError
    }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
