import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for checkpoints
let checkpoints: any[] = [];

let nextId = 1;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page = "1", page_size = "10" } = req.query;

    // Paginate
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(page_size as string, 10) || 10;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const results = checkpoints.slice(start, end);

    return res.status(200).json({
      count: checkpoints.length,
      results,
      next: end < checkpoints.length ? pageNum + 1 : null,
      previous: pageNum > 1 ? pageNum - 1 : null,
    });
  } else if (req.method === "POST") {
    const newCheckpoint = {
      id: nextId++,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    checkpoints.push(newCheckpoint);
    return res.status(201).json(newCheckpoint);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
