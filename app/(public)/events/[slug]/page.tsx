// app/(public)/events/[slug]/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackBar from "@/components/events/detail/BackBar";
import EventCover from "@/components/events/detail/EventCover";
import EventMeta from "@/components/events/detail/EventMeta";
import EventGallery from "@/components/events/detail/EventGallery";
import ViewPing from "@/components/events/ViewPing";

import ShareButton from "@/components/events/ShareButton";
import AddToCalendar from "@/components/events/AddToCalendar";
import ScrollTo from "@/components/events/ScrollTo";

import type { EventDto } from "@/types/events";
import { fetchEvents } from "@/services/events";
import { toSafeImageSrc } from "@/lib/image/safe-src";
import { isLiveNow } from "@/lib/events/live-now";
import { calcDurationHours } from "@/lib/time/calc-duration-hours";
import { ArrowLeft, MapPin, Image as ImageIcon } from "lucide-react";

/** Next 15: params as Promise */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Ambil list event public
  const events = await fetchEvents();
  const ev: EventDto | undefined = events.find(
    (e) => e.slug === slug && e.status === "published"
  );

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
  const restPhotos = ev.photos
    .slice(1)
    .map(toSafeImageSrc)
    .filter((s): s is string => !!s);

  const isLive = isLiveNow(ev.startsAt, ev.endsAt);
  const duration = calcDurationHours(ev.startsAt, ev.endsAt);

  const mapsHref = ev.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        ev.location
      )}`
    : null;

  return (
    <main className="relative p-4 sm:p-6">
      {/* Ping view saat halaman dirender di browser */}
      <ViewPing slug={ev.slug} />

      {/* Decorative gradient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background to-background" />

      <div className="mx-auto max-w-6xl space-y-6">
        <BackBar isLive={isLive} status={ev.status} />

        {/* Title + slug */}
        <header className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {ev.title}
          </h1>
          <p className="text-sm text-muted-foreground">@{ev.slug}</p>
        </header>

        {/* 2-column layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: main content */}
          <div className="lg:col-span-2 space-y-6">
            <EventCover src={cover} alt={ev.title} />

            <EventMeta
              startsAt={ev.startsAt}
              endsAt={ev.endsAt}
              durationHours={duration}
              location={ev.location}
            />

            {/* quick actions (mobile-first) */}
            <div className="flex flex-wrap gap-2 sm:hidden">
              <ShareButton />
              {mapsHref ? (
                <Button asChild variant="outline" size="sm">
                  <a href={mapsHref} target="_blank" rel="noreferrer">
                    <MapPin className="mr-2 h-4 w-4" />
                    Buka Maps
                  </a>
                </Button>
              ) : null}
              <ScrollTo targetId="gallery" size="sm" variant="secondary">
                <ImageIcon className="mr-2 h-4 w-4" />
                Lihat Galeri
              </ScrollTo>
              <AddToCalendar
                title={ev.title}
                description={ev.description ?? ev.title}
                location={ev.location ?? ""}
                startsAt={new Date(ev.startsAt)}
                endsAt={new Date(ev.endsAt)}
                size="sm"
              />
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Tentang Event</CardTitle>
              </CardHeader>
              <CardContent>
                <section className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {ev.description && ev.description.trim().length > 0
                      ? ev.description
                      : "Deskripsi event belum tersedia. Nantikan pembaruan informasi lengkap mengenai rangkaian acara, aktivitas, dan detail lainnya di halaman ini."}
                  </p>
                </section>
              </CardContent>
            </Card>

            {restPhotos.length > 0 ? (
              <>
                <Separator />
                <div id="gallery" />
                <EventGallery title={ev.title} photos={restPhotos} />
              </>
            ) : (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Galeri</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Belum ada foto tambahan untuk event ini.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <Card className="shadow-sm lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="text-base">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ShareButton className="w-full" />
                <AddToCalendar
                  title={ev.title}
                  description={ev.description ?? ev.title}
                  location={ev.location ?? ""}
                  startsAt={new Date(ev.startsAt)}
                  endsAt={new Date(ev.endsAt)}
                  className="w-full"
                />
                {mapsHref ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href={mapsHref} target="_blank" rel="noreferrer">
                      <MapPin className="mr-2 h-4 w-4" />
                      Buka di Google Maps
                    </a>
                  </Button>
                ) : null}
                <ScrollTo
                  targetId="gallery"
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Loncat ke Galeri
                </ScrollTo>

                <Separator className="my-2" />

                {/* Info ringkas */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    <span className="font-medium text-foreground">Waktu:</span>{" "}
                    {new Date(ev.startsAt).toLocaleString()} —{" "}
                    {new Date(ev.endsAt).toLocaleString()}
                  </div>
                  {ev.location ? (
                    <div>
                      <span className="font-medium text-foreground">
                        Lokasi:
                      </span>{" "}
                      {ev.location}
                    </div>
                  ) : null}
                  <div>
                    <span className="font-medium text-foreground">Status:</span>{" "}
                    {ev.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
