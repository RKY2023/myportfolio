import * as z from "zod";

// Destination Schema for Location Tracking
export const destinationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Destination name is required"),
  address: z.string().min(1, "Address is required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  notifyBefore: z.number().min(1).max(60).default(1), // Minutes before arrival
  radius: z.number().min(10).max(1000).default(100), // Meters
  isActive: z.boolean().default(false),
  createdAt: z.string().datetime(),
  arrivedAt: z.string().datetime().optional(),
});

// Health Status Schema
export const healthStatusSchema = z
  .object({
    sleepHours: z.number().optional().default(0),
    exerciseMinutes: z.number().optional().default(0),
    energyLevel: z.number().min(1).max(10).optional(),
    symptoms: z.array(z.string()).optional().default([]),
  })
  .optional();

// Food Item Schema
export const foodItemSchema = z.object({
  name: z.string().min(1, "Food name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  time: z.string().optional(),
  calories: z.number().optional(),
  notes: z.string().optional(),
});

// Food Routine Schema
export const foodRoutineSchema = z.object({
  morningItems: z.array(foodItemSchema).optional().default([]),
  breakfastItems: z.array(foodItemSchema).optional().default([]),
  lunchItems: z.array(foodItemSchema).optional().default([]),
  dinnerItems: z.array(foodItemSchema).optional().default([]),
  snacks: z.array(foodItemSchema).optional().default([]),
  waterIntake: z.number().optional().default(0),
});

// Diary Entry Schema
export const diaryEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().optional().default(""),
  entryDate: z.string().min(1, "Entry date is required"),
  entryTime: z.string().optional(),
  mood: z
    .enum([
      "happy",
      "sad",
      "angry",
      "anxious",
      "neutral",
      "excited",
      "tired",
      "productive",
      "grateful",
      "reflective",
      "other",
    ])
    .optional(),
  moodScore: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .refine(
      (val) => val === undefined || val >= 1,
      "Mood score must be between 1-10"
    ),
  weather: z.string().optional(),
  location: z.string().optional(),
  wordOfDay: z.string().optional(),
  quote: z.string().optional(),
  productiveWorkList: z.array(z.string()).default([]),
  tagIds: z.array(z.number()).default([]),
  visibility: z.enum(["private", "public", "friends"]).default("private"),
  timelineEventId: z.number().optional(),
  healthStatus: healthStatusSchema,
  foodRoutine: foodRoutineSchema.optional(),
});

export type DiaryEntryFormData = z.infer<typeof diaryEntrySchema>;

// Timeline Event Schema
export const timelineEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  eventType: z.enum([
    "milestone",
    "project",
    "travel",
    "relationship",
    "health",
    "education",
    "career",
    "personal",
    "goal",
    "habit",
    "other",
  ]),
  status: z.enum(["planned", "ongoing", "completed", "cancelled"]).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  tagIds: z.array(z.number()).optional(),
  isMilestone: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
  parentEventId: z.number().optional(),
});

export type TimelineEventFormData = z.infer<typeof timelineEventSchema>;

// Checkpoint Schema
export const checkpointSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  checkpointDate: z.string().min(1, "Date is required"),
  isCompleted: z.boolean().optional().default(false),
});

export type CheckpointFormData = z.infer<typeof checkpointSchema>;

// Tag Schema
export const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
  color: z.string().optional().default("#3B82F6"),
});

export type TagFormData = z.infer<typeof tagSchema>;
