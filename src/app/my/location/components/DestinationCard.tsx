'use client';

import { Flex, Text, Button, Icon } from '@/once-ui/components';
import type { Destination } from '@/pages/api/locations/destinations';

interface DestinationCardProps {
  destination: Destination;
  onSetActive: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkArrived?: (id: string) => void;
  distance?: number; // Distance in meters
  eta?: number; // ETA in minutes
}

export function DestinationCard({
  destination,
  onSetActive,
  onDelete,
  onMarkArrived,
  distance,
  eta,
}: DestinationCardProps) {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatETA = (minutes: number): string => {
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

  const getStatusColor = (): string => {
    if (destination.arrivedAt) return '#6b7280'; // Gray
    if (!destination.isActive) return '#9ca3af'; // Light gray
    if (eta !== undefined && eta <= destination.notifyBefore) return '#ef4444'; // Red
    if (eta !== undefined && eta <= destination.notifyBefore * 2) return '#f59e0b'; // Orange
    return '#10b981'; // Green
  };

  return (
    <Flex
      direction="column"
      gap="12"
      padding="16"
      radius="l"
      background="neutral-alpha-weak"
      border="neutral-medium"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: getStatusColor(),
      }}
    >
      {/* Header */}
      <Flex direction="row" horizontal="space-between" vertical="center">
        <Flex direction="column" gap="4">
          <Text variant="heading-strong-s">{destination.name}</Text>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {destination.address}
          </Text>
        </Flex>

        {/* Status Badge */}
        <Flex gap="8" vertical="center">
          {destination.arrivedAt ? (
            <Flex
              padding="4" paddingX="8"
              radius="s"
              background="neutral-alpha-weak"
            >
              <Text variant="label-default-s">Arrived</Text>
            </Flex>
          ) : destination.isActive ? (
            <Flex
              padding="4"
              paddingX="8"
              radius="s"
              background="brand-alpha-weak"
            >
              <Text variant="label-default-s">Active</Text>
            </Flex>
          ) : null}
        </Flex>
      </Flex>

      {/* Distance & ETA */}
      {distance !== undefined && destination.isActive && (
        <Flex direction="row" gap="16">
          <Flex direction="column" gap="4">
            <Text variant="label-default-s" onBackground="neutral-weak">
              Distance
            </Text>
            <Text variant="body-default-m">{formatDistance(distance)}</Text>
          </Flex>
          {eta !== undefined && (
            <Flex direction="column" gap="4">
              <Text variant="label-default-s" onBackground="neutral-weak">
                ETA
              </Text>
              <Text variant="body-default-m">{formatETA(eta)}</Text>
            </Flex>
          )}
        </Flex>
      )}

      {/* Settings */}
      <Flex direction="row" gap="16">
        <Flex direction="column" gap="4">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Notify Before
          </Text>
          <Text variant="body-default-s">{destination.notifyBefore} min</Text>
        </Flex>
        <Flex direction="column" gap="4">
          <Text variant="label-default-s" onBackground="neutral-weak">
            Radius
          </Text>
          <Text variant="body-default-s">{destination.radius}m</Text>
        </Flex>
      </Flex>

      {/* Actions */}
      <Flex gap="8" wrap>
        {!destination.isActive && !destination.arrivedAt && (
          <Button
            variant="secondary"
            label="Set Active"
            size="s"
            onClick={() => onSetActive(destination.id)}
          />
        )}
        {destination.isActive && onMarkArrived && (
          <Button
            variant="primary"
            label="Mark Arrived"
            size="s"
            onClick={() => onMarkArrived(destination.id)}
          />
        )}
        <Button
          variant="tertiary"
          label="Delete"
          size="s"
          onClick={() => onDelete(destination.id)}
        />
      </Flex>
    </Flex>
  );
}
