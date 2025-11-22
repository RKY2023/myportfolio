"use client";

import { Flex, Column, Text, Button } from "@/once-ui/components";
import styles from "./MoodSelector.module.scss";

interface MoodSelectorProps {
  value?: string;
  onChange: (mood: string) => void;
  includeScore?: boolean;
  scoreValue?: number;
  onScoreChange?: (score: number) => void;
}

const MOODS = [
  { id: "happy", label: "Happy", emoji: "😊", color: "#22C55E" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#3B82F6" },
  { id: "angry", label: "Angry", emoji: "😠", color: "#EF4444" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#F97316" },
  { id: "neutral", label: "Neutral", emoji: "😐", color: "#9CA3AF" },
  { id: "excited", label: "Excited", emoji: "🤩", color: "#A855F7" },
  { id: "tired", label: "Tired", emoji: "😴", color: "#EAB308" },
  { id: "productive", label: "Productive", emoji: "💪", color: "#10B981" },
  { id: "grateful", label: "Grateful", emoji: "🙏", color: "#EC4899" },
  { id: "reflective", label: "Reflective", emoji: "🤔", color: "#6366F1" },
  { id: "other", label: "Other", emoji: "🙂", color: "#D1D5DB" },
];

export default function MoodSelector({
  value,
  onChange,
  includeScore,
  scoreValue = 5,
  onScoreChange,
}: MoodSelectorProps) {
  const selectedMood = MOODS.find((m) => m.id === value);

  return (
    <Column fillWidth gap="16">
      <div>
        <Text variant="body-strong-m" style={{ marginBottom: 8 }}>
          How are you feeling?
        </Text>
        <Flex gap="8" wrap className={styles.moodGrid}>
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onChange(mood.id)}
              className={`${styles.moodButton} ${
                value === mood.id ? styles.selected : ""
              }`}
              style={{
                borderColor:
                  value === mood.id ? mood.color : "var(--neutral-alpha-weak)",
                backgroundColor:
                  value === mood.id
                    ? `${mood.color}20`
                    : "var(--surface)",
              }}
              title={mood.label}
            >
              <span className={styles.emoji}>{mood.emoji}</span>
              <span className={styles.label}>{mood.label}</span>
            </button>
          ))}
        </Flex>
      </div>

      {includeScore && onScoreChange && (
        <div>
          <Flex gap="8" align="center">
            <Text variant="body-strong-m">
              Mood Intensity:
            </Text>
            <Text variant="body-strong-m">
              {scoreValue}/10
            </Text>
          </Flex>
          <input
            type="range"
            min="1"
            max="10"
            value={scoreValue}
            onChange={(e) => onScoreChange(parseInt(e.target.value))}
            className={styles.scoreSlider}
            style={{
              accentColor: selectedMood?.color || "#3B82F6",
            }}
          />
        </div>
      )}
    </Column>
  );
}
