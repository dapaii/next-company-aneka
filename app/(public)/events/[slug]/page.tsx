// app/(public)/events/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { headers, cookies } from "next/headers";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarRange,
  Clock4,
  MapPin,
  ImageIcon,
} from "lucide-react";

/* ===== Types & Schemas ===== */
const EventStatusZ = z.enum(["draft", "published", "archived"]);
const EventDtoZ = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startsAt: z.string(), // ISO
  endsAt: z.string(),   // ISO
  photos: z.array(z.string()),
  status: EventStatusZ,
});
type EventStatus = z.infer<typeof EventStatusZ>;
type EventDto = z.infer<typeof EventDtoZ>;

/* ===== Helpers (server) ===== */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

async function fetchEvents(): Promise<EventDto[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url = new URL("/api/events", base).toString();

  const res = await fetch(url, { cache: "no-store", headers: { cookie } });
  if (!res.ok) return [];

  const json: unknown = await res.json();
  const parsed = z.object({ events: z.array(EventDtoZ) }).safeParse(json);
  return parsed.success ? parsed.data.events : [];
}

/* ===== Image src guards ===== */
function isValidRemoteUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
function normalizeLocalPath(s: string): string {
  const t = s.trim();
  return t.startsWith("uploads/") ? `/${t}` : t;
}
function isValidLocalPath(s: string): boolean {
  return s.startsWith("/uploads/");
}
function toSafeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  const s = normalizeLocalPath(src);
  if (s.length === 0) return null;
  if (isValidLocalPath(s) || isValidRemoteUrl(s)) return s;
  return null;
}

/* ===== Formatting & calc ===== */
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
function calcDurationHours(startsAt: string, endsAt: string): number {
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  const hours = Math.max(0, (e - s) / 3600000);
  return Math.round(hours * 10) / 10;
}
function liveNow(startsAt: string, endsAt: string): boolean {
  const now = Date.now();
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  return s <= now && now <= e;
}
function statusBadgeVariant(
  status: EventStatus
): "default" | "secondary" | "destructive" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "destructive";
}

/* ===== Page (await params!) ===== */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ Next 15: params harus di-await
  const events = await fetchEvents();
  const ev = events.find((e) => e.slug === slug && e.status === "published");

  if (!ev) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Event
              </Link>
            </Button>
          </div>
          <Card className="border-dashed">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Event tidak ditemukan.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const cover = toSafeImageSrc(ev.photos[0] ?? null);
  const restPhotos = ev.photos.slice(1).map(toSafeImageSrc).filter((s): s is string => !!s);
  const isLive = liveNow(ev.startsAt, ev.endsAt);
  const duration = calcDurationHours(ev.startsAt, ev.endsAt);

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top bar: back + status */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" asChild>
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Event
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            {isLive ? (
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">Live</Badge>
            ) : null}
            <Badge variant={statusBadgeVariant(ev.status)} className="capitalize">
              {ev.status}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{ev.title}</h1>
          <p className="text-sm text-muted-foreground">@{ev.slug}</p>
        </div>

        {/* Cover (LCP optimized) */}
        <div className="relative overflow-hidden rounded-xl border bg-muted">
          <div className="relative aspect-[16/9] w-full">
            {cover ? (
              <Image
                src={cover}
                alt={ev.title}
                fill
                className="object-cover"
                // ✅ LCP optimizations
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="rounded-xl border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <CalendarRange className="h-5 w-5 text-primary mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Waktu</div>
                <div className="text-sm">
                  {formatDateTime(ev.startsAt)} — {formatDateTime(ev.endsAt)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock4 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Durasi</div>
                <div className="text-sm">{duration} jam</div>
              </div>
            </div>

            {ev.location ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Lokasi</div>
                  <div className="text-sm truncate">{ev.location}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 opacity-60">
                <MapPin className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Lokasi</div>
                  <div className="text-sm">—</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {ev.description ? (
          <>
            <Separator />
            <section className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{ev.description}</p>
            </section>
          </>
        ) : null}

        {/* Extra photos */}
        {restPhotos.length > 0 ? (
          <>
            <Separator />
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Galeri</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {restPhotos.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={src}
                      alt={`${ev.title} - photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
