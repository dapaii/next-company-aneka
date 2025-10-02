// lib/events/public-filters.ts
import type { Scope, Sort } from "@/types/filters";
import type { EventDto } from "@/types/events";
import { textFilter, withScope, withSort } from "@/lib/events/filtering";

export type SP = Record<string, string | string[] | undefined>;

export function parseFilters(sp: SP) {
  const q     = ((sp.q as string) ?? "").trim();
  const scope = ((sp.scope as string) ?? "all") as Scope;
  const sort  = ((sp.sort as string) ?? "soonest") as Sort;
  return { q, scope, sort };
}

export function applyFilters(list: EventDto[], q: string, scope: Scope, sort: Sort) {
  return withSort(withScope(textFilter(list, q), scope), sort);
}
