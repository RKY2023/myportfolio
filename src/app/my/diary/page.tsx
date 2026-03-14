"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  Column,
  Heading,
  Text,
  Card,
  Spinner,
  Button,
  Input,
} from "@/once-ui/components";
import { useGetDiaryEntriesQuery, useCreateDiaryEntryMutation, useDeleteDiaryEntryMutation, DiaryEntry } from "@/store/api/diaryApi";
import DiaryEditor from "../components/DiaryEditor";
import FloatingActionButton from "../components/FloatingActionButton";
import DiaryCalendar from "../components/DiaryCalendar";
import styles from "./page.module.scss";


const getMoodEmoji = (mood?: string): string => {
  const moodEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    anxious: "😰",
    neutral: "😐",
    excited: "🤩",
    tired: "😴",
    productive: "💪",
    grateful: "🙏",
    reflective: "🤔",
    other: "🙂",
  };
  return moodEmojis[mood || "other"] || "🙂";
};

const getMoodColor = (mood?: string): string => {
  const moodColors: Record<string, string> = {
    happy: "#22C55E",
    sad: "#3B82F6",
    angry: "#EF4444",
    anxious: "#F97316",
    neutral: "#9CA3AF",
    excited: "#A855F7",
    tired: "#EAB308",
    productive: "#10B981",
    grateful: "#EC4899",
    reflective: "#6366F1",
    other: "#D1D5DB",
  };
  return moodColors[mood || "other"] || "#D1D5DB";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString?: string): string => {
  if (!timeString) return "";
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateContent = (content?: string, maxLength: number = 150): string => {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export default function Diary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [editingEntryId, setEditingEntryId] = useState<number | undefined>(undefined);

  // Build query params based on filters
  const queryParams: any = {
    page_size: 100,
    ordering: "-entryDate",
  };

  if (searchQuery) {
    queryParams.search = searchQuery;
  }

  if (moodFilter) {
    queryParams.mood = moodFilter;
  }

  // If viewing calendar, filter by month
  if (viewMode === "calendar") {
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    queryParams.startDate = startDate.toISOString().split("T")[0];
    queryParams.endDate = endDate.toISOString().split("T")[0];
  }

  // Use RTK Query hook
  const { data: response, isLoading: loading, error } = useGetDiaryEntriesQuery(queryParams);
  const entries = response?.results || [];
  const [createDiaryEntry] = useCreateDiaryEntryMutation();
  const [deleteDiaryEntry] = useDeleteDiaryEntryMutation();

  const moods = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "neutral",
    "excited",
    "tired",
    "productive",
    "grateful",
    "reflective",
  ];

  const handleCreateEntry = () => {
    setEditingEntryId(undefined);
    setIsEditorOpen(true);
  };

  const handleEditEntry = (entryId: number) => {
    setEditingEntryId(entryId);
    setIsEditorOpen(true);
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteDiaryEntry(entryId).unwrap();
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEntrySuccess = () => {
    // RTK Query will automatically refetch entries due to cache invalidation
    // No need for window.location.reload()
    setIsEditorOpen(false);
    setEditingEntryId(undefined);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : 'message' in error
      ? (error.message as string)
      : "Failed to load diary entries"
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
      <Flex direction="column" gap="8">
        <Heading variant="heading-strong-l">Diary Entries</Heading>
        <Text variant="body-default-m" color="secondary">
          Your personal journal entries, thoughts, and reflections.
        </Text>
      </Flex>

      {/* View Mode Toggle */}
      <Flex gap="8">
        <Button
          variant={viewMode === "calendar" ? "primary" : "secondary"}
          size="s"
          onClick={() => setViewMode("calendar")}
        >
          📅 Calendar View
        </Button>
        <Button
          variant={viewMode === "list" ? "primary" : "secondary"}
          size="s"
          onClick={() => setViewMode("list")}
        >
          📝 List View
        </Button>
      </Flex>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div>
          <DiaryCalendar
            onDateSelect={handleDateSelected}
            onMonthChange={handleMonthChange}
          />
          {selectedDate && (
            <Text variant="body-default-m" style={{ marginTop: 16 }}>
              Showing entries for {formatDate(selectedDate.toISOString())}
            </Text>
          )}
        </div>
      )}

      {/* Search and Filters (List View) */}
      {viewMode === "list" && (
        <Card padding="16" background="neutral-weak" gap="16">
          <Input
            id="search"
            label="Search entries"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Mood Filter */}
          <Flex direction="column" gap="8">
            <Text variant="body-strong-m">
              Filter by mood:
            </Text>
            <Flex gap="8" wrap>
              <Button
                variant={moodFilter === null ? "primary" : "secondary"}
                size="s"
                onClick={() => setMoodFilter(null)}
              >
                All Moods
              </Button>
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant={moodFilter === mood ? "primary" : "secondary"}
                  size="s"
                  onClick={() => setMoodFilter(mood)}
                >
                  {getMoodEmoji(mood)} {mood}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Card>
      )}

      {errorMessage && (
        <Card padding="16" background="accent-weak">
          <Text color="critical">Error: {errorMessage}</Text>
          <Text variant="body-default-m" color="secondary" style={{ marginTop: 8 }}>
            Make sure the API is accessible at /api/dairyentry/diary-entries/
          </Text>
        </Card>
      )}

      {entries.length === 0 && !errorMessage && (
        <Card padding="32" background="neutral-weak">
          <Text align="center">
            No diary entries found. Click the + button to create your first entry!
          </Text>
        </Card>
      )}

      {/* Entries List */}
      <div className={styles.entriesContainer}>
        {entries.map((entry) => (
          <Card
            key={entry.id}
            padding="20"
            gap="12"
            background="surface"
            className={styles.entryCard}
          >
            {/* Entry Header */}
            <Flex gap="12" align="start" horizontal="space-between">
              <Flex direction="column" gap="4" fillWidth>
                <Heading variant="heading-default-m">{entry.title}</Heading>
                <Flex gap="8" align="center">
                  <Text variant="body-default-m" color="secondary">
                    {formatDate(entry.entryDate)}
                    {entry.entryTime && ` • ${formatTime(entry.entryTime)}`}
                  </Text>
                </Flex>
              </Flex>

              {/* Mood Badge */}
              {entry.mood && (
                <div
                  className={styles.moodBadge}
                  style={{ backgroundColor: getMoodColor(entry.mood) }}
                  title={entry.mood}
                >
                  {getMoodEmoji(entry.mood)}
                </div>
              )}
            </Flex>

            {/* Entry Content Preview */}
            {entry.content && (
              <Text variant="body-default-m" color="secondary">
                {truncateContent(entry.content)}
              </Text>
            )}

            {/* Entry Metadata */}
            <Flex gap="16" wrap>
              {entry.location && (
                <Flex gap="4" align="center">
                  <span>📍</span>
                  <Text variant="body-default-m">{entry.location}</Text>
                </Flex>
              )}
              {entry.weather && (
                <Flex gap="4" align="center">
                  <span>⛅</span>
                  <Text variant="body-default-m">{entry.weather}</Text>
                </Flex>
              )}
              {entry.moodScore && (
                <Flex gap="4" align="center">
                  <span>📊</span>
                  <Text variant="body-default-m">{entry.moodScore}/10</Text>
                </Flex>
              )}
            </Flex>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <Flex gap="8" wrap>
                {entry.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              </Flex>
            )}

            {/* Entry Flags */}
            <Flex gap="8" align="center">
              {entry.isPinned && (
                <span className={styles.flag} title="Pinned">
                  📌
                </span>
              )}
              {entry.isFavorite && (
                <span className={styles.flag} title="Favorite">
                  ⭐
                </span>
              )}
              {entry.isArchived && (
                <span className={styles.flag} title="Archived">
                  🗂️
                </span>
              )}
            </Flex>

            {/* Action Buttons */}
            <Flex gap="8" horizontal="end">
              <Button
                variant="secondary"
                size="s"
                onClick={() => handleEditEntry(entry.id)}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="s"
                onClick={() => handleDeleteEntry(entry.id)}
              >
                Delete
              </Button>
            </Flex>
          </Card>
        ))}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleCreateEntry} label="New Entry" />

      {/* Diary Editor Modal */}
      <DiaryEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingEntryId(undefined);
        }}
        onSuccess={handleEntrySuccess}
        entryId={editingEntryId}
        initialDate={new Date().toISOString().split("T")[0]}
      />
    </Column>
  );
}
