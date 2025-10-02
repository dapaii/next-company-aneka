export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

export const diffHours = (aIso: string, bIso: string) => {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.max(0, (b - a) / 3_600_000);
};
