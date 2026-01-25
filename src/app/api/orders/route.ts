import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || '50'
    const page = searchParams.get('page') || '1'
    const query = searchParams.get('q')

    const payload = await getPayload({ config })

    const where: any = {}

    if (status && status !== 'all') {
      // Map frontend status to backend status if necessary
      // For now assume they match or handle 'paid' specifically
      if (status === 'paid') {
        where['payment.status'] = { equals: 'completed' }
      } else if (status === 'pending') {
        where['payment.status'] = { equals: 'pending' }
      } else {
        where.status = { equals: status }
      }
    }

    if (query) {
      where.or = [
        { orderNumber: { contains: query } },
        { 'customer.email': { contains: query } },
        { 'customer.firstName': { contains: query } },
        { 'customer.lastName': { contains: query } },
      ]
    }

    const orders = await payload.find({
      collection: 'orders',
      where,
      limit: parseInt(limit),
      page: parseInt(page),
      sort: '-createdAt',
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
