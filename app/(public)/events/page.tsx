// app/(public)/events/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublicControlsIsland from "@/components/events/controls/PublicControlsIsland";
import PublicEventsGrid from "@/components/events/list/PublicEventsGrid";
import PublicPager from "@/components/events/pager/PublicPager";

import type { EventDto } from "@/types/events";
import type { Scope, Sort } from "@/types/filters";

import { fetchEvents } from "@/services/events";
import { resolveSP } from "@/lib/next/resolve-sp";
import { parseFilters, applyFilters, type SP } from "@/lib/events/public-filters";
import { parsePagination, clampPage } from "@/lib/url/parse-pagination";

export const revalidate = 60;

export default async function PublicEventsPage({
  searchParams,
}: { searchParams: SP | Promise<SP> }) {
  // 1) Data & filter hanya published
  const events = await fetchEvents();
  const published: EventDto[] = events.filter((e) => e.status === "published");

  // 2) Query (compat Next14/15) + filter pipeline
  const sp = await resolveSP(searchParams);
  const { q, scope, sort }   = parseFilters(sp);
  const { rawPage, per }     = parsePagination(sp, { defaultPer: 6, cap: 100 });
  const filtered             = applyFilters(published, q, scope, sort);

  // 3) Pagination (clamp + slice)
  const total        = filtered.length;
  const { page }     = clampPage(total, per, rawPage);
  const start        = (page - 1) * per;
  const paginated    = filtered.slice(start, start + per);

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

        {/* Client-only controls */}
        <PublicControlsIsland
          initialQuery={q}
          initialScope={scope as Scope}
          initialSort={sort as Sort}
          total={total}
        />

        {/* List / Empty */}
        {paginated.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Tidak ada event</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coba hapus filter, ganti kata kunci, atau pindah halaman.
            </CardContent>
          </Card>
        ) : (
          <div id="events-grid">
            <PublicEventsGrid items={paginated} page={page} />
          </div>
        )}

        {/* Pager (pakai parsePagination/clampPage yang sudah ada) */}
        <PublicPager
          page={page}
          per={per}
          total={total}
          basePath="/events"
          searchParams={sp}
        />
      </div>
    </main>
  );
}
