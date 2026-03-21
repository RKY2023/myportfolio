import { NextRequest, NextResponse } from 'next/server';
import { GeocodeQuerySchema, parseQuery } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse and validate query parameters
  const queryResult = parseQuery(searchParams, GeocodeQuerySchema);
  if (!queryResult.success) {
    return NextResponse.json({ error: queryResult.error }, { status: 400 });
  }

  const { q, lat, lon, reverse } = queryResult.data;

  try {
    let url: string;

    if (reverse === 'true' && lat !== undefined && lon !== undefined) {
      // Reverse geocoding
      url = `https://nominatim.openstreetmap.org/reverse?${new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        format: 'json',
      })}`;
    } else if (q) {
      // Forward geocoding (search)
      url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q,
        format: 'json',
        addressdetails: '1',
        limit: '5',
      })}`;
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LocationTrackingApp/1.0 (Portfolio)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to geocode address',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, OPTIONS',
    },
  });
}
