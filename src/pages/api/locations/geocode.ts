import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, lat, lon, reverse } = req.query;

  try {
    let url: string;

    if (reverse === 'true' && lat && lon) {
      // Reverse geocoding
      url = `https://nominatim.openstreetmap.org/reverse?${new URLSearchParams({
        lat: lat as string,
        lon: lon as string,
        format: 'json',
      })}`;
    } else if (q) {
      // Forward geocoding (search)
      url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: q as string,
        format: 'json',
        addressdetails: '1',
        limit: '5',
      })}`;
    } else {
      return res.status(400).json({ error: 'Missing required parameters' });
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

    // Add cache headers to reduce API calls
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (error) {
    console.error('Geocoding API error:', error);
    res.status(500).json({
      error: 'Failed to geocode address',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
