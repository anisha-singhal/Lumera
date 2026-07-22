import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Canonical collection definitions. Old names/slugs are matched loosely so this
// is safe to re-run at any time (idempotent) and tolerant of trailing spaces.
const CANONICAL = [
  { match: ['moments', 'the prestige collection', 'prestige'], name: 'The Prestige Collection', slug: 'prestige', collectionType: 'prestige' },
  { match: ['ritual', 'the state of being series', 'state of being', 'state-of-being'], name: 'The State of Being Series', slug: 'state-of-being', collectionType: 'state-of-being' },
  { match: ['signature', 'the mineral & texture edit', 'mineral & texture', 'mineral-texture'], name: 'The Mineral & Texture Edit', slug: 'mineral-texture', collectionType: 'mineral-texture' },
  { match: ["valentine's collection", 'valentines collection', 'valentine', 'valentines'], name: "Valentine's Collection", slug: 'valentines', collectionType: 'limited' },
]

const norm = (s: string) => (s || '').trim().toLowerCase()

export async function POST() {
  try {
    const payload = await getPayload({ config })

    const { docs: collections } = await payload.find({
      collection: 'collections',
      limit: 100,
    })

    const results: any[] = []

    for (const target of CANONICAL) {
      const existing = collections.find(
        (c: any) => target.match.includes(norm(c.name)) || target.match.includes(norm(c.slug)),
      )

      if (existing) {
        await payload.update({
          collection: 'collections',
          id: existing.id,
          overrideAccess: true,
          data: { name: target.name, slug: target.slug, status: 'active', collectionType: target.collectionType as any },
        })
        results.push({ updated: existing.name, to: target.name })
      } else {
        await payload.create({
          collection: 'collections',
          overrideAccess: true,
          data: {
            name: target.name,
            slug: target.slug,
            collectionType: target.collectionType as any,
            status: 'active',
          },
        })
        results.push({ created: target.name })
      }
    }

    return NextResponse.json({ success: true, message: 'Collections synced', results })
  } catch (error) {
    console.error('Error updating collections:', error)
    return NextResponse.json(
      { error: 'Failed to update collections', details: String(error) },
      { status: 500 },
    )
  }
}
