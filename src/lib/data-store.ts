/**
 * In-memory data store for development purposes
 * In production, replace with a real database
 */

// ============================================================
// Diary Entries
// ============================================================

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
  tags: string[];
  visibility: 'private' | 'public' | 'shared';
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

let diaryEntries: DiaryEntry[] = [
  {
    id: 1,
    title: "First Entry",
    content: "This is my first diary entry.",
    entryDate: "2025-11-16",
    entryTime: "10:00",
    mood: "happy",
    moodScore: 8,
    weather: "sunny",
    location: "Home",
    tags: [],
    visibility: "private",
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    createdAt: new Date("2025-11-16").toISOString(),
    updatedAt: new Date("2025-11-16").toISOString(),
  },
  {
    id: 2,
    title: "Second Entry",
    content: "A productive day at work.",
    entryDate: "2025-11-15",
    entryTime: "14:30",
    mood: "productive",
    moodScore: 7,
    weather: "cloudy",
    location: "Office",
    tags: [],
    visibility: "private",
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    createdAt: new Date("2025-11-15").toISOString(),
    updatedAt: new Date("2025-11-15").toISOString(),
  },
];

let diaryNextId = 3;

export const diaryStore = {
  getAll: () => [...diaryEntries],
  getById: (id: number) => diaryEntries.find(e => e.id === id),
  create: (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): DiaryEntry => {
    const entry: DiaryEntry = {
      ...data,
      id: diaryNextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    diaryEntries.push(entry);
    return entry;
  },
  update: (id: number, data: Partial<DiaryEntry>): DiaryEntry | null => {
    const index = diaryEntries.findIndex(e => e.id === id);
    if (index === -1) return null;

    diaryEntries[index] = {
      ...diaryEntries[index],
      ...data,
      id: diaryEntries[index].id, // Prevent ID override
      createdAt: diaryEntries[index].createdAt, // Prevent createdAt override
      updatedAt: new Date().toISOString(),
    };
    return diaryEntries[index];
  },
  delete: (id: number): boolean => {
    const index = diaryEntries.findIndex(e => e.id === id);
    if (index === -1) return false;
    diaryEntries.splice(index, 1);
    return true;
  },
};

// ============================================================
// Timeline Events
// ============================================================

export interface TimelineEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  category?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

let timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Started Learning React",
    description: "Began my journey with React",
    date: "2025-01-15",
    category: "learning",
    color: "#3B82F6",
    createdAt: new Date("2025-01-15").toISOString(),
    updatedAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: 2,
    title: "Completed First Project",
    description: "Finished my first React project",
    date: "2025-05-20",
    category: "achievement",
    color: "#22C55E",
    createdAt: new Date("2025-05-20").toISOString(),
    updatedAt: new Date("2025-05-20").toISOString(),
  },
];

let timelineNextId = 3;

export const timelineStore = {
  getAll: () => [...timelineEvents],
  getById: (id: number) => timelineEvents.find(e => e.id === id),
  create: (data: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>): TimelineEvent => {
    const event: TimelineEvent = {
      ...data,
      id: timelineNextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    timelineEvents.push(event);
    return event;
  },
  update: (id: number, data: Partial<TimelineEvent>): TimelineEvent | null => {
    const index = timelineEvents.findIndex(e => e.id === id);
    if (index === -1) return null;

    timelineEvents[index] = {
      ...timelineEvents[index],
      ...data,
      id: timelineEvents[index].id,
      createdAt: timelineEvents[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return timelineEvents[index];
  },
  delete: (id: number): boolean => {
    const index = timelineEvents.findIndex(e => e.id === id);
    if (index === -1) return false;
    timelineEvents.splice(index, 1);
    return true;
  },
};

// ============================================================
// Checkpoints
// ============================================================

export interface Checkpoint {
  id: number;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
}

let checkpoints: Checkpoint[] = [];
let checkpointNextId = 1;

export const checkpointStore = {
  getAll: () => [...checkpoints],
  getById: (id: number) => checkpoints.find(c => c.id === id),
  create: (data: Omit<Checkpoint, 'id' | 'createdAt' | 'updatedAt'>): Checkpoint => {
    const checkpoint: Checkpoint = {
      ...data,
      id: checkpointNextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    checkpoints.push(checkpoint);
    return checkpoint;
  },
  delete: (id: number): boolean => {
    const index = checkpoints.findIndex(c => c.id === id);
    if (index === -1) return false;
    checkpoints.splice(index, 1);
    return true;
  },
};

// ============================================================
// Destinations
// ============================================================

export interface Destination {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notifyBefore: number;
  radius: number;
  isActive: boolean;
  createdAt: string;
  arrivedAt?: string | null;
}

let destinations: Destination[] = [];

export const destinationStore = {
  getAll: () => [...destinations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  getById: (id: string) => destinations.find(d => d.id === id),
  create: (data: Omit<Destination, 'id' | 'createdAt'>): Destination => {
    // If setting as active, deactivate all others
    if (data.isActive) {
      destinations = destinations.map(d => ({ ...d, isActive: false }));
    }

    const destination: Destination = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    destinations.push(destination);
    return destination;
  },
  update: (id: string, data: Partial<Destination>): Destination | null => {
    const index = destinations.findIndex(d => d.id === id);
    if (index === -1) return null;

    // If setting as active, deactivate all others
    if (data.isActive && !destinations[index].isActive) {
      destinations = destinations.map((d, i) =>
        i === index ? d : { ...d, isActive: false }
      );
    }

    destinations[index] = {
      ...destinations[index],
      ...data,
      id: destinations[index].id, // Prevent ID override
      createdAt: destinations[index].createdAt, // Prevent createdAt override
    };
    return destinations[index];
  },
  delete: (id: string): Destination | null => {
    const index = destinations.findIndex(d => d.id === id);
    if (index === -1) return null;
    return destinations.splice(index, 1)[0];
  },
};
