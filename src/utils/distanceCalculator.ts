import { distance as turfDistance } from '@turf/distance';
import { point } from '@turf/helpers';
import type { LocationCoordinates } from '@/store/locationStore';

export interface DistanceResult {
  distance: number; // Distance in meters
  distanceKm: number; // Distance in kilometers
}

export interface ETAResult {
  eta: number; // Estimated time in minutes
  speed: number; // Speed in meters per second
}

/**
 * Calculate distance between two points using Turf.js
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Distance in meters and kilometers
 */
export const calculateDistance = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): DistanceResult => {
  const point1 = point([from.lng, from.lat]);
  const point2 = point([to.lng, to.lat]);

  const distanceKm = turfDistance(point1, point2, { units: 'kilometers' });
  const distance = distanceKm * 1000; // Convert to meters

  return {
    distance,
    distanceKm,
  };
};

/**
 * Calculate speed from location history
 * @param locations - Array of recent location updates
 * @returns Average speed in meters per second
 */
export const calculateSpeed = (locations: LocationCoordinates[]): number => {
  if (locations.length < 2) {
    return 0;
  }

  // Calculate speed between consecutive points
  const speeds: number[] = [];

  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const curr = locations[i];

    const { distance } = calculateDistance(
      { lat: prev.lat, lng: prev.lng },
      { lat: curr.lat, lng: curr.lng }
    );

    const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // Convert to seconds

    if (timeDiff > 0) {
      const speed = distance / timeDiff; // meters per second
      speeds.push(speed);
    }
  }

  if (speeds.length === 0) {
    return 0;
  }

  // Return average speed
  const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;

  // Filter out unrealistic speeds (> 50 m/s = 180 km/h)
  return avgSpeed > 50 ? 0 : avgSpeed;
};

/**
 * Calculate ETA based on distance and speed
 * @param distance - Distance in meters
 * @param speed - Speed in meters per second
 * @returns ETA in minutes
 */
export const calculateETA = (distance: number, speed: number): ETAResult => {
  if (speed === 0 || distance === 0) {
    return { eta: 0, speed: 0 };
  }

  const timeInSeconds = distance / speed;
  const eta = timeInSeconds / 60; // Convert to minutes

  return {
    eta,
    speed,
  };
};

/**
 * Check if notification should be triggered
 * @param distance - Distance to destination in meters
 * @param speed - Current speed in m/s
 * @param notifyBefore - Notification threshold in minutes
 * @returns Whether to trigger notification
 */
export const shouldNotify = (
  distance: number,
  speed: number,
  notifyBefore: number
): boolean => {
  if (speed === 0 || distance === 0) {
    return false;
  }

  const { eta } = calculateETA(distance, speed);

  // Trigger if ETA is less than or equal to notification threshold
  return eta <= notifyBefore && eta > 0;
};

/**
 * Check if user has arrived at destination
 * @param distance - Distance to destination in meters
 * @param radius - Destination radius in meters
 * @returns Whether user has arrived
 */
export const hasArrived = (distance: number, radius: number): boolean => {
  return distance <= radius;
};

/**
 * Format distance for display
 * @param meters - Distance in meters
 * @returns Formatted distance string
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Format ETA for display
 * @param minutes - ETA in minutes
 * @returns Formatted ETA string
 */
export const formatETA = (minutes: number): string => {
  if (minutes < 1) {
    return '< 1 min';
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};
