// app/api/events/validators.ts (opsional, atau inline)
import { z } from 'zod';

export const eventBase = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  photos: z.array(z.string().url()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});