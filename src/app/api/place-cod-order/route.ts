import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { orderData } = body

        // Initialize Payload
        const payload = await getPayloadClient()

        // Map items to schema structure
        const orderItems = orderData.items.map((item: any) => ({
            product: item.id,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
        }))

        const newOrder = await payload.create({
            collection: 'orders',
            data: {
                orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
                customer: {
                    email: orderData.email,
                    phone: orderData.phone,
                    firstName: orderData.firstName,
                    lastName: orderData.lastName || '',
                },
                shippingAddress: {
                    addressLine1: orderData.shippingAddress.addressLine1,
                    addressLine2: orderData.shippingAddress.addressLine2,
                    city: orderData.shippingAddress.city,
                    state: orderData.shippingAddress.state,
                    pincode: orderData.shippingAddress.pincode,
                    country: 'India',
                },
                items: orderItems,
                pricing: {
                    subtotal: orderData.subtotal,
                    shipping: {
                        method: 'standard',
                        cost: orderData.shippingCost || 0,
                    },
                    tax: {
                        rate: 18,
                        amount: 0,
                    },
                    total: orderData.total,
                    discount: {
                        code: orderData.couponCode,
                        amount: orderData.couponDiscount || 0,
                    }
                },
                payment: {
                    method: 'cod',
                    status: 'pending', // Pending payment for COD
                    transactionId: `COD-${Date.now()}`,
                    paidAt: undefined, // Not paid yet
                },
                status: 'confirmed', // Order confirmed, but payment pending
                customerNotes: orderData.orderNote,
            },
        })

        return NextResponse.json({
            success: true,
            orderId: newOrder.orderNumber,
            message: 'Order placed successfully (COD)',
        })
    } catch (error: any) {
        console.error('Error placing COD order:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Order placement failed' },
            { status: 500 }
        )
    }
}
