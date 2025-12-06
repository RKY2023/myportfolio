import type { LocationCoordinates, PermissionStatus } from '@/store/locationStore';

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const defaultGeolocationOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 0, // Don't use cached position
};

/**
 * Check if Geolocation API is supported by the browser
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Check the current permission status for geolocation
 */
export const checkGeolocationPermission = async (): Promise<PermissionStatus> => {
  if (!isGeolocationSupported()) {
    return 'unsupported';
  }

  // Check if Permissions API is supported
  if ('permissions' in navigator) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state as PermissionStatus;
    } catch (error) {
      console.warn('Permissions API not fully supported:', error);
      return 'prompt';
    }
  }

  return 'prompt';
};

/**
 * Convert GeolocationPosition to LocationCoordinates
 */
export const positionToCoordinates = (position: GeolocationPosition): LocationCoordinates => {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };
};

/**
 * Convert GeolocationPositionError to human-readable message
 */
export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied. Please enable location access in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information unavailable. Please check your device settings.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while getting your location.';
  }
};

/**
 * Get the current position once
 */
export const getCurrentPosition = (
  options: GeolocationOptions = defaultGeolocationOptions
): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(positionToCoordinates(position)),
      (error) => reject(new Error(getGeolocationErrorMessage(error))),
      options
    );
  });
};

/**
 * Start watching position with continuous updates
 */
export const watchPosition = (
  onSuccess: (coordinates: LocationCoordinates) => void,
  onError: (error: string) => void,
  options: GeolocationOptions = defaultGeolocationOptions
): number | null => {
  if (!isGeolocationSupported()) {
    onError('Geolocation is not supported by your browser');
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => onSuccess(positionToCoordinates(position)),
    (error) => onError(getGeolocationErrorMessage(error)),
    options
  );

  return watchId;
};

/**
 * Stop watching position
 */
export const clearWatch = (watchId: number): void => {
  if (isGeolocationSupported() && watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Request location permission by attempting to get current position
 */
export const requestLocationPermission = async (): Promise<{
  granted: boolean;
  coordinates?: LocationCoordinates;
  error?: string;
}> => {
  try {
    const coordinates = await getCurrentPosition();
    return { granted: true, coordinates };
  } catch (error) {
    return {
      granted: false,
      error: error instanceof Error ? error.message : 'Failed to get location permission',
    };
  }
};
