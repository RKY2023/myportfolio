import { DiaryEntryFormData } from "./schemas";

const API_BASE_URL = "/api/dairyentry";

export interface DiaryEntry {
  id: number;
  title: string;
  content?: string;
  entryDate: string;
  entryTime?: string;
  mood?: string;
  moodScore?: number;
  weather?: string;
  location?: string;
  tags: any[];
  visibility: "private" | "public" | "friends";
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntriesResponse {
  count: number;
  results: DiaryEntry[];
  next?: string;
  previous?: string;
}

export interface FetchDiaryEntriesOptions {
  startDate?: string;
  endDate?: string;
  mood?: string;
  tags?: number[];
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

class DiaryService {
  /**
   * Fetch all diary entries with optional filters
   */
  async fetchEntries(
    options?: FetchDiaryEntriesOptions
  ): Promise<DiaryEntriesResponse> {
    const params = new URLSearchParams();

    if (options?.startDate) params.append("startDate", options.startDate);
    if (options?.endDate) params.append("endDate", options.endDate);
    if (options?.mood) params.append("mood", options.mood);
    if (options?.tags?.length) params.append("tags", options.tags.join(","));
    if (options?.search) params.append("search", options.search);
    if (options?.page) params.append("page", options.page.toString());
    if (options?.page_size) params.append("page_size", options.page_size.toString());
    if (options?.ordering) params.append("ordering", options.ordering);

    const url = params.toString()
      ? `${API_BASE_URL}/diary-entries/?${params.toString()}`
      : `${API_BASE_URL}/diary-entries/`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch diary entries: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Fetch a single diary entry by ID
   */
  async fetchEntry(id: number): Promise<DiaryEntry> {
    const response = await fetch(`${API_BASE_URL}/diary-entries/${id}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch diary entry: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new diary entry
   */
  async createEntry(data: DiaryEntryFormData): Promise<DiaryEntry> {
    const response = await fetch(`${API_BASE_URL}/diary-entries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create diary entry");
    }

    return response.json();
  }

  /**
   * Update an existing diary entry
   */
  async updateEntry(id: number, data: Partial<DiaryEntryFormData>): Promise<DiaryEntry> {
    const response = await fetch(`${API_BASE_URL}/diary-entries/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update diary entry");
    }

    return response.json();
  }

  /**
   * Delete a diary entry
   */
  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/diary-entries/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete diary entry");
    }
  }

  /**
   * Fetch entries for a specific month
   */
  async fetchEntriesByMonth(year: number, month: number): Promise<DiaryEntry[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    const response = await this.fetchEntries({
      startDate,
      endDate,
      page_size: 100,
      ordering: "-entryDate",
    });

    return response.results;
  }

  /**
   * Check if a date has any entries
   */
  async hasEntriesOnDate(date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split("T")[0];
    const response = await this.fetchEntries({
      startDate: dateStr,
      endDate: dateStr,
      page_size: 1,
    });

    return response.count > 0;
  }

  /**
   * Save draft to localStorage
   */
  saveDraft(key: string, data: DiaryEntryFormData): void {
    localStorage.setItem(`diary_draft_${key}`, JSON.stringify(data));
  }

  /**
   * Load draft from localStorage
   */
  loadDraft(key: string): DiaryEntryFormData | null {
    const draft = localStorage.getItem(`diary_draft_${key}`);
    return draft ? JSON.parse(draft) : null;
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft(key: string): void {
    localStorage.removeItem(`diary_draft_${key}`);
  }
}

export const diaryService = new DiaryService();
