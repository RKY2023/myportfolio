'use client';

import { Dialog, Flex, Button, Text, Icon } from '@/once-ui/components';

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
  isLoading?: boolean;
}

export function PermissionDialog({
  isOpen,
  onClose,
  onRequestPermission,
  isLoading = false
}: PermissionDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Location Access Required"
      description="This feature needs access to your location to track your position and notify you when approaching destinations."
    >
      <Flex direction="column" gap="24" padding="16">
        <Flex direction="column" gap="12">
          <Flex gap="12" vertical="center">
            <Icon name="location" size="l" />
            <Text variant="body-default-m">
              Live location tracking on the map
            </Text>
          </Flex>
          <Flex gap="12" vertical="center">
            <Icon name="bell" size="l" />
            <Text variant="body-default-m">
              Proximity notifications before reaching destinations
            </Text>
          </Flex>
          <Flex gap="12" vertical="center">
            <Icon name="lock" size="l" />
            <Text variant="body-default-m">
              Your location is private and stored only on your device
            </Text>
          </Flex>
        </Flex>

        <Flex gap="12" horizontal="end">
          <Button
            variant="secondary"
            label="Cancel"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            label={isLoading ? "Requesting..." : "Allow Location Access"}
            onClick={onRequestPermission}
            disabled={isLoading}
          />
        </Flex>
      </Flex>
    </Dialog>
  );
}
