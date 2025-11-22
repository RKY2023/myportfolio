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
import { diaryEntrySchema, DiaryEntryFormData } from "@/app/utils/schemas";
import { useCreateDiaryEntryMutation, useUpdateDiaryEntryMutation, useGetDiaryEntryQuery } from "@/store/api/diaryApi";
import MoodSelector from "./MoodSelector";
import HealthMetricsForm from "./HealthMetricsForm";
import FoodRoutineForm from "./FoodRoutineForm";
import styles from "./DiaryEditor.module.scss";

interface DiaryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (entry: any) => void;
  entryId?: number;
  initialDate?: string;
}

export default function DiaryEditor({
  isOpen,
  onClose,
  onSuccess,
  entryId,
  initialDate,
}: DiaryEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );

  // RTK Query mutations
  const [createDiaryEntry, { isLoading: isCreating }] = useCreateDiaryEntryMutation();
  const [updateDiaryEntry, { isLoading: isUpdating }] = useUpdateDiaryEntryMutation();
  const { data: entry } = useGetDiaryEntryQuery(entryId!, { skip: !entryId });

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      title: "",
      content: "",
      entryDate: initialDate || new Date().toISOString().split("T")[0],
      entryTime: undefined,
      mood: undefined,
      moodScore: undefined,
      visibility: "private",
      healthStatus: undefined,
      foodRoutine: undefined,
      productiveWorkList: [],
      tagIds: [],
      location: undefined,
      weather: undefined,
      wordOfDay: undefined,
      quote: undefined,
      timelineEventId: undefined,
    },
  });

  const mood = watch("mood");
  const moodScore = watch("moodScore");
  const healthStatus = watch("healthStatus");
  const foodRoutine = watch("foodRoutine");
  const productiveWorkList = watch("productiveWorkList");

  // Load entry when it's fetched
  useEffect(() => {
    if (entry && isOpen) {
      reset({
        title: entry.title,
        content: entry.content,
        entryDate: entry.entryDate,
        entryTime: entry.entryTime,
        mood: entry.mood as any,
        moodScore: entry.moodScore,
        weather: entry.weather,
        location: entry.location,
        visibility: entry.visibility,
      });
    }
  }, [entry, isOpen, reset]);

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const onSubmit = async (data: DiaryEntryFormData) => {
    setError(null);

    try {
      if (entryId) {
        // Update existing entry
        const result = await updateDiaryEntry({
          id: entryId,
          data: data,
        }).unwrap();
        onSuccess?.(result);
      } else {
        // Create new entry
        const result = await createDiaryEntry(data).unwrap();
        onSuccess?.(result);
      }

      reset();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save entry"
      );
    }
  };

  const addProductiveItem = () => {
    setValue("productiveWorkList", [...(productiveWorkList || []), ""]);
  };

  const removeProductiveItem = (index: number) => {
    setValue(
      "productiveWorkList",
      productiveWorkList?.filter((_, i) => i !== index)
    );
  };

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
          {entryId ? "Edit Entry" : "New Diary Entry"}
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
          <Flex gap="16" wrap>
            <Input
              id="entryDate"
              label="Date"
              type="date"
              {...register("entryDate")}
              error={!!errors.entryDate?.message}
            />
            <Input
              id="entryTime"
              label="Time (optional)"
              type="time"
              {...register("entryTime")}
            />
          </Flex>

          <Input
            id="title"
            label="Title"
            {...register("title")}
            error={!!errors.title?.message}
          />

          <textarea
            id="content"
            placeholder="Write your thoughts, feelings, and experiences..."
            {...register("content")}
            rows={6}
            className={styles.textarea}
          />
        </SectionCollapsible>

        {/* Mood Section */}
        <SectionCollapsible
          title="Mood & Emotions"
          section="mood"
          expanded={expandedSections.has("mood")}
          onToggle={toggleSection}
        >
          <MoodSelector
            value={mood}
            onChange={(newMood) => setValue("mood", newMood as any)}
            includeScore
            scoreValue={moodScore || 5}
            onScoreChange={(score) => setValue("moodScore", score)}
          />
        </SectionCollapsible>

        {/* Context Section */}
        <SectionCollapsible
          title="Context"
          section="context"
          expanded={expandedSections.has("context")}
          onToggle={toggleSection}
        >
          <Flex gap="16" wrap>
            <Input
              id="weather"
              label="Weather"
              placeholder="Sunny, Rainy, etc."
              {...register("weather")}
            />
            <Input
              id="location"
              label="Location"
              placeholder="Where are you?"
              {...register("location")}
            />
          </Flex>
        </SectionCollapsible>

        {/* Health Metrics Section */}
        <SectionCollapsible
          title="Health & Wellness"
          section="health"
          expanded={expandedSections.has("health")}
          onToggle={toggleSection}
        >
          <HealthMetricsForm
            value={healthStatus}
            onChange={(metrics) => setValue("healthStatus", metrics)}
          />
        </SectionCollapsible>

        {/* Food Routine Section */}
        <SectionCollapsible
          title="Food & Nutrition"
          section="food"
          expanded={expandedSections.has("food")}
          onToggle={toggleSection}
        >
          <FoodRoutineForm
            value={foodRoutine}
            onChange={(routine) => setValue("foodRoutine", routine)}
          />
        </SectionCollapsible>

        {/* Productivity Section */}
        <SectionCollapsible
          title="Productivity"
          section="productivity"
          expanded={expandedSections.has("productivity")}
          onToggle={toggleSection}
        >
          <Column fillWidth gap="12">
            <Text variant="body-strong-m">
              Accomplished Today
            </Text>
            {productiveWorkList?.map((item, index) => (
              <Flex key={index} gap="8" align="center">
                <Input
                  id={`productive-${index}`}
                  label="Accomplishment"
                  placeholder="e.g., Completed project"
                  value={item}
                  onChange={(e) => {
                    const updated = [...(productiveWorkList || [])];
                    updated[index] = e.target.value;
                    setValue("productiveWorkList", updated);
                  }}
                />
                <Button
                  variant="secondary"
                  size="s"
                  onClick={() => removeProductiveItem(index)}
                >
                  Remove
                </Button>
              </Flex>
            ))}
            <Button variant="secondary" onClick={addProductiveItem}>
              + Add Item
            </Button>
          </Column>
        </SectionCollapsible>

        {/* Inspiration Section */}
        <SectionCollapsible
          title="Inspiration"
          section="inspiration"
          expanded={expandedSections.has("inspiration")}
          onToggle={toggleSection}
        >
          <Input
            id="wordOfDay"
            label="Word of the Day"
            placeholder="e.g., Serendipity"
            {...register("wordOfDay")}
          />
          <Input
            id="quote"
            label="Quote or Thought"
            placeholder="An inspiring quote..."
            {...register("quote")}
          />
        </SectionCollapsible>

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
            onClick={(e) => {
              if (isSubmitting) e.preventDefault();
            }}
          >
            {isSubmitting ? (
              <Flex gap="8" align="center">
                <Spinner size="s" />
                Saving...
              </Flex>
            ) : (
              "Save Entry"
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
