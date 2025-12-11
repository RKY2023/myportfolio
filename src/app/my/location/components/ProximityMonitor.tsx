'use client';

import { useEffect, useState, useRef } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { useGetDestinationsQuery, useMarkDestinationArrivedMutation } from '@/store/api/locationApi';
import {
  calculateDistance,
  calculateSpeed,
  calculateETA,
  shouldNotify,
  hasArrived,
} from '@/utils/distanceCalculator';
import type { LocationCoordinates } from '@/store/locationStore';
import type { Destination } from '@/pages/api/locations/destinations';

interface ProximityMonitorProps {
  onNotify: (destination: Destination, eta: number, distance: number) => void;
  onArrived: (destination: Destination) => void;
}

export function ProximityMonitor({ onNotify, onArrived }: ProximityMonitorProps) {
  const { currentLocation } = useLocationStore();
  const { data: destinationsData } = useGetDestinationsQuery();
  const [markArrived] = useMarkDestinationArrivedMutation();

  // Store location history for speed calculation (last 30 seconds)
  const locationHistory = useRef<LocationCoordinates[]>([]);
  const notifiedDestinations = useRef<Set<string>>(new Set());
  const arrivedDestinations = useRef<Set<string>>(new Set());

  // Update location history
  useEffect(() => {
    if (!currentLocation) return;

    locationHistory.current.push(currentLocation);

    // Keep only last 10 positions (approximately 30-50 seconds of data)
    if (locationHistory.current.length > 10) {
      locationHistory.current.shift();
    }
  }, [currentLocation]);

  // Monitor active destination
  useEffect(() => {
    if (!currentLocation || !destinationsData?.results) return;

    const activeDestination = destinationsData.results.find((dest) => dest.isActive);

    if (!activeDestination) {
      // Reset notification state when no active destination
      notifiedDestinations.current.clear();
      arrivedDestinations.current.clear();
      return;
    }

    // Calculate distance to active destination
    const { distance } = calculateDistance(
      { lat: currentLocation.lat, lng: currentLocation.lng },
      { lat: activeDestination.lat, lng: activeDestination.lng }
    );

    // Check if arrived
    if (hasArrived(distance, activeDestination.radius)) {
      if (!arrivedDestinations.current.has(activeDestination.id)) {
        console.log('🎯 Arrived at destination:', activeDestination.name);
        arrivedDestinations.current.add(activeDestination.id);
        onArrived(activeDestination);

        // Mark as arrived in the backend
        markArrived(activeDestination.id);
      }
      return;
    }

    // Calculate speed and ETA
    const speed = calculateSpeed(locationHistory.current);

    if (speed === 0) {
      // Not moving, can't calculate ETA
      return;
    }

    const { eta } = calculateETA(distance, speed);

    // Check if should notify
    if (shouldNotify(distance, speed, activeDestination.notifyBefore)) {
      if (!notifiedDestinations.current.has(activeDestination.id)) {
        console.log('🔔 Proximity notification triggered:', {
          destination: activeDestination.name,
          distance: `${Math.round(distance)}m`,
          eta: `${Math.round(eta)} min`,
          speed: `${(speed * 3.6).toFixed(1)} km/h`,
        });

        notifiedDestinations.current.add(activeDestination.id);
        onNotify(activeDestination, eta, distance);
      }
    }

    // Reset notification if user moves away
    if (eta > activeDestination.notifyBefore * 2) {
      notifiedDestinations.current.delete(activeDestination.id);
    }
  }, [currentLocation, destinationsData, onNotify, onArrived, markArrived]);

  // This is a monitoring component, no UI
  return null;
}
