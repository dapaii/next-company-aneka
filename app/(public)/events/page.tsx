// app/(public)/events/page.tsx
import Image from "next/image";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MapPin } from "lucide-react";
import PublicControlsIsland from "@/components/events/PublicControlsIsland";

/* Optional (biar selalu fresh) */
export const revalidate = 0;
// atau: export const dynamic = "force-dynamic";

/* ===== Types ===== */
type EventStatus = "draft" | "published" | "archived";
type Scope = "all" | "upcoming" | "ongoing" | "past";
type Sort = "soonest" | "latest";

type EventDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  photos: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

/* ===== Helpers (server) ===== */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}
async function fetchEvents(): Promise<EventDto[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || (await getBaseUrl());
  const cookie = (await cookies()).toString();
  const url = new URL("/api/events", base).toString();
  const res = await fetch(url, { cache: "no-store", headers: { cookie } });
  if (!res.ok) return [];
  const json = (await res.json()) as { events?: EventDto[] };
  return Array.isArray(json.events) ? json.events : [];
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
  if (!s) return null;
  if (isValidLocalPath(s) || isValidRemoteUrl(s)) return s;
  return null;
}

/* ===== Filtering & formatting ===== */
function formatRange(startsAt: string, endsAt: string) {
  const fmt: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  return `${s.toLocaleString("id-ID", fmt)} — ${e.toLocaleString("id-ID", fmt)}`;
}

function withScope(list: EventDto[], scope: Scope) {
  if (scope === "all") return list;
  const now = Date.now();
  if (scope === "upcoming") {
    return list.filter((e) => new Date(e.startsAt).getTime() > now);
  }
  if (scope === "ongoing") {
    return list.filter((e) => {
      const s = new Date(e.startsAt).getTime();
      const en = new Date(e.endsAt).getTime();
      return s <= now && now <= en;
    });
  }
  // past
  return list.filter((e) => new Date(e.endsAt).getTime() < now);
}

function withSort(list: EventDto[], sort: Sort) {
  if (sort === "soonest") {
    return [...list].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }
  // latest by updatedAt
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/* ===== Page (Next.js 15: searchParams is Promise) ===== */
export default async function PublicEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; scope?: Scope; sort?: Sort }>;
}) {
  const events = await fetchEvents();
  const published = events.filter((e) => e.status === "published");

  // ✅ WAJIB: await sebelum akses propertinya (Next 15)
  const sp = await searchParams;
  const q = (sp?.q ?? "").toString().trim().toLowerCase();
  const scope: Scope = (sp?.scope as Scope) ?? "all";
  const sort: Sort = (sp?.sort as Sort) ?? "soonest";

  const filteredByText = q
    ? published.filter((e) => {
        const hay = `${e.title} ${e.description ?? ""} ${e.location ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
    : published;

  const scoped = withScope(filteredByText, scope);
  const finalList = withSort(scoped, sort);

  // Hitung sekali supaya tidak dihitung berulang di map
  const now = Date.now();

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Event</h1>
          <p className="text-sm text-muted-foreground">
            Jelajahi event yang sedang / akan berlangsung.
          </p>
        </section>

        {/* Client-only controls via island (live filter tanpa submit) */}
        <PublicControlsIsland
          initialQuery={q}
          initialScope={scope}
          initialSort={sort}
          total={finalList.length}
        />

        {/* List */}
        {finalList.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Tidak ada event</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coba hapus filter atau ganti kata kunci.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {finalList.map((ev, idx) => {
              const cover =
                Array.isArray(ev.photos)
                  ? ev.photos.map(toSafeImageSrc).find((s): s is string => !!s) ?? null
                  : null;

              const live =
                new Date(ev.startsAt).getTime() <= now &&
                now <= new Date(ev.endsAt).getTime();

              return (
                <Card key={ev.id} className="overflow-hidden transition hover:shadow-md">
                  {/* Cover */}
                  <Link href={`/events/${ev.slug}`} className="block" aria-label={ev.title}>
                    <div className="relative aspect-[16/9] bg-muted">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={ev.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          /* Optimisasi LCP untuk kartu pertama */
                          priority={idx === 0}
                          fetchPriority={idx === 0 ? "high" : undefined}
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                          <ImageIcon className="h-7 w-7" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-tight line-clamp-2">
                        <Link
                          href={`/events/${ev.slug}`}
                          className="hover:underline underline-offset-4"
                        >
                          {ev.title}
                        </Link>
                      </CardTitle>
                      {live ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">
                          Live
                        </Badge>
                      ) : null}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatRange(ev.startsAt, ev.endsAt)}
                    </div>

                    {ev.location ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    ) : null}
                  </CardHeader>

                  {ev.description ? (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {ev.description}
                      </p>
                    </CardContent>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
