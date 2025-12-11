'use client';

import { useState, useEffect } from 'react';
import { Dialog, Flex, Button, Input, Text } from '@/once-ui/components';
import { searchAddress, debounce, type GeocodeResult } from '@/utils/geocoding';
import type { Destination } from '@/pages/api/locations/destinations';

interface DestinationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (destination: Partial<Destination>) => void;
  initialData?: Partial<Destination>;
  isLoading?: boolean;
}

export function DestinationForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}: DestinationFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [addressQuery, setAddressQuery] = useState(initialData?.address || '');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GeocodeResult | null>(null);
  const [notifyBefore, setNotifyBefore] = useState(initialData?.notifyBefore || 1);
  const [radius, setRadius] = useState(initialData?.radius || 100);

  // Debounced address search
  useEffect(() => {
    const search = debounce(async (query: string) => {
      if (query.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchAddress(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Address search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    if (addressQuery && !selectedResult) {
      search(addressQuery);
    }
  }, [addressQuery, selectedResult]);

  const handleSelectAddress = (result: GeocodeResult) => {
    setSelectedResult(result);
    setAddressQuery(result.displayName);
    setSearchResults([]);
    if (!name) {
      setName(result.address);
    }
  };

  const handleSubmit = () => {
    if (!name || !selectedResult) {
      return;
    }

    onSubmit({
      name,
      address: selectedResult.displayName,
      lat: selectedResult.lat,
      lng: selectedResult.lng,
      notifyBefore,
      radius,
      isActive: false,
    });

    // Reset form
    setName('');
    setAddressQuery('');
    setSelectedResult(null);
    setNotifyBefore(1);
    setRadius(100);
  };

  const handleCancel = () => {
    setName('');
    setAddressQuery('');
    setSelectedResult(null);
    setSearchResults([]);
    setNotifyBefore(1);
    setRadius(100);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCancel}
      title={initialData ? 'Edit Destination' : 'Add Destination'}
      description="Search for an address and set proximity notification settings"
    >
      <Flex direction="column" gap="20" padding="16">
        {/* Name Input */}
        <Input
          id="name"
          label="Destination Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Home, Office, Coffee Shop"
        />

        {/* Address Search */}
        <Flex direction="column" gap="8" position="relative">
          <Input
            id="address"
            label="Search Address"
            value={addressQuery}
            onChange={(e) => {
              setAddressQuery(e.target.value);
              setSelectedResult(null);
            }}
            placeholder="Enter address or place name..."
          />

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <Flex
              direction="column"
              gap="4"
              padding="8"
              radius="m"
              background="surface"
              border="neutral-medium"
              shadow="m"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10,
              }}
            >
              {searchResults.map((result, index) => (
                <Flex
                  key={index}
                  padding="8"
                  radius="s"
                  background="neutral-alpha-weak"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectAddress(result)}
                >
                  <Text variant="body-default-s">{result.displayName}</Text>
                </Flex>
              ))}
            </Flex>
          )}

          {isSearching && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              Searching...
            </Text>
          )}

          {selectedResult && (
            <Text variant="body-default-s" onBackground="brand-weak">
              ✓ Selected: {selectedResult.displayName}
            </Text>
          )}
        </Flex>

        {/* Notification Settings */}
        <Flex direction="row" gap="12">
          <Input
            id="notifyBefore"
            label="Notify (minutes before)"
            type="number"
            value={notifyBefore.toString()}
            onChange={(e) => setNotifyBefore(Number(e.target.value))}
            min="1"
            max="60"
          />
          <Input
            id="radius"
            label="Radius (meters)"
            type="number"
            value={radius.toString()}
            onChange={(e) => setRadius(Number(e.target.value))}
            min="10"
            max="1000"
          />
        </Flex>

        {/* Action Buttons */}
        <Flex gap="12" horizontal="end">
          <Button
            variant="secondary"
            label="Cancel"
            onClick={handleCancel}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            label={isLoading ? 'Saving...' : initialData ? 'Update' : 'Add'}
            onClick={handleSubmit}
            disabled={!name || !selectedResult || isLoading}
          />
        </Flex>
      </Flex>
    </Dialog>
  );
}
