import { NextApiRequest, NextApiResponse } from "next";
import { destinations } from "../destinations";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid destination ID" });
  }

  const index = destinations.findIndex((dest) => dest.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Destination not found" });
  }

  if (req.method === "GET") {
    // Get single destination by ID
    return res.status(200).json(destinations[index]);
  }

  if (req.method === "PATCH") {
    // Update destination
    try {
      const {
        name,
        address,
        lat,
        lng,
        notifyBefore,
        radius,
        isActive,
        arrivedAt,
      } = req.body;

      // If setting this destination as active, deactivate all others
      if (isActive && !destinations[index].isActive) {
        for (let i = 0; i < destinations.length; i++) {
          if (i !== index) {
            destinations[i].isActive = false;
          }
        }
      }

      // Update fields
      if (name !== undefined) destinations[index].name = name;
      if (address !== undefined) destinations[index].address = address;
      if (lat !== undefined) destinations[index].lat = lat;
      if (lng !== undefined) destinations[index].lng = lng;
      if (notifyBefore !== undefined)
        destinations[index].notifyBefore = notifyBefore;
      if (radius !== undefined) destinations[index].radius = radius;
      if (isActive !== undefined) destinations[index].isActive = isActive;
      if (arrivedAt !== undefined) destinations[index].arrivedAt = arrivedAt;

      return res.status(200).json(destinations[index]);
    } catch (error) {
      console.error("Error updating destination:", error);
      return res.status(500).json({ error: "Failed to update destination" });
    }
  }

  if (req.method === "DELETE") {
    // Delete destination
    try {
      const deleted = destinations.splice(index, 1)[0];
      return res.status(200).json({
        message: "Destination deleted successfully",
        destination: deleted,
      });
    } catch (error) {
      console.error("Error deleting destination:", error);
      return res.status(500).json({ error: "Failed to delete destination" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
