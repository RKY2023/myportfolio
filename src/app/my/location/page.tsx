'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Flex, Heading, Button, Spinner, Text, Icon } from '@/once-ui/components';
import { useLocationStore } from '@/store/locationStore';
import {
  isGeolocationSupported,
  watchPosition,
  clearWatch,
  requestLocationPermission,
  checkGeolocationPermission,
} from '@/utils/geolocation';
import { PermissionDialog } from './components/PermissionDialog';
import { LocationError } from './components/LocationError';
import { DestinationManager } from './components/DestinationManager';
import { ProximityMonitor } from './components/ProximityMonitor';
import { useProximityNotifications } from './components/useProximityNotifications';
import { useGetDestinationsQuery } from '@/store/api/locationApi';
import type { Destination } from '@/pages/api/locations/destinations';

// Dynamically import the map to avoid SSR issues with Leaflet
const LocationMap = dynamic(
  () => import('./components/LocationMap').then((mod) => ({ default: mod.LocationMap })),
  {
    ssr: false,
    loading: () => (
      <Flex
        horizontal="center"
        vertical="center"
        style={{ height: '500px', width: '100%' }}
      >
        <Spinner size="l" />
      </Flex>
    ),
  }
);

export default function LocationPage() {
  const {
    currentLocation,
    isTracking,
    error,
    permissionStatus,
    watchId,
    setCurrentLocation,
    setIsTracking,
    setError,
    setPermissionStatus,
    setWatchId,
  } = useLocationStore();

  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Fetch destinations
  const { data: destinationsData } = useGetDestinationsQuery();

  // Proximity notifications
  const {
    showProximityNotification,
    showArrivalNotification,
    requestNotificationPermission,
  } = useProximityNotifications();

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Handle proximity notification
  const handleProximityAlert = (destination: Destination, eta: number, distance: number) => {
    showProximityNotification(destination, eta, distance);
  };

  // Handle arrival
  const handleArrival = (destination: Destination) => {
    showArrivalNotification(destination, () => {
      // TODO: Create diary entry
      console.log('Create diary entry for:', destination.name);
    });
  };

  // Check if geolocation is supported
  useEffect(() => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by your browser');
      setPermissionStatus('unsupported');
    } else {
      // Check permission status on mount
      checkGeolocationPermission().then((status) => {
        setPermissionStatus(status);
        if (status === 'granted') {
          startTracking();
        }
      });
    }

    return () => {
      // Cleanup watch on unmount
      if (watchId !== null) {
        clearWatch(watchId);
      }
    };
  }, []);

  const startTracking = () => {
    setError(null);
    setIsTracking(true);

    const id = watchPosition(
      (coordinates) => {
        setCurrentLocation(coordinates);
        setError(null);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsTracking(false);
      }
    );

    if (id !== null) {
      setWatchId(id);
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const result = await requestLocationPermission();
    setIsRequestingPermission(false);

    if (result.granted) {
      setPermissionStatus('granted');
      setShowPermissionDialog(false);
      if (result.coordinates) {
        setCurrentLocation(result.coordinates);
      }
      startTracking();
    } else {
      setPermissionStatus('denied');
      setError(result.error || 'Location permission denied');
      setShowPermissionDialog(false);
    }
  };

  const handleEnableTracking = () => {
    if (permissionStatus === 'granted') {
      startTracking();
    } else {
      setShowPermissionDialog(true);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (permissionStatus === 'granted') {
      startTracking();
    } else {
      setShowPermissionDialog(true);
    }
  };

  return (
    <Flex
      fillWidth
      direction="column"
      gap="24"
      padding="24"
    >
      {/* Header */}
      <Flex
        direction="row"
        horizontal="space-between"
        vertical="center"
        wrap
        gap="16"
      >
        <Flex direction="column" gap="8">
          <Heading as="h1" variant="display-strong-s">
            Live Location Tracking
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Track your current location and set destination waypoints
          </Text>
        </Flex>

        <Flex gap="12">
          {isTracking ? (
            <Button
              variant="secondary"
              label="Stop Tracking"
              prefixIcon="pause"
              onClick={stopTracking}
            />
          ) : (
            <Button
              variant="primary"
              label="Start Tracking"
              prefixIcon="location"
              onClick={handleEnableTracking}
            />
          )}
        </Flex>
      </Flex>

      {/* Location Status */}
      {currentLocation && (
        <Flex
          direction="row"
          gap="16"
          padding="16"
          radius="l"
          background="neutral-alpha-weak"
          wrap
        >
          <Flex direction="column" gap="4">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Latitude
            </Text>
            <Text variant="body-default-m">
              {currentLocation.lat.toFixed(6)}
            </Text>
          </Flex>
          <Flex direction="column" gap="4">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Longitude
            </Text>
            <Text variant="body-default-m">
              {currentLocation.lng.toFixed(6)}
            </Text>
          </Flex>
          <Flex direction="column" gap="4">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Accuracy
            </Text>
            <Text variant="body-default-m">
              ±{Math.round(currentLocation.accuracy)}m
            </Text>
          </Flex>
          <Flex direction="column" gap="4">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Status
            </Text>
            <Flex gap="8" vertical="center">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isTracking ? '#10b981' : '#6b7280',
                }}
              />
              <Text variant="body-default-m">
                {isTracking ? 'Tracking' : 'Not tracking'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}

      {/* Two Column Layout: Map + Destinations */}
      <Flex gap="24" wrap vertical="start">
        {/* Map Column */}
        <Flex
          direction="column"
          style={{
            flex: '2',
            minWidth: '400px',
            height: '600px',
            position: 'relative',
          }}
        >
          {error ? (
            <LocationError error={error} onRetry={handleRetry} />
          ) : currentLocation ? (
            <div style={{ width: '100%', height: '100%' }}>
              <LocationMap
                center={currentLocation}
                destinations={destinationsData?.results || []}
              />
            </div>
          ) : (
            <Flex
              fillWidth
              horizontal="center"
              vertical="center"
              direction="column"
              gap="16"
              style={{ height: '100%' }}
            >
              <Spinner size="l" />
              <Text variant="body-default-m" onBackground="neutral-weak">
                Getting your location...
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Destinations Column */}
        <Flex
          direction="column"
          style={{
            flex: '1',
            minWidth: '300px',
          }}
        >
          <DestinationManager />
        </Flex>
      </Flex>

      {/* Permission Dialog */}
      <PermissionDialog
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onRequestPermission={handleRequestPermission}
        isLoading={isRequestingPermission}
      />

      {/* Proximity Monitor (background component) */}
      {isTracking && (
        <ProximityMonitor
          onNotify={handleProximityAlert}
          onArrived={handleArrival}
        />
      )}
    </Flex>
  );
}
