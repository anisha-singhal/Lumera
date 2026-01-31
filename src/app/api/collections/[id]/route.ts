import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const collection = await payload.update({
      collection: 'collections',
      id,
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || undefined,
      },
      overrideAccess: true,
    })

    return NextResponse.json(collection)
  } catch (error: any) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    await payload.delete({
      collection: 'collections',
      id,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete collection' },
      { status: 500 }
    )
  }
}
