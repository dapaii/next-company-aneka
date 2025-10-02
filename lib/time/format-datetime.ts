// lib/time/format-datetime.ts
export function formatDateTime(iso: string, locale = "id-ID") {
  return new Date(iso).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
