import { NextRequest, NextResponse } from 'next/server';
import { diaryStore } from '@/lib/data-store';
import { DiaryEntryUpdateSchema, parseBody } from '@/lib/validation';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const entryId = parseInt(id, 10);

  if (isNaN(entryId)) {
    return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
  }

  const entry = diaryStore.getById(entryId);

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const entryId = parseInt(id, 10);

  if (isNaN(entryId)) {
    return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
  }

  // Parse and validate request body
  const parsed = await parseBody(request, DiaryEntryUpdateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = diaryStore.update(entryId, parsed.data);

  if (!updated) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const entryId = parseInt(id, 10);

  if (isNaN(entryId)) {
    return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
  }

  const deleted = diaryStore.delete(entryId);

  if (!deleted) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
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
