import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (await verifyToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
