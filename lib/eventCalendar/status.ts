// lib/eventCalendar/status.ts
import type { EventStatus } from "@/types/events";

/** badge variant untuk shadcn/ui */
const BADGE_VARIANT: Record<EventStatus, "default" | "secondary" | "destructive"> = {
  published: "default",
  draft: "secondary",
  archived: "destructive",
};

export const statusVariant = (status: EventStatus) => BADGE_VARIANT[status];

/** kelas warna untuk titik mini di grid */
const DOT_CLASS: Record<EventStatus, string> = {
  published: "bg-emerald-500",
  draft: "bg-slate-400",
  archived: "bg-rose-500",
};

export const statusDotClass = (status: EventStatus) => DOT_CLASS[status];
