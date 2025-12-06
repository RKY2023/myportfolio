'use client';

import { useState, useMemo, useRef } from 'react';
import { Flex, Heading, Button, Text, Spinner } from '@/once-ui/components';
import { DestinationForm } from './DestinationForm';
import { DestinationCard } from './DestinationCard';
import {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
  useSetActiveDestinationMutation,
  useMarkDestinationArrivedMutation,
} from '@/store/api/locationApi';
import { useLocationStore } from '@/store/locationStore';
import { calculateDistance, calculateSpeed, calculateETA } from '@/utils/distanceCalculator';
import type { Destination } from '@/pages/api/locations/destinations';
import type { LocationCoordinates } from '@/store/locationStore';

type DestinationWithMetrics = Destination & {
  distance?: number;
  eta?: number;
};

export function DestinationManager() {
  const [showForm, setShowForm] = useState(false);
  const { currentLocation } = useLocationStore();
  const locationHistory = useRef<LocationCoordinates[]>([]);

  // RTK Query hooks
  const { data, isLoading, error } = useGetDestinationsQuery();
  const [createDestination, { isLoading: isCreating }] = useCreateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();
  const [setActive] = useSetActiveDestinationMutation();
  const [markArrived] = useMarkDestinationArrivedMutation();

  // Update location history for speed calculation
  if (currentLocation) {
    locationHistory.current.push(currentLocation);
    if (locationHistory.current.length > 10) {
      locationHistory.current.shift();
    }
  }

  // Calculate distance and ETA for each destination
  const destinationsWithMetrics = useMemo<DestinationWithMetrics[]>(() => {
    if (!data?.results || !currentLocation) {
      return data?.results || [];
    }

    const speed = calculateSpeed(locationHistory.current);

    return data.results.map((destination): DestinationWithMetrics => {
      const { distance } = calculateDistance(
        { lat: currentLocation.lat, lng: currentLocation.lng },
        { lat: destination.lat, lng: destination.lng }
      );

      let eta: number | undefined;
      if (destination.isActive && speed > 0) {
        const result = calculateETA(distance, speed);
        eta = result.eta;
      }

      return {
        ...destination,
        distance,
        eta,
      };
    });
  }, [data?.results, currentLocation]);

  const handleCreate = async (destination: Partial<Destination>) => {
    try {
      await createDestination(destination).unwrap();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create destination:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteDestination(id).unwrap();
      } catch (error) {
        console.error('Failed to delete destination:', error);
      }
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActive(id).unwrap();
    } catch (error) {
      console.error('Failed to set active destination:', error);
    }
  };

  const handleMarkArrived = async (id: string) => {
    try {
      await markArrived(id).unwrap();
    } catch (error) {
      console.error('Failed to mark as arrived:', error);
    }
  };

  return (
    <Flex direction="column" gap="16" fillWidth>
      {/* Header */}
      <Flex direction="row" horizontal="space-between" vertical="center">
        <Heading as="h2" variant="heading-strong-m">
          Destinations
        </Heading>
        <Button
          variant="primary"
          label="Add Destination"
          prefixIcon="location"
          size="s"
          onClick={() => setShowForm(true)}
        />
      </Flex>

      {/* Loading State */}
      {isLoading && (
        <Flex horizontal="center" padding="32">
          <Spinner size="l" />
        </Flex>
      )}

      {/* Error State */}
      {error && (
        <Flex
          direction="column"
          gap="8"
          padding="16"
          radius="m"
          background="danger-alpha-weak"
        >
          <Text variant="body-default-m">Failed to load destinations</Text>
        </Flex>
      )}

      {/* Empty State */}
      {!isLoading && !error && data?.results.length === 0 && (
        <Flex
          direction="column"
          gap="12"
          horizontal="center"
          padding="32"
          radius="l"
          background="neutral-alpha-weak"
          align="center"
        >
          <Text variant="heading-strong-s">No destinations yet</Text>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Add your first destination to start tracking your journey
          </Text>
          <Button
            variant="primary"
            label="Add Destination"
            onClick={() => setShowForm(true)}
          />
        </Flex>
      )}

      {/* Destinations List */}
      {destinationsWithMetrics && destinationsWithMetrics.length > 0 && (
        <Flex direction="column" gap="12">
          {destinationsWithMetrics.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSetActive={handleSetActive}
              onDelete={handleDelete}
              onMarkArrived={handleMarkArrived}
              distance={destination.distance}
              eta={destination.eta}
            />
          ))}
        </Flex>
      )}

      {/* Add Destination Form */}
      <DestinationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </Flex>
  );
}
