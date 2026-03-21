import { z } from 'zod';

// ============================================================
// Authentication
// ============================================================

export const PasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type PasswordInput = z.infer<typeof PasswordSchema>;

// ============================================================
// Diary Entry Schemas
// ============================================================

export const DiaryEntryCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().optional(),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  entryTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:mm)').optional(),
  mood: z.string().max(50).optional(),
  moodScore: z.number().int().min(1).max(10).optional(),
  weather: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  visibility: z.enum(['private', 'public', 'shared']).default('private'),
  isPinned: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export const DiaryEntryUpdateSchema = DiaryEntryCreateSchema.partial();

export const DiaryEntryQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  mood: z.string().optional(),
  tags: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
  ordering: z.string().default('-entryDate'),
});

export type DiaryEntryCreate = z.infer<typeof DiaryEntryCreateSchema>;
export type DiaryEntryUpdate = z.infer<typeof DiaryEntryUpdateSchema>;
export type DiaryEntryQuery = z.infer<typeof DiaryEntryQuerySchema>;

// ============================================================
// Timeline Event Schemas
// ============================================================

export const TimelineEventCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  category: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
});

export const TimelineEventUpdateSchema = TimelineEventCreateSchema.partial();

export const TimelineEventQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
  ordering: z.string().default('-date'),
});

export type TimelineEventCreate = z.infer<typeof TimelineEventCreateSchema>;
export type TimelineEventUpdate = z.infer<typeof TimelineEventUpdateSchema>;
export type TimelineEventQuery = z.infer<typeof TimelineEventQuerySchema>;

// ============================================================
// Checkpoint Schemas
// ============================================================

export const CheckpointCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().datetime().optional(),
});

export const CheckpointQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
});

export type CheckpointCreate = z.infer<typeof CheckpointCreateSchema>;
export type CheckpointQuery = z.infer<typeof CheckpointQuerySchema>;

// ============================================================
// Destination/Location Schemas
// ============================================================

export const DestinationCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  address: z.string().min(1, 'Address is required').max(500),
  lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90),
  lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180),
  notifyBefore: z.number().int().min(0).max(120).default(1),
  radius: z.number().int().min(10).max(10000).default(100),
  isActive: z.boolean().default(false),
});

export const DestinationUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().min(1).max(500).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  notifyBefore: z.number().int().min(0).max(120).optional(),
  radius: z.number().int().min(10).max(10000).optional(),
  isActive: z.boolean().optional(),
  arrivedAt: z.string().datetime().optional().nullable(),
});

export type DestinationCreate = z.infer<typeof DestinationCreateSchema>;
export type DestinationUpdate = z.infer<typeof DestinationUpdateSchema>;

// ============================================================
// Geocode Schema
// ============================================================

export const GeocodeQuerySchema = z.object({
  q: z.string().max(200).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  reverse: z.enum(['true', 'false']).optional(),
}).refine(
  (data) => {
    // Either forward geocoding (q) or reverse geocoding (lat + lon + reverse)
    if (data.reverse === 'true') {
      return data.lat !== undefined && data.lon !== undefined;
    }
    return data.q !== undefined;
  },
  { message: 'Must provide either "q" for forward geocoding or "lat", "lon", "reverse=true" for reverse geocoding' }
);

export type GeocodeQuery = z.infer<typeof GeocodeQuerySchema>;

// ============================================================
// Utility: Parse and validate request body
// ============================================================

export async function parseBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: errors };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON body' };
  }
}

/**
 * Parse URL search params with schema
 */
export function parseQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: errors };
  }

  return { success: true, data: result.data };
}
