// app/(public)/events/[slug]/page.tsx
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackBar from "@/components/events/detail/BackBar";
import EventCover from "@/components/events/detail/EventCover";
import EventMeta from "@/components/events/detail/EventMeta";
import EventGallery from "@/components/events/detail/EventGallery";

import type { EventDto } from "@/types/events";
import { fetchEvents } from "@/services/events"; // pakai cached public fetch kalau ada
import { toSafeImageSrc } from "@/lib/image/safe-src";
import { isLiveNow } from "@/lib/events/live-now";
import { calcDurationHours } from "@/lib/time/calc-duration-hours";
import { ArrowLeft } from "lucide-react";

/** Next 15: params as Promise */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Ambil seluruh event lalu filter yang published & slug cocok.
  // (Optional: kalau kamu punya fetchPublicEventsCached() pakai itu.)
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

  const cover      = toSafeImageSrc(ev.photos[0] ?? null);
  const restPhotos = ev.photos.slice(1).map(toSafeImageSrc).filter((s): s is string => !!s);
  const isLive     = isLiveNow(ev.startsAt, ev.endsAt);
  const duration   = calcDurationHours(ev.startsAt, ev.endsAt);

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <BackBar isLive={isLive} status={ev.status} />

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{ev.title}</h1>
          <p className="text-sm text-muted-foreground">@{ev.slug}</p>
        </div>

        <EventCover src={cover} alt={ev.title} />

        <EventMeta
          startsAt={ev.startsAt}
          endsAt={ev.endsAt}
          durationHours={duration}
          location={ev.location}
        />

        {ev.description ? (
          <>
            <Separator />
            <section className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{ev.description}</p>
            </section>
          </>
        ) : null}

        {restPhotos.length > 0 ? (
          <>
            <Separator />
            <EventGallery title={ev.title} photos={restPhotos} />
          </>
        ) : null}
      </div>
    </main>
  );
}
