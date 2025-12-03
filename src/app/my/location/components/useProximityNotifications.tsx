'use client';

import { useToast } from '@/once-ui/components';
import { Button, Flex } from '@/once-ui/components';
import type { Destination } from '@/pages/api/locations/destinations';
import { formatDistance, formatETA } from '@/utils/distanceCalculator';

export function useProximityNotifications() {
  const { addToast } = useToast();

  const showProximityNotification = (
    destination: Destination,
    eta: number,
    distance: number,
    onMarkArrived?: () => void
  ) => {
    // Play notification sound (optional)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Approaching ${destination.name}`, {
          body: `You'll arrive in ${formatETA(eta)} (${formatDistance(distance)})`,
          icon: '/favicon.ico',
          tag: destination.id,
        });
      }
    }

    // Show in-app toast
    addToast({
      variant: 'success',
      message: `📍 Arriving at ${destination.name} in ${formatETA(eta)}`,
      action: onMarkArrived ? (
        <Flex gap="8">
          <Button
            variant="primary"
            size="s"
            label="Mark Arrived"
            onClick={onMarkArrived}
          />
        </Flex>
      ) : undefined,
    });
  };

  const showArrivalNotification = (
    destination: Destination,
    onCreateDiaryEntry?: () => void
  ) => {
    // Play notification sound
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Arrived at ${destination.name}`, {
          body: 'You have reached your destination!',
          icon: '/favicon.ico',
          tag: `arrived-${destination.id}`,
        });
      }
    }

    // Vibrate (mobile)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Show in-app toast
    addToast({
      variant: 'success',
      message: `🎯 Arrived at ${destination.name}!`,
      action: onCreateDiaryEntry ? (
        <Flex gap="8">
          <Button
            variant="primary"
            size="s"
            label="Create Diary Entry"
            onClick={onCreateDiaryEntry}
          />
        </Flex>
      ) : undefined,
    });
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  };

  return {
    showProximityNotification,
    showArrivalNotification,
    requestNotificationPermission,
  };
}
