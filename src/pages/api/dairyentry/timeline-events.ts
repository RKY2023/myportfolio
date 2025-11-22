import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for timeline events
let timelineEvents: any[] = [
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

let nextId = 3;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { startDate, endDate, page = "1", page_size = "10", ordering = "-date" } = req.query;

    // Filter
    let filtered = [...timelineEvents];

    if (startDate) {
      filtered = filtered.filter((event) => event.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((event) => event.date <= endDate);
    }

    // Sort
    const isDescending = ordering?.toString().startsWith("-");
    filtered.sort((a, b) => {
      if (a.date < b.date) return isDescending ? 1 : -1;
      if (a.date > b.date) return isDescending ? -1 : 1;
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
    const newEvent = {
      id: nextId++,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timelineEvents.push(newEvent);
    return res.status(201).json(newEvent);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
