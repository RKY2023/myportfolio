import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage (shared with diary-entries.ts in real app)
// This is a simplified version - in production use a database
const diaryEntries: any[] = [
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const entryId = parseInt(id as string, 10);

  if (req.method === "GET") {
    const entry = diaryEntries.find((e) => e.id === entryId);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    return res.status(200).json(entry);
  } else if (req.method === "PATCH") {
    const entry = diaryEntries.find((e) => e.id === entryId);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const updatedEntry = {
      ...entry,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const index = diaryEntries.findIndex((e) => e.id === entryId);
    diaryEntries[index] = updatedEntry;

    return res.status(200).json(updatedEntry);
  } else if (req.method === "DELETE") {
    const index = diaryEntries.findIndex((e) => e.id === entryId);

    if (index === -1) {
      return res.status(404).json({ message: "Entry not found" });
    }

    diaryEntries.splice(index, 1);
    return res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
