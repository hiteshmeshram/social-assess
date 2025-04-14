import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl;
  
  // Check if the user is authenticated through local storage
  // This is a simple authentication check for protected routes
  // For a real app, you'd use a more secure method like cookies
  const publicRoutes = ['/', '/api/auth/signin', '/api/auth/signup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (!isPublicRoute) {
    // For any non-public route, we'll just pass through
    // The client-side AuthContext handles actual auth redirects
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Only run middleware on relevant paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/posts/:path*',
    '/profile/:path*',
    '/api/posts/:path*',
  ],
} 