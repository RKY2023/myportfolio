export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Search for addresses using Nominatim (OpenStreetMap) geocoding via API proxy
 * @param query - The address or place name to search for
 * @returns Array of geocoding results
 */
export const searchAddress = async (
  query: string
): Promise<GeocodeResult[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/locations/geocode?${new URLSearchParams({ q: query })}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.map((item: any) => ({
      address: item.address?.road || item.address?.city || item.name || query,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Failed to search address. Please try again.");
  }
};

/**
 * Reverse geocode coordinates to get an address via API proxy
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Address string
 */
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `/api/locations/geocode?${new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        reverse: "true",
      })}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
