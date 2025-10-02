export type EventStatus = "draft" | "published" | "archived";

export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  photos: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};
