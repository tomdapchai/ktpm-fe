import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  scope: string; // role
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Allow API authentication endpoints to proceed without redirection
  if (path.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  if (path.startsWith('/auth') || path === '/') {
    // If user is already logged in, redirect to dashboard
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
          // Token is valid, redirect based on role
          const role = decoded.scope;
          
          if (role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/staff', request.url));
          } else if (role === 'STAFF') {
            return NextResponse.redirect(new URL('/staff/me', request.url));
          } else if (role === 'PATIENT') {
            return NextResponse.redirect(new URL('/patient/me', request.url));
          }
        }
      } catch (error) {
        // Token decode failed, continue to login page
        console.error('Token decode error:', error);
      }
    }
    return NextResponse.next();
  }

  // Protected routes - check authentication
  if (!token) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token expired, redirect to login
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    const role = decoded.scope;

    // Check role-based access
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (path.startsWith('/me') && role !== 'STAFF') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (path.startsWith('/patient') && role !== 'PATIENT') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
