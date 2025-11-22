"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Column,
  Flex,
  Button,
  Input,
  Text,
  Dialog,
  Spinner,
} from "@/once-ui/components";
import { timelineEventSchema, TimelineEventFormData } from "@/app/utils/schemas";
import { timelineService } from "@/app/utils/timelineService";
import CheckpointManager from "./CheckpointManager";
import styles from "./EventEditor.module.scss";

interface EventEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (event: any) => void;
  eventId?: number;
}

const EVENT_TYPES = [
  "milestone",
  "project",
  "travel",
  "relationship",
  "health",
  "education",
  "career",
  "personal",
  "goal",
  "habit",
  "other",
] as const;

const EVENT_STATUSES = ["planned", "ongoing", "completed", "cancelled"] as const;

const EVENT_TYPE_ICONS = {
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

export default function EventEditor({
  isOpen,
  onClose,
  onSuccess,
  eventId,
}: EventEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TimelineEventFormData>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      eventType: "project",
      status: "planned",
      color: "#3B82F6",
      isMilestone: false,
      isPrivate: false,
      tagIds: [],
    },
  });

  const eventType = watch("eventType");
  const isMilestone = watch("isMilestone");

  useEffect(() => {
    if (isOpen && eventId) {
      loadEvent(eventId);
    }
  }, [isOpen, eventId]);

  const loadEvent = async (id: number) => {
    try {
      const event = await timelineService.fetchEvent(id);
      reset({
        title: event.title,
        description: event.description,
        eventType: event.eventType as any,
        status: event.status,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        color: event.color,
        icon: event.icon,
        isMilestone: event.isMilestone,
        isPrivate: event.isPrivate,
      });
      setSelectedColor(event.color);
    } catch (err) {
      setError("Failed to load event");
    }
  };

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const onSubmit = async (data: TimelineEventFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const event = eventId
        ? await timelineService.updateEvent(eventId, data)
        : await timelineService.createEvent(data);

      onSuccess?.(event);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const COLOR_OPTIONS = [
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#F97316", // orange
    "#EF4444", // red
    "#10B981", // green
    "#06B6D4", // cyan
    "#FBBF24", // yellow
    "#6B7280", // gray
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" className={styles.dialog}>
      <Column
        fillWidth
        gap="24"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
        <Text variant="heading-default-m">
          {eventId ? "Edit Event" : "New Timeline Event"}
        </Text>

        {error && (
          <div className={styles.error}>
            <Text color="critical">{error}</Text>
          </div>
        )}

        {/* Basic Section */}
        <SectionCollapsible
          title="Basic Information"
          section="basic"
          expanded={expandedSections.has("basic")}
          onToggle={toggleSection}
        >
          <Input
            id="title"
            label="Title"
            {...register("title")}
            error={!!errors.title}
            errorMessage={errors.title?.message}
          />

          <textarea
            id="description"
            placeholder="Describe this event..."
            {...register("description")}
            rows={4}
            className={styles.textarea}
          />

          <Flex gap="16" wrap>
            <div style={{ flex: 1 }}>
              <label htmlFor="eventType" style={{ display: "block", marginBottom: 8 }}>
                <Text variant="body-strong-m">
                  Event Type
                </Text>
              </label>
              <select
                id="eventType"
                {...register("eventType")}
                className={styles.select}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="status" style={{ display: "block", marginBottom: 8 }}>
                <Text variant="body-strong-m">
                  Status
                </Text>
              </label>
              <select
                id="status"
                {...register("status")}
                className={styles.select}
              >
                {EVENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </Flex>
        </SectionCollapsible>

        {/* Dates Section */}
        <SectionCollapsible
          title="Dates & Location"
          section="dates"
          expanded={expandedSections.has("dates")}
          onToggle={toggleSection}
        >
          <Flex gap="16" wrap>
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              {...register("startDate")}
              error={!!errors.startDate}
              errorMessage={errors.startDate?.message}
            />
            <Input
              id="endDate"
              label="End Date (optional)"
              type="date"
              {...register("endDate")}
            />
          </Flex>

          <Input
            id="location"
            label="Location"
            placeholder="Where is this event?"
            {...register("location")}
          />
        </SectionCollapsible>

        {/* Appearance Section */}
        <SectionCollapsible
          title="Appearance"
          section="appearance"
          expanded={expandedSections.has("appearance")}
          onToggle={toggleSection}
        >
          <div>
            <Text variant="body-strong-m" style={{ marginBottom: 12 }}>
              Color
            </Text>
            <Flex gap="8" wrap>
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setValue("color", color);
                  }}
                  className={`${styles.colorOption} ${
                    selectedColor === color ? styles.selected : ""
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </Flex>
          </div>

          <Flex gap="8" align="center">
            <input
              type="checkbox"
              id="isMilestone"
              {...register("isMilestone")}
            />
            <label htmlFor="isMilestone">
              <Text variant="body-default-m">Mark as milestone 🏆</Text>
            </label>
          </Flex>

          <Flex gap="8" align="center">
            <input
              type="checkbox"
              id="isPrivate"
              {...register("isPrivate")}
            />
            <label htmlFor="isPrivate">
              <Text variant="body-default-m">Private event</Text>
            </label>
          </Flex>
        </SectionCollapsible>

        {/* Checkpoints Section */}
        {eventId && (
          <SectionCollapsible
            title="Checkpoints/Milestones"
            section="checkpoints"
            expanded={expandedSections.has("checkpoints")}
            onToggle={toggleSection}
          >
            <CheckpointManager eventId={eventId} />
          </SectionCollapsible>
        )}

        {/* Actions */}
        <Flex gap="12" horizontal="end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Flex gap="8" align="center">
                <Spinner size="s" />
                Saving...
              </Flex>
            ) : (
              "Save Event"
            )}
          </Button>
        </Flex>
      </Column>
    </Dialog>
  );
}

interface SectionCollapsibleProps {
  title: string;
  section: string;
  expanded: boolean;
  onToggle: (section: string) => void;
  children: React.ReactNode;
}

function SectionCollapsible({
  title,
  section,
  expanded,
  onToggle,
  children,
}: SectionCollapsibleProps) {
  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => onToggle(section)}
      >
        <Text variant="body-strong-m">{title}</Text>
        <span className={expanded ? styles.expandedIcon : ""}>▼</span>
      </button>
      {expanded && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}
