import { NextRequest, NextResponse } from 'next/server';
import {
  generateToken,
  getCookieOptions,
  AUTH_COOKIE,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  getClientIP,
} from '@/lib/auth';
import { PasswordSchema, parseBody } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request.headers);

  // Check rate limit
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many authentication attempts',
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter || 900) },
      }
    );
  }

  // Parse and validate request body
  const parsed = await parseBody(request, PasswordSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { password } = parsed.data;
  const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

  if (!correctPassword) {
    console.error('PAGE_ACCESS_PASSWORD environment variable is not set');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    recordFailedAttempt(ip);
    return NextResponse.json(
      { error: 'Incorrect password' },
      { status: 401 }
    );
  }

  // Clear rate limit on successful auth
  clearRateLimit(ip);

  // Generate secure token
  const token = await generateToken();
  const cookieOptions = getCookieOptions();

  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE, token, cookieOptions);

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
