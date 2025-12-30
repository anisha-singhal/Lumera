import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // TODO: Connect to Payload CMS to add subscriber
    // Example integration (uncomment when connected):
    /*
    const payload = await getPayload({ config: payloadConfig })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0]

      if (subscriber.status === 'active') {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed!',
        })
      }

      // Reactivate if previously unsubscribed
      await payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: {
          status: 'active',
          unsubscribedAt: null,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Welcome back! Your subscription has been reactivated.',
      })
    }

    // Create new subscriber
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase(),
        status: 'active',
        source: 'footer',
      },
    })
    */

    // For now, just log the subscription
    console.log('Newsletter subscription:', email)

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to Lumera!',
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
