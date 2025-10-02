// lib/time/format-range.ts
export function formatRange(startsAt: string, endsAt: string, locale = "id-ID") {
  const fmt: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  return `${s.toLocaleString(locale, fmt)} — ${e.toLocaleString(locale, fmt)}`;
}
