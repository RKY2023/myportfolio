import { NextRequest, NextResponse } from 'next/server';
import { destinationStore } from '@/lib/data-store';
import { DestinationUpdateSchema, parseBody } from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const destination = destinationStore.getById(id);

  if (!destination) {
    return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
  }

  return NextResponse.json(destination);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  // Parse and validate request body
  const parsed = await parseBody(request, DestinationUpdateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = destinationStore.update(id, parsed.data);

  if (!updated) {
    return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const deleted = destinationStore.delete(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Destination deleted successfully',
    destination: deleted,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PATCH, DELETE, OPTIONS',
    },
  });
}
