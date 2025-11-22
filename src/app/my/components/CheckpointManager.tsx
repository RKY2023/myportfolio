"use client";

import { useEffect, useState } from "react";
import { Column, Flex, Text, Input, Button, Spinner, Card } from "@/once-ui/components";
import { timelineService, TimelineCheckpoint } from "@/app/utils/timelineService";
import { CheckpointFormData } from "@/app/utils/schemas";
import styles from "./CheckpointManager.module.scss";

interface CheckpointManagerProps {
  eventId: number;
}

export default function CheckpointManager({ eventId }: CheckpointManagerProps) {
  const [checkpoints, setCheckpoints] = useState<TimelineCheckpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCheckpoint, setNewCheckpoint] = useState<CheckpointFormData>({
    title: "",
    description: "",
    checkpointDate: new Date().toISOString().split("T")[0],
    isCompleted: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCheckpoints();
  }, [eventId]);

  const loadCheckpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timelineService.fetchCheckpointsForEvent(eventId);
      setCheckpoints(data);
    } catch (err) {
      setError("Failed to load checkpoints");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCheckpoint = async () => {
    if (!newCheckpoint.title.trim()) {
      setError("Checkpoint title is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await timelineService.createCheckpoint(eventId, newCheckpoint);
      setCheckpoints([...checkpoints, created]);
      setNewCheckpoint({
        title: "",
        description: "",
        checkpointDate: new Date().toISOString().split("T")[0],
        isCompleted: false,
      });
    } catch (err) {
      setError("Failed to create checkpoint");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCheckpoint = async (id: number, isCompleted: boolean) => {
    try {
      await timelineService.updateCheckpoint(id, { isCompleted: !isCompleted });
      setCheckpoints(
        checkpoints.map((cp) =>
          cp.id === id ? { ...cp, isCompleted: !isCompleted } : cp
        )
      );
    } catch (err) {
      setError("Failed to update checkpoint");
    }
  };

  const handleDeleteCheckpoint = async (id: number) => {
    if (!confirm("Delete this checkpoint?")) return;

    try {
      await timelineService.deleteCheckpoint(id);
      setCheckpoints(checkpoints.filter((cp) => cp.id !== id));
    } catch (err) {
      setError("Failed to delete checkpoint");
    }
  };

  const completedCount = checkpoints.filter((cp) => cp.isCompleted).length;
  const progressPercent =
    checkpoints.length > 0 ? Math.round((completedCount / checkpoints.length) * 100) : 0;

  if (loading) {
    return <Spinner />;
  }

  return (
    <Column fillWidth gap="16">
      {error && (
        <Card padding="12" background="accent-weak">
          <Text variant="body-default-m" color="critical">
            {error}
          </Text>
        </Card>
      )}

      {/* Progress Bar */}
      {checkpoints.length > 0 && (
        <div className={styles.progressSection}>
          <Flex gap="8" align="center" horizontal="space-between">
            <Text variant="body-strong-m">
              Progress
            </Text>
            <Text variant="body-default-m">
              {completedCount} of {checkpoints.length}
            </Text>
          </Flex>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <Text variant="body-default-m" color="secondary">
            {progressPercent}% complete
          </Text>
        </div>
      )}

      {/* Checkpoints List */}
      <Column fillWidth gap="12">
        <Text variant="body-strong-m">
          Milestones ({checkpoints.length})
        </Text>

        {checkpoints.length === 0 ? (
          <Text variant="body-default-m" color="secondary">
            No milestones yet. Add one below!
          </Text>
        ) : (
          checkpoints.map((checkpoint) => (
            <Card
              key={checkpoint.id}
              padding="12"
              gap="8"
              className={checkpoint.isCompleted ? styles.completed : ""}
            >
              <Flex gap="12" align="start" horizontal="space-between">
                <Flex gap="12" align="start" fillWidth>
                  <input
                    type="checkbox"
                    checked={checkpoint.isCompleted}
                    onChange={() =>
                      handleToggleCheckpoint(checkpoint.id, checkpoint.isCompleted)
                    }
                    className={styles.checkbox}
                  />
                  <Flex direction="column" gap="4" fillWidth>
                    <Text
                      variant="body-default-m"
                      style={{
                        textDecoration: checkpoint.isCompleted
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {checkpoint.title}
                    </Text>
                    {checkpoint.description && (
                      <Text
                        variant="body-default-m"
                        color="secondary"
                        style={{
                          textDecoration: checkpoint.isCompleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {checkpoint.description}
                      </Text>
                    )}
                    <Text variant="body-default-m" color="secondary">
                      {new Date(checkpoint.checkpointDate).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Flex>
                <Button
                  variant="secondary"
                  size="s"
                  onClick={() => handleDeleteCheckpoint(checkpoint.id)}
                >
                  Delete
                </Button>
              </Flex>
            </Card>
          ))
        )}
      </Column>

      {/* Add New Checkpoint */}
      <Column fillWidth gap="12" className={styles.addSection}>
        <Text variant="body-strong-m">
          Add Milestone
        </Text>
        <Input
          id="checkpoint-title"
          label="Milestone Title"
          placeholder="e.g., Book flights"
          value={newCheckpoint.title}
          onChange={(e) =>
            setNewCheckpoint({ ...newCheckpoint, title: e.target.value })
          }
        />
        <Input
          id="checkpoint-description"
          label="Description (optional)"
          placeholder="Details about this milestone..."
          value={newCheckpoint.description || ""}
          onChange={(e) =>
            setNewCheckpoint({ ...newCheckpoint, description: e.target.value })
          }
        />
        <Input
          id="checkpoint-date"
          label="Target Date"
          type="date"
          value={newCheckpoint.checkpointDate}
          onChange={(e) =>
            setNewCheckpoint({ ...newCheckpoint, checkpointDate: e.target.value })
          }
        />
        <Button
          variant="primary"
          onClick={handleAddCheckpoint}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Milestone"}
        </Button>
      </Column>
    </Column>
  );
}
