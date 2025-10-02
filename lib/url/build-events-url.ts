// pure util (no React), gampang dites
import type { Scope, Sort } from "@/types/filters";

type NextVals = { q?: string; scope?: Scope; sort?: Sort };

export function buildEventsUrl(
  basePath: string,
  currentParams: string,
  next: NextVals
): string {
  const params = new URLSearchParams(currentParams ?? "");

  if (typeof next.q === "string") {
    const trimmed = next.q.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
  }
  if (next.scope) params.set("scope", next.scope);
  if (next.sort)  params.set("sort", next.sort);

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
