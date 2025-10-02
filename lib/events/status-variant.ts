// lib/events/status-variant.ts
import type { EventStatus } from "@/types/events";

export function statusVariant(s: EventStatus) {
  switch (s) {
    case "published": return "default" as const;
    case "draft":     return "secondary" as const;
    case "archived":  return "destructive" as const;
  }
}

export function statusBadgeVariant(
  status: EventStatus
): "default" | "secondary" | "destructive" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "destructive";
}