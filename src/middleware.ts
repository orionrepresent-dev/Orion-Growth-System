import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public paths that don't require authentication
const publicPaths = ['/', '/login', '/analyze', '/icp', '/journey', '/builder', '/results', '/checkout']

// Paths that start with these prefixes are also public
const publicPathPrefixes = ['/api/auth', '/api/analyze', '/api/icp', '/api/leads', '/api/email', '/api/payments', '/api/webhooks', '/api/reports', '/checkout/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname === path) ||
    publicPathPrefixes.some(prefix => pathname.startsWith(prefix))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('auth_token')?.value

  // If accessing dashboard or other protected routes without token, redirect to login
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing protected API routes without token, return 401
  if (!token && pathname.startsWith('/api/')) {
    return NextResponse.json(
      { success: false, error: 'Não autorizado' },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
