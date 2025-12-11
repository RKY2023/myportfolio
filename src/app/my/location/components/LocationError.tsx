'use client';

import { Flex, Text, Icon, Button } from '@/once-ui/components';

interface LocationErrorProps {
  error: string;
  onRetry?: () => void;
}

export function LocationError({ error, onRetry }: LocationErrorProps) {
  return (
    <Flex
      direction="column"
      gap="16"
      horizontal="center"
      vertical="center"
      padding="32"
      style={{ height: '100%' }}
    >
      <Icon name="warning" size="xl" />
      <Flex direction="column" gap="8" horizontal="center" align="center">
        <Text variant="heading-strong-l">Location Error</Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          {error}
        </Text>
      </Flex>
      {onRetry && (
        <Button
          variant="primary"
          label="Try Again"
          onClick={onRetry}
        />
      )}
    </Flex>
  );
}
