import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for demo purposes
// In production, replace with a real database
let diaryEntries: any[] = [
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

let nextId = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Parse query parameters
    const {
      startDate,
      endDate,
      mood,
      tags,
      search,
      page = "1",
      page_size = "10",
      ordering = "-entryDate",
    } = req.query;

    // Filter entries
    let filtered = [...diaryEntries];

    if (startDate) {
      filtered = filtered.filter((entry) => entry.entryDate >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((entry) => entry.entryDate <= endDate);
    }

    if (mood) {
      filtered = filtered.filter((entry) => entry.mood === mood);
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchLower) ||
          entry.content?.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    const field = ordering?.toString().replace("-", "") || "entryDate";
    const isDescending = ordering?.toString().startsWith("-");

    filtered.sort((a, b) => {
      const aVal = a[field] || "";
      const bVal = b[field] || "";

      if (aVal < bVal) return isDescending ? 1 : -1;
      if (aVal > bVal) return isDescending ? -1 : 1;
      return 0;
    });

    // Paginate
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(page_size as string, 10) || 10;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const results = filtered.slice(start, end);

    return res.status(200).json({
      count: filtered.length,
      results,
      next: end < filtered.length ? pageNum + 1 : null,
      previous: pageNum > 1 ? pageNum - 1 : null,
    });
  } else if (req.method === "POST") {
    // Create new entry
    const newEntry = {
      id: nextId++,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    diaryEntries.push(newEntry);
    return res.status(201).json(newEntry);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
