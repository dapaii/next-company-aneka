// lib/image/safe-src.ts
export function isValidRemoteUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}
export function normalizeLocalPath(s: string): string {
  const t = s.trim();
  return t.startsWith("uploads/") ? `/${t}` : t;
}
export function isValidLocalPath(s: string): boolean {
  return s.startsWith("/uploads/");
}
export function toSafeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  const s = normalizeLocalPath(src);
  if (!s) return null;
  if (isValidLocalPath(s) || isValidRemoteUrl(s)) return s;
  return null;
}
