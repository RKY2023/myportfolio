"use client";

import { Column, Flex, Text, Input } from "@/once-ui/components";

interface HealthMetrics {
  sleepHours?: number;
  exerciseMinutes?: number;
  energyLevel?: number;
  symptoms?: string[];
}

interface HealthMetricsFormProps {
  value?: HealthMetrics;
  onChange: (metrics: HealthMetrics) => void;
}

export default function HealthMetricsForm({
  value = {},
  onChange,
}: HealthMetricsFormProps) {
  const handleChange = (field: keyof HealthMetrics, newValue: any) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <Column fillWidth gap="16">
      <Text variant="body-strong-m">
        Health & Wellness
      </Text>

      <Flex gap="16" wrap>
        <Input
          id="sleepHours"
          label="Sleep (hours)"
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={value.sleepHours?.toString() || ""}
          onChange={(e) =>
            handleChange("sleepHours", e.target.value ? parseFloat(e.target.value) : undefined)
          }
          placeholder="8"
        />

        <Input
          id="exerciseMinutes"
          label="Exercise (minutes)"
          type="number"
          min="0"
          max="1440"
          step="5"
          value={value.exerciseMinutes?.toString() || ""}
          onChange={(e) =>
            handleChange(
              "exerciseMinutes",
              e.target.value ? parseInt(e.target.value) : undefined
            )
          }
          placeholder="30"
        />

        <Input
          id="energyLevel"
          label="Energy Level (1-10)"
          type="number"
          min="1"
          max="10"
          value={value.energyLevel?.toString() || ""}
          onChange={(e) =>
            handleChange("energyLevel", e.target.value ? parseInt(e.target.value) : undefined)
          }
          placeholder="7"
        />
      </Flex>

      <Input
        id="symptoms"
        label="Symptoms (comma-separated)"
        type="text"
        value={value.symptoms?.join(", ") || ""}
        onChange={(e) =>
          handleChange(
            "symptoms",
            e.target.value ? e.target.value.split(",").map((s) => s.trim()) : []
          )
        }
        placeholder="e.g., Headache, Fatigue, Insomnia"
      />
    </Column>
  );
}
