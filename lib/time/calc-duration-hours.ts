// lib/time/calc-duration-hours.ts
export function calcDurationHours(startsAt: string, endsAt: string): number {
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  const hours = Math.max(0, (e - s) / 3_600_000);
  return Math.round(hours * 10) / 10;
}
