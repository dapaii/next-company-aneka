import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import EventsGuards, { type EventGuardItem } from "@/components/forms/EventsGuards";
import EventsGrid from "@/components/dashboard/events/EventsGrid";
import AdminPager from "@/components/events/pager/AdminPager";

import type { SP } from "@/lib/url/parse-pagination";
import { parsePagination, clampPage } from "@/lib/url/parse-pagination";
import { toSafeImageSrc } from "@/lib/image/safe-src";

import type { EventDto } from "@/types/events";
import { fetchEvents } from "@/services/events";
import { deleteEvent } from "./_actions";

const resolveSP = <T,>(v: T | Promise<T>) => Promise.resolve(v);

export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: { searchParams: SP | Promise<SP> }) {
  let events: EventDto[] = [];
  try {
    events = await fetchEvents();
  } catch (err) {
    console.error("Gagal fetch events:", err);
  }

  const sp = await resolveSP(searchParams);
  const { rawPage, per } = parsePagination(sp, { defaultPer: 8, cap: 100 });

  const sorted = [...events].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const total = sorted.length;
  const { page } = clampPage(total, per, rawPage);
  const start = (page - 1) * per;
  const items = sorted.slice(start, start + per);

  const guardItems: EventGuardItem[] = items.map((ev) => {
    const cover =
      Array.isArray(ev.photos) && ev.photos.length > 0
        ? toSafeImageSrc(ev.photos[0])
        : null;

    return {
      id: ev.id,
      title: ev.title,
      startsAt: ev.startsAt,
      endsAt: ev.endsAt,
      status: ev.status,
      cover,
    };
  });

  return (
    <>
      <EventsGuards events={guardItems} />

      <main className="p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Events</h1>
            <p className="text-sm text-muted-foreground">
              Kelola event yang tampil di website kamu.
            </p>
          </div>

          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/events/new">
              <Plus className="h-4 w-4" />
              Tambah Event
            </Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Belum ada event</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Kamu belum membuat event. Klik tombol “Tambah Event” untuk mulai.
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/dashboard/events/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Event Pertama
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <EventsGrid items={items} onDeleteAction={deleteEvent} />
        )}

        <AdminPager
          page={page}
          per={per}
          total={total}
          searchParams={sp}
          basePath="/dashboard/events"
        />
      </main>
    </>
  );
}
