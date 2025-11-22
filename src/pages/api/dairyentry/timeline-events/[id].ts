import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage (shared with timeline-events.ts in real app)
const timelineEvents: any[] = [
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const eventId = parseInt(id as string, 10);

  if (req.method === "GET") {
    const event = timelineEvents.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } else if (req.method === "PATCH") {
    const event = timelineEvents.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = {
      ...event,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    const index = timelineEvents.findIndex((e) => e.id === eventId);
    timelineEvents[index] = updatedEvent;

    return res.status(200).json(updatedEvent);
  } else if (req.method === "DELETE") {
    const index = timelineEvents.findIndex((e) => e.id === eventId);

    if (index === -1) {
      return res.status(404).json({ message: "Event not found" });
    }

    timelineEvents.splice(index, 1);
    return res.status(204).end();
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
