import { NextRequest, NextResponse } from 'next/server';
import { timelineStore } from '@/lib/data-store';
import { TimelineEventUpdateSchema, parseBody } from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  const event = timelineStore.getById(eventId);

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  // Parse and validate request body
  const parsed = await parseBody(request, TimelineEventUpdateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = timelineStore.update(eventId, parsed.data);

  if (!updated) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  const deleted = timelineStore.delete(eventId);

  if (!deleted) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PATCH, DELETE, OPTIONS',
    },
  });
}
