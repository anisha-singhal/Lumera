import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// This endpoint updates the collection names in the database
export async function POST() {
  try {
    const payload = await getPayload({ config })

    // Get all collections
    const { docs: collections } = await payload.find({
      collection: 'collections',
      limit: 100,
    })

    const updates = [
      { oldName: 'Moments', newName: 'The Prestige Collection', newSlug: 'prestige' },
      { oldName: 'Ritual', newName: 'The State of Being Series', newSlug: 'state-of-being' },
      { oldName: 'Signature', newName: 'The Mineral & Texture Edit', newSlug: 'mineral-texture' },
    ]

    const results = []

    for (const update of updates) {
      // Find collection by old name (case insensitive)
      const collection = collections.find(
        (c) => c.name.toLowerCase() === update.oldName.toLowerCase()
      )

      if (collection) {
        // Update the collection
        await payload.update({
          collection: 'collections',
          id: collection.id,
          data: {
            name: update.newName,
            slug: update.newSlug,
          },
        })
        results.push({ updated: update.oldName, to: update.newName })
      } else {
        results.push({ notFound: update.oldName })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Collections updated',
      results,
    })
  } catch (error) {
    console.error('Error updating collections:', error)
    return NextResponse.json(
      { error: 'Failed to update collections', details: String(error) },
      { status: 500 }
    )
  }
}
