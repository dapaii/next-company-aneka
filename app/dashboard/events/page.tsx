// app/(dashboard)/events/page.tsx
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
import { fetchEvents } from "@/services/events"; // no-store, authenticated
import { deleteEvent } from "./_actions";

/** Compat Next 14/15 */
const resolveSP = <T,>(v: T | Promise<T>) => Promise.resolve(v);

export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: { searchParams: SP | Promise<SP> }) {
  // 1) Ambil semua event (no-store)
  const events = await fetchEvents(); // EventDto[]

  // 2) Pagination dari URL
  const sp = await resolveSP(searchParams);
  const { rawPage, per } = parsePagination(sp, { defaultPer: 8, cap: 100 });

  // 3) (Opsional) sort terbaru dulu
  const sorted: EventDto[] = [...events].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // 4) clamp & slice
  const total = sorted.length;
  const { page, last } = clampPage(total, per, rawPage);
  const start = (page - 1) * per;
  const items = sorted.slice(start, start + per);

  // 5) Data minimal untuk client guards
  const guardItems: EventGuardItem[] = items.map((ev) => {
    const cover = Array.isArray(ev.photos) ? ev.photos.map(toSafeImageSrc).find(Boolean) ?? null : null;
    return { id: ev.id, title: ev.title, startsAt: ev.startsAt, endsAt: ev.endsAt, status: ev.status, cover };
  });

  return (
    <>
      {/* Client guards: toast dsb */}
      <EventsGuards events={guardItems} />

      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Events</h1>
            <p className="text-sm text-muted-foreground">Kelola event yang tampil di website kamu.</p>
          </div>

          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/events/new">
              <Plus className="h-4 w-4" />
              Tambah Event
            </Link>
          </Button>
        </div>

        {/* Empty / Grid */}
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

        {/* Pager */}
        <AdminPager page={page} per={per} total={total} searchParams={sp} basePath="/dashboard/events" />
      </main>
    </>
  );
}
