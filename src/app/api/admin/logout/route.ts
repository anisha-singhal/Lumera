import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_auth')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
