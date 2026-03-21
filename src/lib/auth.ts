// Auth secret for signing tokens - should be in environment variable
const AUTH_SECRET = process.env.AUTH_SECRET || 'default-secret-change-in-production';

// Token expiration time (1 hour in seconds)
const TOKEN_EXPIRY = 60 * 60;

// Cookie names
export const AUTH_COOKIE = 'authToken';
export const MY_AUTH_COOKIE = 'myAuthToken';

interface TokenPayload {
  id: string;
  exp: number;
}

/**
 * Convert string to Uint8Array for Web Crypto API
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert ArrayBuffer to hex string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Sign a payload using HMAC-SHA256 (Web Crypto API)
 */
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    stringToUint8Array(payload)
  );

  return arrayBufferToHex(signature);
}

/**
 * Base64url encode
 */
function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64url decode
 */
function base64urlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

/**
 * Generate a secure authentication token
 * Returns: base64 encoded token with signature
 */
export async function generateToken(): Promise<string> {
  const payload: TokenPayload = {
    id: crypto.randomUUID(),
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY,
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64urlEncode(payloadStr);
  const signature = await sign(payloadB64);

  return `${payloadB64}.${signature}`;
}

/**
 * Verify a token's signature and expiration
 * Returns: true if valid, false otherwise
 */
export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  // Verify signature
  const expectedSignature = await sign(payloadB64);
  if (signature !== expectedSignature) {
    return false;
  }

  // Verify expiration
  try {
    const payloadStr = base64urlDecode(payloadB64);
    const payload: TokenPayload = JSON.parse(payloadStr);

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get cookie options for auth tokens
 */
export function getCookieOptions(isProduction: boolean = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure: isProduction,
    maxAge: TOKEN_EXPIRY,
    sameSite: 'strict' as const,
    path: '/',
  };
}

/**
 * Check if request has valid auth from cookie header string
 */
export async function isAuthenticatedFromCookieString(
  cookieString: string | null,
  cookieName: string = AUTH_COOKIE
): Promise<boolean> {
  if (!cookieString) return false;

  // Parse cookies manually from header string
  const cookiePairs = cookieString.split(';').map(c => c.trim());
  for (const pair of cookiePairs) {
    const [name, ...valueParts] = pair.split('=');
    if (name === cookieName) {
      const value = valueParts.join('=');
      return verifyToken(value);
    }
  }

  return false;
}

// ============================================================
// Rate Limiting
// ============================================================

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if an IP is rate limited for authentication
 * Returns: { allowed: boolean, remainingAttempts: number, retryAfter?: number }
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No previous attempts
  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfter };
  }

  // Check if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check remaining attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0, retryAfter: Math.ceil(WINDOW_MS / 1000) };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - entry.attempts };
}

/**
 * Record a failed authentication attempt
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
    });
    return;
  }

  entry.attempts++;

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
  }
}

/**
 * Clear rate limit for an IP (e.g., after successful login)
 */
export function clearRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         headers.get('x-real-ip') ||
         'unknown';
}
