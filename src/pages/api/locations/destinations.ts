import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export interface Destination {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  notifyBefore: number; // Minutes before arrival
  radius: number; // Meters
  isActive: boolean;
  createdAt: string;
  arrivedAt?: string;
}

// In-memory storage for demo purposes
// In production, replace with a real database
let destinations: Destination[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Return all destinations
    // Sort by createdAt descending (newest first)
    const sorted = [...destinations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({
      results: sorted,
      count: sorted.length,
    });
  }

  if (req.method === "POST") {
    // Create a new destination
    try {
      const {
        name,
        address,
        lat,
        lng,
        notifyBefore = 1,
        radius = 100,
        isActive = false,
      } = req.body;

      // Validate required fields
      if (!name || !address || lat === undefined || lng === undefined) {
        return res.status(400).json({
          error: "Missing required fields: name, address, lat, lng",
        });
      }

      // Validate coordinates
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
          error: "Invalid coordinates",
        });
      }

      // If setting this destination as active, deactivate all others
      if (isActive) {
        destinations = destinations.map((dest) => ({
          ...dest,
          isActive: false,
        }));
      }

      const newDestination: Destination = {
        id: uuidv4(),
        name,
        address,
        lat,
        lng,
        notifyBefore,
        radius,
        isActive,
        createdAt: new Date().toISOString(),
      };

      destinations.push(newDestination);

      return res.status(201).json(newDestination);
    } catch (error) {
      console.error("Error creating destination:", error);
      return res.status(500).json({ error: "Failed to create destination" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}

// Export destinations for use in other API routes
export { destinations };
