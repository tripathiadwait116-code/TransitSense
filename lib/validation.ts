import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const busLocationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().min(0).max(150).default(0),
  heading: z.number().min(0).max(360).default(0),
  nextStopId: z.string().optional().nullable(),
});

export const busCreateSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required").toUpperCase(),
  registrationNumber: z.string().min(4, "Valid registration number required"),
  routeId: z.string().optional().nullable(),
  capacity: z.number().int().min(10).max(120).default(60),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "DELAYED"]).default("ACTIVE"),
  isSimulated: z.boolean().default(true),
});

export const busUpdateSchema = busCreateSchema.partial();

export const routeCreateSchema = z.object({
  routeNumber: z.string().min(1, "Route number is required").toUpperCase(),
  routeName: z.string().min(3, "Route description/name is required"),
  startPoint: z.string().min(2, "Starting point required"),
  destination: z.string().min(2, "Destination required"),
  totalDistanceKm: z.number().min(0).default(0),
  estimatedDurationMin: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  stopIds: z.array(z.string()).optional(),
});

export const routeUpdateSchema = routeCreateSchema.partial();

export const busStopCreateSchema = z.object({
  name: z.string().min(2, "Stop name is required"),
  code: z.string().min(2, "Stop code is required").toUpperCase(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  landmark: z.string().optional().nullable(),
  city: z.string().default("Hyderabad"),
});

export const reportCreateSchema = z.object({
  category: z.enum([
    "BUS_DELAY",
    "OVERCROWDING",
    "BUS_NOT_FOUND",
    "INCORRECT_ETA",
    "STOP_ISSUE",
    "OTHER",
  ]),
  busNumber: z.string().optional().nullable(),
  routeId: z.string().optional().nullable(),
  description: z.string().min(10, "Please provide at least 10 characters describing the issue"),
  contactEmail: z.string().email("Valid email required").optional().nullable().or(z.literal("")),
});

export const favoriteCreateSchema = z.object({
  targetType: z.enum(["BUS", "ROUTE", "STOP"]),
  targetId: z.string().min(1, "Target ID is required"),
});
