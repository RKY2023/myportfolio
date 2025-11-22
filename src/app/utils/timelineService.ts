import { TimelineEventFormData, CheckpointFormData } from "./schemas";

const API_BASE_URL = "/api/dairyentry";

export interface TimelineEvent {
  id: number;
  userId: number;
  title: string;
  description?: string;
  eventType: string;
  status: "planned" | "ongoing" | "completed" | "cancelled";
  startDate: string;
  endDate?: string;
  location?: string;
  color: string;
  icon?: string;
  isMilestone: boolean;
  isPrivate: boolean;
  tags: any[];
  createdAt: string;
  updatedAt: string;
  checkpoints?: TimelineCheckpoint[];
}

export interface TimelineCheckpoint {
  id: number;
  timelineEventId: number;
  title: string;
  description?: string;
  checkpointDate: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEventsResponse {
  count: number;
  results: TimelineEvent[];
  next?: string;
  previous?: string;
}

export interface FetchTimelineEventsOptions {
  eventType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isMilestone?: boolean;
  tags?: number[];
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

class TimelineService {
  /**
   * Fetch all timeline events with optional filters
   */
  async fetchEvents(
    options?: FetchTimelineEventsOptions
  ): Promise<TimelineEventsResponse> {
    const params = new URLSearchParams();

    if (options?.eventType) params.append("eventType", options.eventType);
    if (options?.status) params.append("status", options.status);
    if (options?.startDate) params.append("startDate", options.startDate);
    if (options?.endDate) params.append("endDate", options.endDate);
    if (options?.isMilestone) params.append("isMilestone", "true");
    if (options?.tags?.length) params.append("tags", options.tags.join(","));
    if (options?.search) params.append("search", options.search);
    if (options?.page) params.append("page", options.page.toString());
    if (options?.page_size) params.append("page_size", options.page_size.toString());
    if (options?.ordering) params.append("ordering", options.ordering);

    const url = params.toString()
      ? `${API_BASE_URL}/timeline-events/?${params.toString()}`
      : `${API_BASE_URL}/timeline-events/`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch timeline events: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Fetch a single timeline event by ID
   */
  async fetchEvent(id: number): Promise<TimelineEvent> {
    const response = await fetch(`${API_BASE_URL}/timeline-events/${id}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline event: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new timeline event
   */
  async createEvent(data: TimelineEventFormData): Promise<TimelineEvent> {
    const response = await fetch(`${API_BASE_URL}/timeline-events/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create timeline event");
    }

    return response.json();
  }

  /**
   * Update an existing timeline event
   */
  async updateEvent(id: number, data: Partial<TimelineEventFormData>): Promise<TimelineEvent> {
    const response = await fetch(`${API_BASE_URL}/timeline-events/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update timeline event");
    }

    return response.json();
  }

  /**
   * Delete a timeline event
   */
  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/timeline-events/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete timeline event");
    }
  }

  /**
   * Create a checkpoint for a timeline event
   */
  async createCheckpoint(
    eventId: number,
    data: CheckpointFormData
  ): Promise<TimelineCheckpoint> {
    const response = await fetch(`${API_BASE_URL}/checkpoints/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, timelineEventId: eventId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create checkpoint");
    }

    return response.json();
  }

  /**
   * Update a checkpoint
   */
  async updateCheckpoint(
    id: number,
    data: Partial<CheckpointFormData>
  ): Promise<TimelineCheckpoint> {
    const response = await fetch(`${API_BASE_URL}/checkpoints/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update checkpoint");
    }

    return response.json();
  }

  /**
   * Delete a checkpoint
   */
  async deleteCheckpoint(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/checkpoints/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete checkpoint");
    }
  }

  /**
   * Fetch checkpoints for a specific event
   */
  async fetchCheckpointsForEvent(eventId: number): Promise<TimelineCheckpoint[]> {
    const response = await fetch(`${API_BASE_URL}/checkpoints/?timelineEventId=${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch checkpoints");
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Save draft to localStorage
   */
  saveDraft(key: string, data: TimelineEventFormData): void {
    localStorage.setItem(`timeline_draft_${key}`, JSON.stringify(data));
  }

  /**
   * Load draft from localStorage
   */
  loadDraft(key: string): TimelineEventFormData | null {
    const draft = localStorage.getItem(`timeline_draft_${key}`);
    return draft ? JSON.parse(draft) : null;
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft(key: string): void {
    localStorage.removeItem(`timeline_draft_${key}`);
  }
}

export const timelineService = new TimelineService();
