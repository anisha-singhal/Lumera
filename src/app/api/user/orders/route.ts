import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Get the logged-in user's session
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config })

    // Fetch orders for this user's email
    const orders = await payload.find({
      collection: 'orders',
      where: {
        'customer.email': { equals: session.user.email },
      },
      sort: '-createdAt',
      limit: 50,
    })

    // Transform orders to match the frontend Order interface
    const transformedOrders = orders.docs.map((order: any) => ({
      id: order.orderNumber || order.id,
      createdAt: order.createdAt,
      status: order.status || 'pending',
      total: order.pricing?.total || 0,
      paymentMethod: order.payment?.method || 'unknown',
      items: (order.items || []).map((item: any) => ({
        id: item.id || item.product,
        name: item.productName,
        slug: item.product?.slug || 'product',
        price: item.unitPrice,
        quantity: item.quantity,
        image: '', // Product images would need to be fetched separately
        fragrance: item.fragrance || undefined,
        customOptions: item.customOptions || undefined,
        isCustomCandle: item.isCustomCandle || false,
      })),
      shippingAddress: {
        fullName: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
        phone: order.customer?.phone || '',
        email: order.customer?.email || '',
        addressLine1: order.shippingAddress?.addressLine1 || '',
        addressLine2: order.shippingAddress?.addressLine2 || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        pincode: order.shippingAddress?.pincode || '',
      },
    }))

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
