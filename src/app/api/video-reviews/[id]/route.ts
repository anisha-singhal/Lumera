import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const payload = await getPayload({ config })
    const item = await payload.update({
      collection: 'video-reviews',
      id,
      data: body,
      overrideAccess: true,
    })
    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error updating video review:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update video review' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    await payload.delete({ collection: 'video-reviews', id, overrideAccess: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video review:', error)
    return NextResponse.json({ error: 'Failed to delete video review' }, { status: 500 })
  }
}
