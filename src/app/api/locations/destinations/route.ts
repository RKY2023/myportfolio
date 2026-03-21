import { NextRequest, NextResponse } from 'next/server';
import { destinationStore } from '@/lib/data-store';
import { DestinationCreateSchema, parseBody } from '@/lib/validation';

export async function GET() {
  const destinations = destinationStore.getAll();

  return NextResponse.json({
    results: destinations,
    count: destinations.length,
  });
}

export async function POST(request: NextRequest) {
  // Parse and validate request body
  const parsed = await parseBody(request, DestinationCreateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // Ensure defaults are applied (Zod defaults are guaranteed but TS needs help)
  const destinationData = {
    ...parsed.data,
    notifyBefore: parsed.data.notifyBefore ?? 1,
    radius: parsed.data.radius ?? 100,
    isActive: parsed.data.isActive ?? false,
  };

  const destination = destinationStore.create(destinationData);
  return NextResponse.json(destination, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}
