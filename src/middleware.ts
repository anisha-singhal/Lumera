import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin dashboard password - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lumera2024'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /dashboard routes (except login page)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const adminAuth = request.cookies.get('admin_auth')

    // Check if authenticated
    if (!adminAuth || adminAuth.value !== 'authenticated') {
      // Redirect to login page
      const loginUrl = new URL('/dashboard/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
