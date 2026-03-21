import { NextRequest, NextResponse } from 'next/server';
import { checkpointStore } from '@/lib/data-store';
import {
  CheckpointCreateSchema,
  CheckpointQuerySchema,
  parseBody,
  parseQuery,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse and validate query parameters
  const queryResult = parseQuery(searchParams, CheckpointQuerySchema);
  if (!queryResult.success) {
    return NextResponse.json({ error: queryResult.error }, { status: 400 });
  }

  const { page = 1, page_size = 10 } = queryResult.data;

  // Get all checkpoints
  const all = checkpointStore.getAll();

  // Paginate
  const pageNum = page;
  const pageSize = page_size;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const results = all.slice(start, end);

  return NextResponse.json({
    count: all.length,
    results,
    next: end < all.length ? pageNum + 1 : null,
    previous: pageNum > 1 ? pageNum - 1 : null,
  });
}

export async function POST(request: NextRequest) {
  // Parse and validate request body
  const parsed = await parseBody(request, CheckpointCreateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const checkpoint = checkpointStore.create(parsed.data);
  return NextResponse.json(checkpoint, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}
