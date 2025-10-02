import type { EventDto } from "@/types/events";
import type { Scope, Sort } from "@/types/filters";

export function textFilter(list: EventDto[], q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return list;
  return list.filter((e) => {
    const hay = `${e.title} ${e.description ?? ""} ${e.location ?? ""}`.toLowerCase();
    return hay.includes(needle);
  });
}

export function withScope(list: EventDto[], scope: Scope, nowMs = Date.now()) {
  if (scope === "all") return list;
  if (scope === "upcoming") {
    return list.filter((e) => new Date(e.startsAt).getTime() > nowMs);
  }
  if (scope === "ongoing") {
    return list.filter((e) => {
      const s = new Date(e.startsAt).getTime();
      const en = new Date(e.endsAt).getTime();
      return s <= nowMs && nowMs <= en;
    });
  }
  // past
  return list.filter((e) => new Date(e.endsAt).getTime() < nowMs);
}

export function withSort(list: EventDto[], sort: Sort) {
  if (sort === "soonest") {
    return [...list].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
