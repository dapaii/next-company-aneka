// app/dashboard/page.tsx
import { headers, cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventsCalendar from "@/components/EventsCalendar";
import { CalendarDays, CheckCircle2, FilePenLine, Archive as ArchiveIcon, Clock4, Sparkles } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import AnimatedStatCardMagnetic from "@/components/motion/AnimatedStatCardMagnetic";
import { Progress } from "@/components/ui/progress";

type EventStatus = "draft" | "published" | "archived";
type EventDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  startsAt: string;
  endsAt: string;
  photos: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
};

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
  const events = (json as { events?: unknown })?.events;
  if (!Array.isArray(events)) return [];
  return events as EventDto[];
}

/* ===== Helpers & stats ===== */
function countByStatus(events: EventDto[]) {
  let published = 0;
  let draft = 0;
  let archived = 0;
  for (const ev of events) {
    if (ev.status === "published") published++;
    else if (ev.status === "draft") draft++;
    else if (ev.status === "archived") archived++;
  }
  return { published, draft, archived, total: events.length };
}

function nextUpcoming(events: EventDto[]): EventDto | null {
  const now = Date.now();
  const future = events
    .filter((e) => new Date(e.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return future[0] ?? null;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function diffHours(aIso: string, bIso: string) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.max(0, (b - a) / 1000 / 3600);
}
function averageDurationHours(events: EventDto[]) {
  if (events.length === 0) return 0;
  const sum = events.reduce((acc, e) => acc + diffHours(e.startsAt, e.endsAt), 0);
  return Math.round((sum / events.length) * 10) / 10;
}
function publicationRate(events: EventDto[]) {
  const { total, published } = countByStatus(events);
  if (total === 0) return 0;
  return Math.round((published / total) * 100);
}
function upcomingThisWeek(events: EventDto[]) {
  const now = new Date();
  const in7d = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
  return events
    .filter((e) => {
      const s = new Date(e.startsAt);
      return s >= now && s <= in7d;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 5);
}
function recentActivity(events: EventDto[]) {
  return [...events]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)
    .map((e) => ({
      title: e.title,
      status: e.status,
      at: new Date(e.updatedAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));
}

/* ===== Server-side sparkline (inline SVG) ===== */
function buildSparklinePath(points: number[], w = 140, h = 40, pad = 4) {
  const n = points.length;
  if (n <= 1) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const x = (i: number) => pad + (i / (n - 1)) * innerW;
  const y = (v: number) => pad + innerH - ((v - min) / range) * innerH;
  let d = `M ${x(0)} ${y(points[0])}`;
  for (let i = 1; i < n; i++) d += ` L ${x(i)} ${y(points[i])}`;
  return d;
}

export default async function DashboardPage() {
  const sess = await getSession();
  const events = await fetchEvents();

  const stats = countByStatus(events);
  const upcoming = nextUpcoming(events);
  const weekly = upcomingThisWeek(events);
  const recent = recentActivity(events);
  const avgHours = averageDurationHours(events);
  const pubRate = publicationRate(events);

  const miniTrendData = (() => {
    const today = new Date();
    const arr: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      const count = events.filter((e) => {
        const s = new Date(e.startsAt);
        return (
          s.getFullYear() === d.getFullYear() &&
          s.getMonth() === d.getMonth() &&
          s.getDate() === d.getDate()
        );
      }).length;
      arr.push({ label, value: count });
    }
    return arr;
  })();
  const sparkPath = buildSparklinePath(miniTrendData.map((d) => d.value));

  return (
    <main className="p-4 sm:p-1">
      {/* Container max width */}
      <div className="mx-auto max-w-7xl space-y-2">
        {/* Header strip */}
        <FadeIn>
          <section className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Halo {sess?.email} 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                Ringkasan cepat status event & kalender.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Stats row (equal height) */}
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr]">
          <StaggerItem>
            <AnimatedStatCardMagnetic
              className="h-full"
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              label="Published"
              value={stats.published}
              borderClass="border-emerald-200/60 dark:border-emerald-900/40"
              hint="Event yang sudah tayang."
            />
          </StaggerItem>
          <StaggerItem>
            <AnimatedStatCardMagnetic
              className="h-full"
              icon={<FilePenLine className="h-4 w-4 text-amber-600" />}
              label="Draft"
              value={stats.draft}
              borderClass="border-amber-200/60 dark:border-amber-900/40"
              hint="Masih dalam proses penyusunan."
            />
          </StaggerItem>
          <StaggerItem>
            <AnimatedStatCardMagnetic
              className="h-full"
              icon={<ArchiveIcon className="h-4 w-4 text-rose-600" />}
              label="Archived"
              value={stats.archived}
              borderClass="border-rose-200/60 dark:border-rose-900/40"
              hint="Event yang sudah diarsipkan."
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Middle row (equal height) */}
        <section className="grid gap-6 md:grid-cols-3 auto-rows-[1fr]">
          <FadeIn>
            <Card className="h-full">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Tingkat Publikasi</CardTitle>
                  <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                    {pubRate}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <Progress value={pubRate} />
                <p className="text-xs text-muted-foreground">
                  {stats.published} dari {stats.total} event sudah dipublikasikan.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.03}>
            <Card className="h-full">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Rata-rata durasi</CardTitle>
                  <Clock4 className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-3xl font-semibold">{avgHours}</div>
                <div className="text-xs text-muted-foreground mt-1">jam per event</div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.06}>
            <Card className="h-full overflow-hidden">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Event / 7 hari</CardTitle>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-2xl font-semibold">
                  {miniTrendData.reduce((a, b) => a + b.value, 0)}
                </div>
                <div className="h-16 -mx-1 mt-1">
                  <svg viewBox="0 0 140 40" className="w-full h-full">
                    <path
                      d={sparkPath}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                    />
                  </svg>
                </div>
                <div className="mt-2 grid grid-cols-7 gap-2 text-[10px] text-muted-foreground">
                  {miniTrendData.map((d, i) => (
                    <span key={i} className="truncate text-center">{d.label}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </section>

        {/* Bottom: Calendar + Side column with tidy lists */}
        <section className="grid gap-6 lg:grid-cols-12">
          {/* Calendar */}
          <FadeIn once={false} className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Kalender Event</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                    {stats.total} total event
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <EventsCalendar events={events} />
              </CardContent>
            </Card>
          </FadeIn>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            {/* Next Up */}
            <FadeIn delay={0.05} once={false}>
              <Card className="h-full">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-medium">Next Up</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  {upcoming ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="text-base font-semibold leading-tight line-clamp-2">
                          {upcoming.title}
                        </div>
                        <div className="text-xs text-muted-foreground">@{upcoming.slug}</div>
                      </div>

                      <div className="grid gap-1.5 text-sm">
                        <div className="font-medium">Waktu</div>
                        <div className="text-muted-foreground">
                          {formatDateTime(upcoming.startsAt)} {" — "} {formatDateTime(upcoming.endsAt)}
                        </div>
                      </div>

                      {upcoming.location ? (
                        <div className="grid gap-1.5 text-sm">
                          <div className="font-medium">Lokasi</div>
                          <div className="text-muted-foreground">{upcoming.location}</div>
                        </div>
                      ) : null}

                      <div className="grid gap-1.5 text-sm">
                        <div className="font-medium">Status</div>
                        <Badge
                          className="capitalize mt-1 w-fit"
                          variant={
                            upcoming.status === "published"
                              ? "default"
                              : upcoming.status === "draft"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {upcoming.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Tidak ada event mendatang.</p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Minggu ini */}
            <FadeIn delay={0.08}>
              <Card className="h-full">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-medium">Minggu ini</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  {weekly.length > 0 ? (
                    <ul className="divide-y">
                      {weekly.map((ev) => (
                        <li key={ev.id} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-sm leading-tight line-clamp-1">
                              {ev.title}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDateTime(ev.startsAt)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Belum ada event dalam 7 hari ke depan.
                    </p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Aktivitas Terbaru */}
            <FadeIn delay={0.1}>
              <Card className="h-full">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-medium">Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  {recent.length > 0 ? (
                    <ul className="divide-y">
                      {recent.map((it, idx) => (
                        <li key={idx} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-sm leading-tight line-clamp-1">
                              {it.title}
                            </span>
                            <Badge
                              className="capitalize shrink-0"
                              variant={
                                it.status === "published"
                                  ? "default"
                                  : it.status === "draft"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {it.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{it.at}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      </div>
    </main>
  );
}
