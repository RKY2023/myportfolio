import { NextRequest, NextResponse } from 'next/server';
import { diaryStore } from '@/lib/data-store';
import {
  DiaryEntryCreateSchema,
  DiaryEntryQuerySchema,
  parseBody,
  parseQuery,
} from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse and validate query parameters
  const queryResult = parseQuery(searchParams, DiaryEntryQuerySchema);
  if (!queryResult.success) {
    return NextResponse.json({ error: queryResult.error }, { status: 400 });
  }

  const {
    startDate,
    endDate,
    mood,
    search,
    page = 1,
    page_size = 10,
    ordering = '-entryDate'
  } = queryResult.data;

  // Get all entries and filter
  let filtered = diaryStore.getAll();

  if (startDate) {
    filtered = filtered.filter(entry => entry.entryDate >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(entry => entry.entryDate <= endDate);
  }

  if (mood) {
    filtered = filtered.filter(entry => entry.mood === mood);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      entry =>
        entry.title.toLowerCase().includes(searchLower) ||
        entry.content?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  const field = ordering.replace('-', '') || 'entryDate';
  const isDescending = ordering.startsWith('-');

  filtered.sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[field] || '';
    const bVal = (b as unknown as Record<string, unknown>)[field] || '';

    if (aVal < bVal) return isDescending ? 1 : -1;
    if (aVal > bVal) return isDescending ? -1 : 1;
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
  const parsed = await parseBody(request, DiaryEntryCreateSchema);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // Ensure defaults are applied (Zod defaults are guaranteed but TS needs help)
  const entryData = {
    ...parsed.data,
    tags: parsed.data.tags ?? [],
    visibility: parsed.data.visibility ?? 'private' as const,
    isPinned: parsed.data.isPinned ?? false,
    isFavorite: parsed.data.isFavorite ?? false,
    isArchived: parsed.data.isArchived ?? false,
  };

  const entry = diaryStore.create(entryData);
  return NextResponse.json(entry, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}
