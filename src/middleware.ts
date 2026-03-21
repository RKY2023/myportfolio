import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  verifyToken,
  AUTH_COOKIE,
  MY_AUTH_COOKIE,
  checkRateLimit,
  getClientIP,
} from '@/lib/auth';

// Routes that require /my authentication
const MY_PROTECTED_ROUTES = [
  '/api/dairyentry',
  '/api/locations',
];

// Auth endpoints that need rate limiting
const AUTH_ENDPOINTS = [
  '/api/authenticate',
  '/api/my/authenticate',
];

// Routes that should be protected with page access password
const PAGE_PROTECTED_ROUTES = [
  // Add routes here that need PAGE_ACCESS_PASSWORD authentication
];

/**
 * Verify token from cookie
 */
async function isAuthenticated(request: NextRequest, cookieName: string): Promise<boolean> {
  const token = request.cookies.get(cookieName)?.value;
  return await verifyToken(token);
}

/**
 * Check if route matches any protected pattern
 */
function matchesProtectedRoute(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => pathname.startsWith(pattern));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // Rate limiting for auth endpoints
  // ============================================================
  if (AUTH_ENDPOINTS.some(ep => pathname === ep)) {
    if (request.method === 'POST') {
      const ip = getClientIP(request.headers);
      const rateLimit = checkRateLimit(ip);

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Too many authentication attempts',
            retryAfter: rateLimit.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(rateLimit.retryAfter || 900),
            },
          }
        );
      }
    }
  }

  // ============================================================
  // Protected API routes requiring MY_AUTH (diary, locations)
  // ============================================================
  if (matchesProtectedRoute(pathname, MY_PROTECTED_ROUTES)) {
    const authenticated = await isAuthenticated(request, MY_AUTH_COOKIE);
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  // ============================================================
  // CORS Headers for API routes
  // ============================================================
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    const origin = request.headers.get('origin');

    // Only allow same-origin requests in production
    // For development, allow localhost
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'https://localhost:3000',
    ].filter(Boolean);

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match protected page routes if needed
    // '/my/:path*',
  ],
};
