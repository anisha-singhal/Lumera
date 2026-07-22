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

    if (body.rating !== undefined) {
      const rating = Number(body.rating)
      body.rating = Math.min(5, Math.max(1, isNaN(rating) ? 5 : rating))
    }

    const payload = await getPayload({ config })
    const review = await payload.update({
      collection: 'reviews',
      id,
      data: body,
      overrideAccess: true,
    })

    return NextResponse.json(review)
  } catch (error: any) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update review' },
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
    await payload.delete({ collection: 'reviews', id, overrideAccess: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
