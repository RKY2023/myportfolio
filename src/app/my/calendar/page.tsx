"use client";

import { useState } from "react";
import {
  Flex,
  Column,
  Heading,
  Text,
  Card,
  Spinner,
  RevealFx,
} from "@/once-ui/components";
import { useGetTimelineEventsQuery, useCreateTimelineEventMutation } from "@/store/api/timelineApi";
import EventEditor from "../components/EventEditor";
import FloatingActionButton from "../components/FloatingActionButton";
import styles from "./page.module.scss";

const getEventTypeIcon = (eventType: string): string => {
  const icons: Record<string, string> = {
    milestone: "🏆",
    project: "💼",
    travel: "✈️",
    relationship: "❤️",
    health: "💚",
    education: "📚",
    career: "🎯",
    personal: "🌟",
    goal: "🎯",
    habit: "⚙️",
    other: "⭐",
  };
  return icons[eventType] || "📌";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Calendar() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Use RTK Query hook
  const { data: response, isLoading: loading, error } = useGetTimelineEventsQuery({
    page_size: 100,
    ordering: "-date",
  });

  const events = response?.results || [];
  const [createTimelineEvent] = useCreateTimelineEventMutation();

  const handleCreateEvent = () => {
    setIsEditorOpen(true);
  };

  const handleEventSuccess = () => {
    // RTK Query will automatically refetch events due to cache invalidation
    setIsEditorOpen(false);
  };

  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : 'message' in error
      ? (error.message as string)
      : "Failed to load calendar events"
    : null;

  if (loading) {
    return (
      <Flex fillWidth fillHeight horizontal="center" vertical="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Column fillWidth gap="24">
      <RevealFx speed="fast" delay={0} translateY="8">
        <Flex direction="column" gap="8">
          <Heading variant="heading-strong-m">Timeline Events</Heading>
          <Text variant="body-default-m" color="secondary">
            Your personal calendar and timeline of events, projects, and milestones.
          </Text>
        </Flex>
      </RevealFx>

      {errorMessage && (
        <Card padding="16" background="accent-weak">
          <Text color="critical">Error: {errorMessage}</Text>
          <Text variant="body-default-m" color="secondary" style={{ marginTop: 8 }}>
            Make sure the API is accessible at /api/dairyentry/timeline-events/
          </Text>
        </Card>
      )}

      {events.length === 0 && !errorMessage && (
        <Card padding="32" background="neutral-weak">
          <Text align="center">
            No timeline events found. Start by creating your first event!
          </Text>
        </Card>
      )}

      {/* Events Grid */}
      <div className={styles.eventsContainer}>
        {events.map((event) => (
          <Card
            key={event.id}
            padding="20"
            gap="12"
            background="surface"
            className={styles.eventCard}
            style={{ "--status-color": getStatusColor(event.status) } as React.CSSProperties}
          >
            {/* Event Header */}
            <Flex gap="12" align="start">
              <div className={styles.eventIconPill}>
                {getEventTypeIcon(event.eventType)}
              </div>
              <Flex direction="column" gap="4" fillWidth>
                <Flex gap="8" align="center">
                  <Heading variant="heading-default-m">{event.title}</Heading>
                  {event.isMilestone && (
                    <span className={styles.milestoneBadge}>🎯 Milestone</span>
                  )}
                  <span
                    className={styles.statusBadge}
                    style={{
                      color: getStatusColor(event.status),
                      borderColor: `${getStatusColor(event.status)}44`,
                      backgroundColor: `${getStatusColor(event.status)}1a`,
                    }}
                  >
                    {event.status}
                  </span>
                </Flex>
              </Flex>
            </Flex>

            {/* Event Description */}
            {event.description && (
              <Text variant="body-default-m" color="secondary">
                {event.description}
              </Text>
            )}

            {/* Event Details */}
            <Flex gap="16" wrap>
              <Flex gap="4" align="center">
                <span>📅</span>
                <Text variant="body-default-m">
                  {formatDate(event.startDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </Text>
              </Flex>
              {event.location && (
                <Flex gap="4" align="center">
                  <span>📍</span>
                  <Text variant="body-default-m">{event.location}</Text>
                </Flex>
              )}
              <Flex gap="4" align="center">
                <span>🏷️</span>
                <Text variant="body-default-m">{event.eventType}</Text>
              </Flex>
            </Flex>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Flex gap="8" wrap>
                {event.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </Flex>
            )}
          </Card>
        ))}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleCreateEvent} label="New Event" />

      {/* Event Editor Modal */}
      <EventEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={handleEventSuccess}
      />
    </Column>
  );
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    planned: "#3B82F6",
    ongoing: "#10B981",
    completed: "#6366F1",
    cancelled: "#9CA3AF",
  };
  return colors[status] || "#9CA3AF";
};
