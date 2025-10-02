// lib/events/live-now.ts
export function isLiveNow(startsAt: string, endsAt: string) {
  const now = Date.now();
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  return s <= now && now <= e;
}
