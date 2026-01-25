import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Fetch all orders to calculate revenue
    const orders = await payload.find({
      collection: 'orders',
      limit: 1000, // Reasonable limit for now
    })

    const totalOrders = orders.totalDocs
    const totalRevenue = orders.docs.reduce((sum, order: any) => {
      // Only count paid orders for revenue
      if (order.status === 'delivered' || order.payment?.status === 'completed') {
        return sum + (order.pricing?.total || 0)
      }
      return sum
    }, 0)

    // Fetch customer counts
    const customers = await payload.find({
      collection: 'users',
      limit: 1,
    })
    const totalCustomers = customers.totalDocs

    // Fetch recent orders for the dashboard preview
    const recentOrders = await payload.find({
      collection: 'orders',
      limit: 5,
      sort: '-createdAt',
    })

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
      },
      recentOrders: recentOrders.docs.map((order: any) => ({
        id: order.orderNumber,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        amount: order.pricing.total,
        status: order.payment?.status === 'completed' ? 'Paid' : 'Pending',
      })),
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
