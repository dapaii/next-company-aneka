import type { EventDto, EventStatus, RecentItem } from "./types";
import { diffHours } from "./time";

export const countByStatus = (events: EventDto[]) => {
  const out: Record<EventStatus | "total", number> = { draft: 0, published: 0, archived: 0, total: events.length };
  for (const e of events) out[e.status] += 1;
  return out;
};

export const nextUpcoming = (events: EventDto[]): EventDto | null => {
  const now = Date.now();
  return events
    .filter((e) => new Date(e.startsAt).getTime() >= now)
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0] ?? null;
};

export const averageDurationHours = (events: EventDto[]) => {
  if (!events.length) return 0;
  const sum = events.reduce((acc, e) => acc + diffHours(e.startsAt, e.endsAt), 0);
  return Math.round((sum / events.length) * 10) / 10;
};

export const publicationRate = (events: EventDto[]) => {
  const { total, published } = countByStatus(events);
  return total ? Math.round((published / total) * 100) : 0;
};

export const upcomingThisWeek = (events: EventDto[]) => {
  const now = new Date();
  const in7d = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  return events
    .filter((e) => {
      const s = new Date(e.startsAt);
      return s >= now && s <= in7d;
    })
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
    .slice(0, 5);
};

export const recentActivity = (events: EventDto[]): RecentItem[] =>
  [...events]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 6)
    .map((e) => ({
      title: e.title,
      status: e.status,
      at: new Date(e.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }),
    }));

// sparkline
export const buildSparklinePath = (points: number[], w = 140, h = 40, pad = 4) => {
  const n = points.length;
  if (n <= 1) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const X = (i: number) => pad + (i / (n - 1)) * innerW;
  const Y = (v: number) => pad + innerH - ((v - min) / range) * innerH;
  let d = `M ${X(0)} ${Y(points[0])}`;
  for (let i = 1; i < n; i++) d += ` L ${X(i)} ${Y(points[i])}`;
  return d;
};

export const build7DayTrend = (events: EventDto[]) => {
  const today = new Date();
  const arr: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
    const label = d.toLocaleDateString("id-ID", { weekday: "short" });
    const value = events.filter((e) => {
      const s = new Date(e.startsAt);
      return s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate();
    }).length;
    arr.push({ label, value });
  }
  return arr;
};
