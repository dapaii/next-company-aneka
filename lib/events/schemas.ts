// lib/events/schemas.ts
import { z } from "zod";

export const EventStatusZ = z.enum(["draft", "published", "archived"]);
export type EventStatus = z.infer<typeof EventStatusZ>;

export const EventDtoZ = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  photos: z.array(z.string()),
  status: EventStatusZ,
  createdAt: z.string(),
  updatedAt: z.string(),
  createdById: z.string().nullable().optional(),
});

export type EventDto = z.infer<typeof EventDtoZ>;
