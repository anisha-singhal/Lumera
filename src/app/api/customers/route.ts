import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    const page = searchParams.get('page') || '1'
    const query = searchParams.get('q')

    const payload = await getPayload({ config })

    const where: any = {}

    if (query) {
      where.or = [
        { email: { contains: query } },
        { name: { contains: query } },
      ]
    }

    const customers = await payload.find({
      collection: 'users',
      where,
      limit: parseInt(limit),
      page: parseInt(page),
      sort: '-createdAt',
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
