export const pad2 = (n: number): string => n.toString().padStart(2, "0");

export const toKey = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const getMondayBasedWeekday = (jsDay: number): number =>
  (jsDay + 6) % 7; // 0=Mon..6=Sun

export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

export const addDays = (d: Date, days: number): Date => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
};

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const expandDateKeysLocal = (startIso: string, endIso: string): string[] => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const keys: string[] = [];
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  for (let d = s; d <= e; d = addDays(d, 1)) keys.push(toKey(d));
  return keys;
};
