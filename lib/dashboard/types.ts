export type EventStatus = "draft" | "published" | "archived";

export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  photos: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

export type RecentItem = {
  title: string;
  status: EventStatus;
  at: string; // localized string
};
