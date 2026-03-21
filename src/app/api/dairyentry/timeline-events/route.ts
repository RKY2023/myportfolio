import { NextRequest, NextResponse } from 'next/server';
import { timelineStore } from '@/lib/data-store';
import {
  TimelineEventCreateSchema,
  TimelineEventQuerySchema,
  parseBody,
  parseQuery,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse and validate query parameters
  const queryResult = parseQuery(searchParams, TimelineEventQuerySchema);
  if (!queryResult.success) {
    return NextResponse.json({ error: queryResult.error }, { status: 400 });
  }

  const {
    startDate,
    endDate,
    page = 1,
    page_size = 10,
    ordering = '-date'
  } = queryResult.data;

  // Get all events and filter
  let filtered = timelineStore.getAll();

  if (startDate) {
    filtered = filtered.filter(event => event.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(event => event.date <= endDate);
  }

  // Sort
  const isDescending = ordering.startsWith('-');
  filtered.sort((a, b) => {
    if (a.date < b.date) return isDescending ? 1 : -1;
    if (a.date > b.date) return isDescending ? -1 : 1;
    return 0;
  });

  // Paginate
  const start = (page - 1) * page_size;
  const end = start + page_size;
  const results = filtered.slice(start, end);

  return NextResponse.json({
    count: filtered.length,
    results,
    next: end < filtered.length ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
  });
}

export async function POST(request: NextRequest) {
  // Parse and validate request body
  const parsed = await parseBody(request, TimelineEventCreateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const event = timelineStore.create(parsed.data);
  return NextResponse.json(event, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}
