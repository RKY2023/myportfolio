'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LocationCoordinates } from '@/store/locationStore';
import type { Destination } from '@/pages/api/locations/destinations';

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationMapProps {
  center: LocationCoordinates;
  destinations?: Destination[];
  zoom?: number;
  showAccuracyCircle?: boolean;
}

/**
 * Component to handle map centering when location changes
 */
function MapController({ center }: { center: LocationCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);

  return null;
}

/**
 * Main map component displaying user's location and destinations
 */
export function LocationMap({
  center,
  destinations = [],
  zoom = 16,
  showAccuracyCircle = true
}: LocationMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{
        height: '100%',
        minHeight: '500px',
        width: '100%',
        borderRadius: 'var(--radius-l)',
        zIndex: 1,
      }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[center.lat, center.lng]}
        radius={8}
        pathOptions={{
          fillColor: '#3b82f6',
          fillOpacity: 1,
          color: '#ffffff',
          weight: 3,
        }}
      />
      {showAccuracyCircle && (
        <Circle
          center={[center.lat, center.lng]}
          radius={center.accuracy}
          pathOptions={{
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            color: '#3b82f6',
            weight: 1,
            dashArray: '5, 5',
          }}
        />
      )}
      {destinations.map((destination) => (
        <Marker key={destination.id} position={[destination.lat, destination.lng]}>
          <Popup>
            <div style={{ padding: '8px' }}>
              <strong>{destination.name}</strong>
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {destination.address}
              </span>
              {destination.isActive && (
                <>
                  <br />
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>
                    ● Active
                  </span>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {destinations
        .filter((dest) => dest.isActive)
        .map((destination) => (
          <Circle
            key={`circle-${destination.id}`}
            center={[destination.lat, destination.lng]}
            radius={destination.radius}
            pathOptions={{
              fillColor: '#10b981',
              fillOpacity: 0.1,
              color: '#10b981',
              weight: 2,
              dashArray: '10, 5',
            }}
          />
        ))}
      <MapController center={center} />
    </MapContainer>
  );
}
