// services/events.ts
import "server-only";
import { headers, cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { EventDto, EventStatus } from "@/types/events";

/* ---------- Cache tag ---------- */
export const EVENTS_TAG = "events";

/* ---------- Type guards (no any) ---------- */
const isEventStatus = (v: unknown): v is EventStatus =>
  v === "draft" || v === "published" || v === "archived";

const isNullableString = (v: unknown) =>
  v === undefined || v === null || typeof v === "string";

const isEventDto = (x: unknown): x is EventDto => {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.title === "string" &&
    typeof r.slug === "string" &&
    isNullableString(r.description) &&
    isNullableString(r.location) &&
    typeof r.startsAt === "string" &&
    typeof r.endsAt === "string" &&
    Array.isArray(r.photos) &&
    r.photos.every((p) => typeof p === "string") &&
    isEventStatus(r.status) &&
    typeof r.createdAt === "string" &&
    typeof r.updatedAt === "string"
  );
};

const hasEventsKey = (b: unknown): b is { events?: unknown } =>
  typeof b === "object" && b !== null && "events" in b;

const hasEventKey = (b: unknown): b is { event?: unknown } =>
  typeof b === "object" && b !== null && "event" in b;

/* small parsers */
const parseEventsBody = (body: unknown): EventDto[] => {
  if (hasEventsKey(body) && Array.isArray(body.events)) {
    return body.events.filter(isEventDto);
  }
  return [];
};

const parseEventBody = (body: unknown): EventDto | null => {
  if (hasEventKey(body) && isEventDto(body.event)) return body.event;
  if (isEventDto(body)) return body; // fallback jika API return langsung EventDto
  return null;
};

/* ---------- Base URL resolver ---------- */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

/* ---------- Fetchers ---------- */
/**
 * Authenticated fetch (no-store). Cocok untuk dashboard/admin yang perlu real-time.
 */
export async function fetchEvents(): Promise<EventDto[]> {
  const base   = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url    = new URL("/api/events", base).toString();

  const res = await fetch(url, { cache: "no-store", headers: { cookie } });
  if (!res.ok) return [];

  const body: unknown = await res.json();
  return parseEventsBody(body);
}

/**
 * Public fetch with cache (revalidate + tag). Ideal untuk halaman publik/Lighthouse.
 * Catatan: pakai ABSOLUTE URL TANPA cookie agar bisa di-cache global.
 */
export async function fetchPublicEventsCached(opts?: { revalidate?: number }): Promise<EventDto[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const url  = new URL("/api/events", base).toString();

  const res = await fetch(url, {
    // jangan kirim cookie/header auth → biar bisa di-cache stabil
    next: { revalidate: opts?.revalidate ?? 60, tags: [EVENTS_TAG] },
  });
  if (!res.ok) return [];

  const body: unknown = await res.json();
  return parseEventsBody(body);
}

/**
 * Ambil 1 event by id (no-store, authenticated).
 */
export async function fetchEventById(id: string): Promise<EventDto> {
  const base   = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url    = new URL(`/api/events/${id}`, base).toString();

  const res = await fetch(url, { cache: "no-store", headers: { cookie } });
  if (!res.ok) throw new Error("Failed to fetch event");

  const body: unknown = await res.json();
  const parsed = parseEventBody(body);
  if (!parsed) throw new Error("Invalid event payload");
  return parsed;
}

/**
 * Panggil ini setelah create/update/delete event untuk bust cache publik.
 */
export function revalidateEventsTag() {
  try {
    revalidateTag(EVENTS_TAG);
  } catch {
    // noop (aman kalau env belum support)
  }
}

export { getBaseUrl };
